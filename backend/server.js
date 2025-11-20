import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { FOUNDATIONS } from "./foundations.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar CORS
app.use(cors());
app.use(express.json());

// Configurar Multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(
        new Error(
          "Solo se permiten archivos de imagen (jpeg, jpg, png, gif, webp)"
        )
      );
    }
  },
});

// Inicializar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Función para inferir el clima basado en el tipo de prenda
function inferirClima(tipoPrenda) {
  const tipoLower = tipoPrenda.toLowerCase();

  // Prendas de calor (ligeras)
  const prendasCalor = [
    "camiseta",
    "polo",
    "blusa ligera",
    "shorts",
    "playera",
    "camisa",
    "pantalón corto",
    "pantalon corto",
    "short",
    "sandalias",
    "camiseta sin mangas",
  ];

  // Prendas de frío (abrigos)
  const prendasFrio = [
    "abrigo",
    "chompa",
    "suéter",
    "sweater",
    "chaqueta",
    "buzo",
    "jersey",
    "chamarra",
    "parka",
    "guantes",
    "bufanda",
    "gorro",
  ];

  if (prendasCalor.some((prenda) => tipoLower.includes(prenda))) {
    return "calor";
  }

  if (prendasFrio.some((prenda) => tipoLower.includes(prenda))) {
    return "frio";
  }

  // Por defecto, mixto
  return "mixto";
}

// Función para normalizar el grupo objetivo
function normalizarGrupo(grupo) {
  const grupoLower = grupo.toLowerCase();

  if (
    grupoLower.includes("niño") ||
    grupoLower.includes("niña") ||
    grupoLower.includes("infantil")
  ) {
    return "niño";
  }

  if (grupoLower.includes("adulto") || grupoLower.includes("adult")) {
    return "adulto";
  }

  return grupoLower;
}

// Función pura para seleccionar la fundación más apropiada para un item
// Recibe: item con campos { type, group, condition, climate }
// Recibe: foundations (array de fundaciones)
// Devuelve: { foundationId, foundationName, reason }
function selectFoundationForItem(item, foundations) {
  const { type, group, condition, climate } = item;
  const groupNormalized = normalizarGrupo(group || "");

  // Paso 1: Filtrar fundaciones donde climateFocus contenga el climate del item
  let candidatas = foundations.filter((foundation) =>
    foundation.climateFocus.includes(climate)
  );

  // Paso 2: Si no hay coincidencias exactas con el climate, permitir "mixto" como comodín
  if (candidatas.length === 0) {
    candidatas = foundations.filter((foundation) =>
      foundation.climateFocus.includes("mixto")
    );
  }

  // Paso 3: Priorizar las que incluyan el group del item en targetGroups
  let mejorMatch = null;
  let mayorPuntaje = 0;

  for (const fundacion of candidatas) {
    let puntaje = 0;

    // Prioridad alta: coincidencia de grupo objetivo
    if (fundacion.targetGroups.includes(groupNormalized)) {
      puntaje += 10; // Peso muy alto para el grupo objetivo
    }

    // Prioridad media: coincidencia exacta de clima (más específica que mixto)
    if (fundacion.climateFocus.includes(climate) && climate !== "mixto") {
      puntaje += 5;
    }

    if (puntaje > mayorPuntaje) {
      mayorPuntaje = puntaje;
      mejorMatch = fundacion;
    }
  }

  // Paso 4: Si aún no hay match, usar la primera fundación como fallback
  if (!mejorMatch) {
    mejorMatch = foundations[0];
  }

  // Generar razón de la selección
  let reason = "";
  if (mejorMatch.climateFocus.includes(climate)) {
    if (mejorMatch.targetGroups.includes(groupNormalized)) {
      reason = `Coincidencia perfecta: clima "${climate}" y grupo "${groupNormalized}"`;
    } else {
      reason = `Coincidencia de clima "${climate}", aunque no especifica grupo "${groupNormalized}"`;
    }
  } else if (mejorMatch.climateFocus.includes("mixto")) {
    if (mejorMatch.targetGroups.includes(groupNormalized)) {
      reason = `Coincidencia de grupo "${groupNormalized}" con fundación que acepta clima mixto`;
    } else {
      reason = "Asignado a fundación que acepta clima mixto (fallback)";
    }
  } else {
    reason = "Asignado como fundación por defecto";
  }

  return {
    foundationId: mejorMatch.id,
    foundationName: mejorMatch.name,
    reason: reason,
    foundation: mejorMatch, // Incluir el objeto completo para la función de IA
  };
}

