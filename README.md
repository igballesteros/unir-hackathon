# Demo Hackathon - Asignación de Ropa a Fundaciones

Demo funcional que utiliza IA (OpenAI Vision API) para analizar prendas de ropa y asignarlas automáticamente a fundaciones según reglas específicas.

## 🚀 Características

- **Análisis con IA**: Utiliza OpenAI Vision API para determinar:
  - Tipo de prenda (camiseta, pantalón, abrigo, etc.)
  - Grupo (niño/adulto)
  - Estado aproximado (bueno, usado, etc.)

- **Asignación Inteligente**: Aplica reglas hardcodeadas para asignar prendas a fundaciones:
  - **Fundación Costa Viva**: Ropa ligera para niños 8-12 años
  - **Fundación Abrigo Andino**: Abrigos y suéteres para adultos
  - **Fundación General**: Para el resto de prendas

## 📋 Requisitos Previos

- Node.js 18+ instalado
- Cuenta de OpenAI con API key

## 🔑 Obtención de OpenAI API Key

1. Ve a [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Inicia sesión o crea una cuenta
3. Haz clic en "Create new secret key"
4. Copia la API key (solo se muestra una vez, guárdala bien)
5. Pégala en el archivo `.env` del backend (ver instrucciones abajo)

## 🛠️ Instalación

### 1. Clonar/Descargar el proyecto

```bash
cd unir-hackathon
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

Crear archivo `.env` en la carpeta `backend/`:

```bash
cp .env.example .env
```

Editar `.env` y agregar tu API key:

```
OPENAI_API_KEY=sk-tu-api-key-aqui
PORT=3000
```

### 3. Configurar Frontend

```bash
cd ../frontend
npm install
```

## ▶️ Ejecución

### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

El servidor estará corriendo en `http://localhost:3000`

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📖 Uso

1. Abre `http://localhost:5173` en tu navegador
2. Haz clic en el área de carga y selecciona una imagen de una prenda
3. Verás un preview de la imagen
4. Haz clic en "Analizar Prenda"
5. Espera unos segundos mientras la IA analiza la imagen
6. Verás el resultado con:
   - Tipo de prenda detectado
   - Grupo (niño/adulto)
   - Estado
   - Fundación sugerida

## 🏗️ Estructura del Proyecto

```
unir-hackathon/
├── backend/
│   ├── server.js          # Servidor Express con endpoint /api/analyze
│   ├── package.json
│   └── .env               # Variables de entorno (crear manualmente)
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Componente principal
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
└── README.md
```

## 🔧 Tecnologías Utilizadas

**Backend:**
- Node.js + Express
- OpenAI API (Vision)
- Multer (upload de imágenes)
- CORS

**Frontend:**
- React + Vite
- Tailwind CSS
- Axios

## ⚠️ Notas Importantes

- El proyecto está configurado para desarrollo local
- Las imágenes subidas se guardan temporalmente y se eliminan después del análisis
- Límite de tamaño de imagen: 5MB
- Formatos soportados: JPEG, JPG, PNG, GIF, WEBP

## 🐛 Solución de Problemas

**Error: "OPENAI_API_KEY no configurada"**
- Verifica que el archivo `.env` existe en `backend/`
- Verifica que la variable `OPENAI_API_KEY` está correctamente escrita
- Reinicia el servidor backend

**Error de CORS**
- Asegúrate de que el backend está corriendo en el puerto 3000
- Verifica que el frontend está apuntando a `http://localhost:3000`

**Error al analizar imagen**
- Verifica que tienes créditos en tu cuenta de OpenAI
- Verifica que la API key es válida
- Revisa la consola del backend para más detalles

## 📝 Licencia

Este es un proyecto de demo para hackathon.

