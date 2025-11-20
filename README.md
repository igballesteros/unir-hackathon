# AMANU - Camino de Ayuda

Plataforma inteligente de donación de ropa que utiliza Inteligencia Artificial para analizar prendas y asignarlas automáticamente a fundaciones según sus necesidades específicas.

## 🚀 Características Principales

- **Análisis con IA**: Utiliza OpenAI Vision API para analizar imágenes de prendas y determinar:
  - Tipo de prenda (camiseta, pantalón, abrigo, etc.)
  - Grupo objetivo (niño/adulto)
  - Estado de la prenda (bueno, usado, excelente, etc.)
  - Clima apropiado (calor, frío, mixto)

- **Asignación Inteligente**: Sistema de matching que asigna prendas a fundaciones basándose en:
  - Enfoque climático de la fundación
  - Grupos objetivo (niños, adultos)
  - Región geográfica

- **Gestión Multi-rol**: Plataforma con tres tipos de usuarios:
  - **Donantes**: Suben prendas, ven sus donaciones y beneficios tributarios
  - **Fundaciones**: Gestionan donaciones recibidas y marcan entregas
  - **Beneficiarios**: Ven las donaciones que han recibido

- **Seguimiento de Donaciones**: Sistema completo de seguimiento con estados:
  - Pendiente
  - En camino
  - Entregado

- **Beneficios Tributarios**: Cálculo referencial de beneficios tributarios para donantes

## 📋 Requisitos Previos

- Node.js 18+ instalado
- npm o yarn
- Cuenta de OpenAI con API key

## 🔑 Configuración de OpenAI API Key

1. Ve a [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Inicia sesión o crea una cuenta
3. Haz clic en "Create new secret key"
4. Copia la API key
5. Configúrala en el archivo `.env` del backend (ver instrucciones abajo)

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd unir-hackathon
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

Crear archivo `.env` en la carpeta `backend/`:

```bash
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
2. Selecciona tu rol (Donante o Fundación)
3. **Si eres Donante**:
   - Sube una foto de una prenda
   - Haz clic en "Analizar Prenda"
   - Revisa la asignación automática a una fundación
   - Consulta tus donaciones y beneficios tributarios
4. **Si eres Fundación**:
   - Revisa las donaciones asignadas a tu fundación
   - Marca las donaciones como entregadas cuando las recibas

## 🏗️ Estructura del Proyecto

```
unir-hackathon/
├── backend/
│   ├── server.js          # Servidor Express con endpoints API
│   ├── foundations.js     # Configuración de fundaciones
│   ├── test-api.js        # Script de pruebas del API
│   ├── package.json
│   └── uploads/           # Directorio temporal para imágenes
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Componente principal de la aplicación
│   │   ├── Login.jsx      # Componente de login/selector de rol
│   │   ├── mockData.js    # Datos mock de usuarios y donaciones
│   │   ├── taxSummary.js  # Lógica de cálculo tributario
│   │   ├── main.jsx       # Punto de entrada de React
│   │   └── index.css      # Estilos globales
│   ├── public/
│   │   └── logo-hackathon.PNG
│   ├── index.html
│   └── package.json
└── README.md
```

## 🔧 Stack Tecnológico

### Backend
- **Node.js** + **Express**: Servidor web y API REST
- **OpenAI API (GPT-4o)**: Análisis de imágenes con visión artificial
- **Multer**: Manejo de uploads de archivos
- **CORS**: Configuración de políticas de origen cruzado
- **dotenv**: Gestión de variables de entorno

### Frontend
- **React 18**: Biblioteca de UI
- **Vite**: Build tool y dev server
- **Tailwind CSS**: Framework de estilos utility-first
- **Axios**: Cliente HTTP para llamadas al API

## 📚 Documentación Completa

Para información detallada sobre funcionalidades, arquitectura y diseño del sistema, consulta el archivo [DOCUMENTACION.md](./DOCUMENTACION.md).

## ⚠️ Notas Importantes

- El proyecto está configurado para desarrollo local
- Las imágenes subidas se guardan temporalmente y se eliminan después del análisis
- Límite de tamaño de imagen: 5MB
- Formatos soportados: JPEG, JPG, PNG, GIF, WEBP
- Los datos de usuarios y donaciones son mock (en memoria) para demostración

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

## 🧪 Pruebas

Para ejecutar las pruebas del API:

```bash
cd backend
npm test
```

Asegúrate de que el servidor esté corriendo antes de ejecutar las pruebas.

## 📝 Licencia

Este es un proyecto de demo para hackathon.