// Función opcional para generar explicación con IA
// Recibe: item { type, group, condition, climate }
// Recibe: foundation { name, regions, climateFocus, targetGroups, description }
// Devuelve: string con la explicación generada por IA, o reason determinista como fallback
async function generateFoundationExplanationWithAI(
  item,
  foundation,
  fallbackReason
) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.warn(
        "OPENAI_API_KEY no configurada, usando explicación determinista"
      );
      return fallbackReason;
    }

    // Construir el prompt en español
    const prompt = `Te doy las características de una prenda y el perfil de una fundación. 

Prenda:
- Tipo: ${item.type}
- Grupo: ${item.group}
- Estado: ${item.condition}
- Clima: ${item.climate}

Fundación: ${foundation.name}
- Regiones: ${foundation.regions.join(", ")}
- Enfoque climático: ${foundation.climateFocus.join(", ")}
- Grupos objetivo: ${foundation.targetGroups.join(", ")}
- Descripción: ${foundation.description}

Redacta en 1-2 frases por qué es una buena idea enviar esta prenda a esta fundación, mencionando la región y a quién ayuda. Sé claro y conciso.`;

    // Llamar a OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    // Extraer la explicación
    const explicacion = response.choices[0]?.message?.content?.trim();

    if (!explicacion) {
      throw new Error("La IA no devolvió una explicación");
    }

    return explicacion;
  } catch (error) {
    // En caso de error, usar la explicación determinista como fallback
    console.error("Error generando explicación con IA:", error.message);
    console.log("Usando explicación determinista como fallback");
    return fallbackReason;
  }
}

// Endpoint para analizar prenda
app.post("/api/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No se proporcionó ninguna imagen" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OPENAI_API_KEY no configurada" });
    }

    // Leer imagen como base64
    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image = imageBuffer.toString("base64");

    // Llamar a OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analiza esta imagen de una prenda de ropa y responde SOLO con un JSON válido en este formato exacto:
{
  "tipoPrenda": "camiseta|pantalón|abrigo|suéter|shorts|etc",
  "grupo": "niño|niña|adulto|adulta",
  "estado": "bueno|usado|regular|excelente"
}

Sé específico con el tipo de prenda. Para el grupo, determina si es para niño/niña (tallas pequeñas, diseño infantil) o adulto. Para el estado, evalúa el desgaste visible.`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/${
                  req.file.mimetype.split("/")[1]
                };base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 200,
    });

    // Limpiar archivo temporal
    fs.unlinkSync(req.file.path);

    // Extraer respuesta
    const content = response.choices[0].message.content;

    // Intentar parsear JSON de la respuesta
    let analisis;
    try {
      // Limpiar la respuesta para extraer solo el JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analisis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No se encontró JSON en la respuesta");
      }
    } catch (parseError) {
      console.error("Error parseando respuesta de OpenAI:", content);
      return res.status(500).json({
        error: "Error procesando respuesta de la IA",
        rawResponse: content,
      });
    }

    // Normalizar campos del análisis
    const tipoPrenda = analisis.tipoPrenda || "desconocido";
    const grupo = analisis.grupo || "desconocido";
    const estado = analisis.estado || "desconocido";
    const grupoNormalizado = normalizarGrupo(grupo);

    // Inferir el clima basado en el tipo de prenda
    const climate = inferirClima(tipoPrenda);

    // Crear objeto item para la función de selección
    const item = {
      type: tipoPrenda,
      group: grupoNormalizado,
      condition: estado,
      climate: climate,
    };

    // Seleccionar la fundación apropiada usando la función pura
    const fundacionSeleccionada = selectFoundationForItem(item, FOUNDATIONS);

    // Generar explicación con IA (con fallback a reason determinista)
    const explicacion = await generateFoundationExplanationWithAI(
      item,
      fundacionSeleccionada.foundation,
      fundacionSeleccionada.reason
    );

    // Retornar resultado con el campo climate añadido
    res.json({
      tipoPrenda: tipoPrenda,
      grupo: grupo,
      estado: estado,
      climate: climate,
      fundacion: {
        id: fundacionSeleccionada.foundationId,
        nombre: fundacionSeleccionada.foundationName,
        reason: explicacion, // Usar la explicación de IA (o fallback si falló)
      },
    });
  } catch (error) {
    // Limpiar archivo si existe
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error("Error en /api/analyze:", error);
    res.status(500).json({
      error: "Error al analizar la imagen",
      message: error.message,
    });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
