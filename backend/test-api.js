#!/usr/bin/env node

/**
 * Script de pruebas básicas para el API
 *
 * Uso:
 *   node test-api.js
 *
 * Requisitos:
 *   - El servidor debe estar corriendo en http://localhost:3000
 *   - Tener una imagen de prueba en ./test-image.jpg (opcional)
 */

import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = "http://localhost:3000";
const TEST_IMAGE_PATH = path.join(__dirname, "test-image.jpg");

// Colores para la consola
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(name) {
  log(`\n🧪 ${name}`, "blue");
}

function logSuccess(message) {
  log(`✅ ${message}`, "green");
}

function logError(message) {
  log(`❌ ${message}`, "red");
}

function logWarning(message) {
  log(`⚠️  ${message}`, "yellow");
}

// Test 1: Health Check
async function testHealthCheck() {
  logTest("Test 1: Health Check");
  try {
    const response = await axios.get(`${API_URL}/health`);
    if (response.status === 200 && response.data.status === "ok") {
      logSuccess("Health check pasó correctamente");
      return true;
    } else {
      logError("Health check falló: respuesta inesperada");
      return false;
    }
  } catch (error) {
    logError(`Health check falló: ${error.message}`);
    return false;
  }
}

// Test 2: Analizar sin imagen (debe fallar)
async function testAnalyzeWithoutImage() {
  logTest("Test 2: Analizar sin imagen (error esperado)");
  try {
    await axios.post(`${API_URL}/api/analyze`);
    logError("Debería haber fallado sin imagen");
    return false;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      const errorMsg = error.response.data?.error || "";
      if (errorMsg.includes("No se proporcionó ninguna imagen")) {
        logSuccess("Error esperado recibido correctamente");
        return true;
      } else {
        logError(`Error inesperado: ${errorMsg}`);
        return false;
      }
    } else {
      logError(`Error inesperado: ${error.message}`);
      return false;
    }
  }
}

// Test 3: Analizar con imagen (si existe)
async function testAnalyzeWithImage() {
  logTest("Test 3: Analizar con imagen");

  if (!fs.existsSync(TEST_IMAGE_PATH)) {
    logWarning(`Imagen de prueba no encontrada en ${TEST_IMAGE_PATH}`);
    logWarning(
      "Saltando este test. Crea una imagen test-image.jpg en backend/ para probar."
    );
    return null; // No es un fallo, solo falta la imagen
  }

  try {
    const FormData = (await import("form-data")).default;
    const formData = new FormData();
    formData.append("image", fs.createReadStream(TEST_IMAGE_PATH));

    const response = await axios.post(`${API_URL}/api/analyze`, formData, {
      headers: formData.getHeaders(),
    });

    if (response.status === 200) {
      const data = response.data;

      // Verificar estructura de respuesta
      const requiredFields = [
        "tipoPrenda",
        "grupo",
        "estado",
        "climate",
        "fundacion",
      ];
      const missingFields = requiredFields.filter((field) => !(field in data));

      if (missingFields.length > 0) {
        logError(`Faltan campos en la respuesta: ${missingFields.join(", ")}`);
        return false;
      }

      // Verificar estructura de fundacion
      if (!data.fundacion || !data.fundacion.id || !data.fundacion.nombre) {
        logError("Estructura de fundacion incorrecta");
        return false;
      }

      logSuccess("Análisis completado correctamente");
      log(`   Tipo de prenda: ${data.tipoPrenda}`, "reset");
      log(`   Grupo: ${data.grupo}`, "reset");
      log(`   Estado: ${data.estado}`, "reset");
      log(`   Clima: ${data.climate}`, "reset");
      log(`   Fundación: ${data.fundacion.nombre}`, "reset");
      return true;
    } else {
      logError(`Status code inesperado: ${response.status}`);
      return false;
    }
  } catch (error) {
    if (error.response) {
      logError(
        `Error del servidor: ${error.response.status} - ${
          error.response.data?.error ||
          error.response.data?.message ||
          "Error desconocido"
        }`
      );
    } else if (error.code === "ECONNREFUSED") {
      logError(
        "No se pudo conectar al servidor. ¿Está corriendo en http://localhost:3000?"
      );
    } else {
      logError(`Error: ${error.message}`);
    }
    return false;
  }
}

// Test 4: Analizar con archivo inválido
async function testAnalyzeWithInvalidFile() {
  logTest("Test 4: Analizar con archivo inválido");

  try {
    const FormData = (await import("form-data")).default;
    const formData = new FormData();

    // Crear un archivo de texto temporal
    const tempFile = path.join(__dirname, "temp-test.txt");
    fs.writeFileSync(tempFile, "Este no es una imagen");
    formData.append("image", fs.createReadStream(tempFile));

    try {
      await axios.post(`${API_URL}/api/analyze`, formData, {
        headers: formData.getHeaders(),
      });
      logError("Debería haber fallado con archivo inválido");
      fs.unlinkSync(tempFile);
      return false;
    } catch (error) {
      fs.unlinkSync(tempFile);
      if (
        error.response &&
        (error.response.status === 400 || error.response.status === 500)
      ) {
        const errorMsg = error.response.data?.error || "";
        if (
          errorMsg.includes("imagen") ||
          errorMsg.includes("jpeg") ||
          errorMsg.includes("png")
        ) {
          logSuccess(
            "Error esperado recibido correctamente para archivo inválido"
          );
          return true;
        } else {
          logWarning(`Error recibido pero mensaje inesperado: ${errorMsg}`);
          return true; // Aún así cuenta como éxito si rechazó el archivo
        }
      } else {
        logError(`Error inesperado: ${error.message}`);
        return false;
      }
    }
  } catch (error) {
    logError(`Error en el test: ${error.message}`);
    return false;
  }
}

// Función principal
async function runTests() {
  log("\n🚀 Iniciando pruebas del API...\n", "blue");
  log(`URL del API: ${API_URL}\n`, "reset");

  const results = [];

  // Ejecutar tests
  results.push(await testHealthCheck());
  results.push(await testAnalyzeWithoutImage());

  const imageTestResult = await testAnalyzeWithImage();
  if (imageTestResult !== null) {
    results.push(imageTestResult);
  }

  results.push(await testAnalyzeWithInvalidFile());

  // Resumen
  log("\n" + "=".repeat(50), "blue");
  log("📊 RESUMEN DE PRUEBAS", "blue");
  log("=".repeat(50), "blue");

  const passed = results.filter((r) => r === true).length;
  const failed = results.filter((r) => r === false).length;
  const skipped = results.filter((r) => r === null).length;
  const total = results.length;

  log(`\nTotal de pruebas: ${total}`, "reset");
  log(`✅ Pasadas: ${passed}`, "green");
  log(`❌ Fallidas: ${failed}`, "red");
  if (skipped > 0) {
    log(`⚠️  Omitidas: ${skipped}`, "yellow");
  }

  if (failed === 0) {
    log("\n🎉 ¡Todas las pruebas pasaron!", "green");
    process.exit(0);
  } else {
    log("\n⚠️  Algunas pruebas fallaron. Revisa los errores arriba.", "yellow");
    process.exit(1);
  }
}

// Ejecutar
runTests().catch((error) => {
  logError(`Error fatal: ${error.message}`);
  process.exit(1);
});
