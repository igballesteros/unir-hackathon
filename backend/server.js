import express from 'express';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// Inicializar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Función para asignar fundación según reglas
function asignarFundacion(tipoPrenda, grupo, estado) {
  const tipoLower = tipoPrenda.toLowerCase();
  const grupoLower = grupo.toLowerCase();
  
  // Fundación Costa Viva: ropa ligera + niños 8-12 años
  if ((tipoLower.includes('camiseta') || tipoLower.includes('shorts') || 
       tipoLower.includes('playera') || tipoLower.includes('camisa') ||
       tipoLower.includes('pantalón corto') || tipoLower.includes('pantalon corto')) &&
      (grupoLower.includes('niño') || grupoLower.includes('niña') || grupoLower.includes('infantil'))) {
    return {
      nombre: 'Fundación Costa Viva',
      descripcion: 'Ropa ligera para niños 8-12 años en la costa'
    };
  }
  
  // Fundación Abrigo Andino: abrigos/suéteres + adultos
  if ((tipoLower.includes('abrigo') || tipoLower.includes('suéter') || 
       tipoLower.includes('sweater') || tipoLower.includes('chaqueta') ||
       tipoLower.includes('buzo') || tipoLower.includes('jersey')) &&
      (grupoLower.includes('adulto') || grupoLower.includes('adult'))) {
    return {
      nombre: 'Fundación Abrigo Andino',
      descripcion: 'Abrigos y suéteres para adultos en la Sierra'
    };
  }
  
  // Default
  return {
    nombre: 'Fundación General',
    descripcion: 'Acepta todo tipo de prendas'
  };
}

// Endpoint para analizar prenda
app.post('/api/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OPENAI_API_KEY no configurada' });
    }

    // Leer imagen como base64
    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image = imageBuffer.toString('base64');

    // Llamar a OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analiza esta imagen de una prenda de ropa y responde SOLO con un JSON válido en este formato exacto:
{
  "tipoPrenda": "camiseta|pantalón|abrigo|suéter|shorts|etc",
  "grupo": "niño|niña|adulto|adulta",
  "estado": "bueno|usado|regular|excelente"
}

Sé específico con el tipo de prenda. Para el grupo, determina si es para niño/niña (tallas pequeñas, diseño infantil) o adulto. Para el estado, evalúa el desgaste visible.`
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/${req.file.mimetype.split('/')[1]};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 200
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
        throw new Error('No se encontró JSON en la respuesta');
      }
    } catch (parseError) {
      console.error('Error parseando respuesta de OpenAI:', content);
      return res.status(500).json({ 
        error: 'Error procesando respuesta de la IA',
        rawResponse: content 
      });
    }

    // Aplicar reglas de asignación
    const fundacion = asignarFundacion(
      analisis.tipoPrenda || 'desconocido',
      analisis.grupo || 'desconocido',
      analisis.estado || 'desconocido'
    );

    // Retornar resultado
    res.json({
      tipoPrenda: analisis.tipoPrenda,
      grupo: analisis.grupo,
      estado: analisis.estado,
      fundacion: fundacion
    });

  } catch (error) {
    // Limpiar archivo si existe
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error('Error en /api/analyze:', error);
    res.status(500).json({ 
      error: 'Error al analizar la imagen',
      message: error.message 
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

