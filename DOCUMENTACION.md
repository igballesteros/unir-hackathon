# Documentación Técnica - AMANU

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Funcionalidades Detalladas](#funcionalidades-detalladas)
5. [Diseño y Flujo de Datos](#diseño-y-flujo-de-datos)
6. [Componentes del Sistema](#componentes-del-sistema)
7. [Algoritmo de Asignación](#algoritmo-de-asignación)
8. [API Endpoints](#api-endpoints)
9. [Estructura de Datos](#estructura-de-datos)
10. [Flujos de Usuario](#flujos-de-usuario)

---

## Introducción

AMANU (Camino de Ayuda) es una plataforma web que utiliza Inteligencia Artificial para optimizar el proceso de donación de ropa. El sistema analiza imágenes de prendas usando visión artificial y las asigna automáticamente a fundaciones según criterios específicos como clima, grupo objetivo y región geográfica.

### Objetivo

Conectar donantes con fundaciones de manera eficiente, asegurando que cada prenda llegue a la fundación más adecuada según sus necesidades y características.

---

## Arquitectura del Sistema

### Arquitectura General

El sistema sigue una arquitectura cliente-servidor con separación clara entre frontend y backend:

```
┌─────────────────┐
│   Frontend       │
│   (React + Vite) │
└────────┬─────────┘
         │ HTTP/REST
         │
┌────────▼─────────┐
│   Backend        │
│   (Express)      │
└────────┬─────────┘
         │
┌────────▼─────────┐
│   OpenAI API     │
│   (GPT-4o Vision)│
└──────────────────┘
```

### Componentes Principales

1. **Frontend (React)**: Interfaz de usuario interactiva
2. **Backend (Express)**: API REST y lógica de negocio
3. **OpenAI Vision API**: Análisis de imágenes con IA
4. **Sistema de Matching**: Algoritmo de asignación de fundaciones

---

## Stack Tecnológico

### Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Node.js | 18+ | Runtime de JavaScript |
| Express | ^4.18.2 | Framework web y API REST |
| OpenAI SDK | ^4.20.1 | Integración con GPT-4o Vision API |
| Multer | ^1.4.5-lts.1 | Manejo de uploads de archivos |
| CORS | ^2.8.5 | Políticas de origen cruzado |
| dotenv | ^16.3.1 | Gestión de variables de entorno |
| Axios | ^1.6.2 | Cliente HTTP para pruebas |

### Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | ^18.2.0 | Biblioteca de UI |
| React DOM | ^18.2.0 | Renderizado de React |
| Vite | ^5.0.8 | Build tool y dev server |
| Tailwind CSS | ^3.3.6 | Framework de estilos |
| Axios | ^1.6.2 | Cliente HTTP para API calls |
| PostCSS | ^8.4.32 | Procesamiento de CSS |
| Autoprefixer | ^10.4.16 | Prefijos CSS automáticos |

### Herramientas de Desarrollo

- **ES Modules**: Sistema de módulos moderno de JavaScript
- **Vite**: Desarrollo rápido con HMR (Hot Module Replacement)
- **Tailwind CSS**: Estilos utility-first para desarrollo rápido

---

## Funcionalidades Detalladas

### 1. Análisis de Prendas con IA

**Descripción**: El sistema utiliza OpenAI Vision API (GPT-4o) para analizar imágenes de prendas de ropa.

**Proceso**:
1. El usuario sube una imagen de una prenda
2. La imagen se convierte a base64
3. Se envía a OpenAI Vision API con un prompt estructurado
4. La IA devuelve un JSON con:
   - `tipoPrenda`: Tipo específico de prenda (camiseta, pantalón, abrigo, etc.)
   - `grupo`: Grupo objetivo (niño, niña, adulto, adulta)
   - `estado`: Estado de la prenda (bueno, usado, regular, excelente)

**Características**:
- Análisis automático sin intervención manual
- Detección de tipo de prenda específica
- Identificación de grupo objetivo basado en tamaño y diseño
- Evaluación del estado de desgaste

### 2. Inferencia de Clima

**Descripción**: Sistema que infiere el clima apropiado para una prenda basándose en su tipo.

**Categorías de Clima**:
- **Calor**: Prendas ligeras (camisetas, shorts, sandalias, etc.)
- **Frío**: Prendas de abrigo (abrigos, suéteres, chaquetas, etc.)
- **Mixto**: Prendas que pueden usarse en ambos climas

**Implementación**: Función `inferirClima()` que mapea tipos de prenda a categorías climáticas.

### 3. Sistema de Asignación Inteligente

**Descripción**: Algoritmo que asigna prendas a fundaciones basándose en múltiples criterios.

**Criterios de Asignación**:
1. **Clima**: Coincidencia entre clima de la prenda y enfoque climático de la fundación
2. **Grupo Objetivo**: Coincidencia entre grupo de la prenda y grupos objetivo de la fundación
3. **Región Geográfica**: Consideración de la región donde opera la fundación

**Algoritmo**:
- Filtrado por clima (con "mixto" como comodín)
- Puntuación basada en coincidencias
- Priorización de coincidencias exactas
- Fallback a fundación por defecto si no hay match

### 4. Gestión Multi-Rol

#### Rol: Donante

**Funcionalidades**:
- Subir imágenes de prendas para análisis
- Ver resultados del análisis con asignación de fundación
- Consultar historial de donaciones
- Ver resumen de impacto (total donado, entregado)
- Consultar beneficios tributarios referenciales

**Vista Principal**:
- Área de carga de imágenes con preview
- Botón de análisis
- Resultados con detalles de la prenda y fundación asignada
- Lista de donaciones realizadas
- Tarjeta de beneficios tributarios

#### Rol: Fundación

**Funcionalidades**:
- Ver donaciones asignadas a la fundación
- Ver información del donante
- Ver estado de cada donación
- Marcar donaciones como entregadas
- Ver valor estimado de donaciones

**Vista Principal**:
- Lista de donaciones recibidas
- Información detallada de cada donación
- Botón para marcar como entregado
- Resumen de impacto global

#### Rol: Beneficiario

**Funcionalidades**:
- Ver donaciones recibidas
- Ver información de la fundación y donante
- Ver estado de las donaciones

**Vista Principal**:
- Lista de donaciones recibidas
- Información de origen (fundación y donante)

### 5. Seguimiento de Donaciones

**Estados de Donación**:
- **Pendiente**: Donación creada pero no procesada
- **En camino**: Donación en tránsito hacia la fundación
- **Entregado**: Donación recibida y entregada al beneficiario

**Flujo**:
1. Donante sube prenda → Estado: Pendiente
2. Fundación recibe notificación → Estado: En camino (opcional)
3. Fundación marca como entregado → Estado: Entregado

### 6. Cálculo de Beneficios Tributarios

**Descripción**: Sistema referencial para calcular beneficios tributarios potenciales.

**Cálculos**:
- **Total Donado**: Suma de todas las donaciones con valor revisado
- **Total Entregado**: Suma de donaciones entregadas con valor revisado
- **Base de Deducción Potencial**: Base referencial para deducción de impuestos

**Nota Importante**: Los cálculos son referenciales. En Ecuador, las deducciones reales dependen de la legislación del SRI (Servicio de Rentas Internas).

### 7. Valoración de Donaciones

**Sistema de Valoración**:
- Las donaciones pueden tener un valor estimado en USD
- El valor es asignado por un experto (simulado en el sistema)
- Donaciones sin valor aparecen como "Pendiente de revisión por un experto"
- Solo donaciones con valor revisado se incluyen en cálculos tributarios

### 8. Resumen de Impacto Global

**Métricas Mostradas**:
- Total de prendas donadas
- Total de prendas entregadas
- Valor total estimado donado (USD)

**Visualización**: Tarjeta destacada en la parte superior de la aplicación.

---

## Diseño y Flujo de Datos

### Flujo de Análisis de Prenda

```
Usuario (Donante)
    │
    ├─> Sube imagen
    │
    ├─> Frontend: Preview de imagen
    │
    ├─> Click "Analizar Prenda"
    │
    ├─> POST /api/analyze
    │   │
    │   ├─> Backend: Validar archivo
    │   │
    │   ├─> Backend: Convertir a base64
    │   │
    │   ├─> OpenAI Vision API
    │   │   │
    │   │   └─> JSON: {tipoPrenda, grupo, estado}
    │   │
    │   ├─> Backend: Inferir clima
    │   │
    │   ├─> Backend: Seleccionar fundación
    │   │
    │   ├─> Backend: Generar explicación (IA opcional)
    │   │
    │   └─> Response JSON
    │
    └─> Frontend: Mostrar resultados
```

### Flujo de Gestión de Donaciones

```
Donación Creada
    │
    ├─> Estado: Pendiente
    │   │
    │   └─> Valor: Pendiente de revisión
    │
    ├─> (Experto revisa y asigna valor)
    │
    ├─> Estado: En camino
    │   │
    │   └─> Valor: Asignado
    │
    └─> Fundación marca como entregado
        │
        └─> Estado: Entregado
            │
            └─> Beneficiario asignado
```

### Flujo de Usuario por Rol

#### Donante
```
Login → Seleccionar rol "Donante"
    │
    ├─> Vista principal
    │   │
    │   ├─> Subir prenda
    │   │   └─> Analizar
    │   │       └─> Ver resultado
    │   │
    │   ├─> Ver mis donaciones
    │   │
    │   └─> Ver beneficios tributarios
```

#### Fundación
```
Login → Seleccionar rol "Fundación"
    │
    └─> Vista principal
        │
        ├─> Ver donaciones recibidas
        │
        └─> Marcar como entregado
```

#### Beneficiario
```
Login → Seleccionar rol "Beneficiario"
    │
    └─> Vista principal
        │
        └─> Ver donaciones recibidas
```

---

## Componentes del Sistema

### Backend

#### `server.js`
Servidor Express principal que maneja:
- Configuración de middleware (CORS, JSON, Multer)
- Endpoint `/api/analyze` para análisis de prendas
- Endpoint `/health` para health checks
- Integración con OpenAI API
- Lógica de asignación de fundaciones

**Funciones Principales**:
- `inferirClima(tipoPrenda)`: Infiere clima basado en tipo de prenda
- `normalizarGrupo(grupo)`: Normaliza grupo objetivo
- `selectFoundationForItem(item, foundations)`: Selecciona fundación apropiada
- `generateFoundationExplanationWithAI(item, foundation, fallbackReason)`: Genera explicación con IA

#### `foundations.js`
Módulo que exporta array de fundaciones con sus características:
- ID único
- Nombre
- Código de registro
- Ubicación (provincia, ciudad, cantón, parroquia)
- Regiones donde opera
- Enfoque climático
- Grupos objetivo
- Descripción

#### `test-api.js`
Script de pruebas automatizadas para el API:
- Health check
- Validación de errores
- Pruebas de análisis con imagen
- Validación de estructura de respuesta

### Frontend

#### `App.jsx`
Componente principal que maneja:
- Estado de autenticación (mock)
- Gestión de roles de usuario
- Lógica de upload y análisis de imágenes
- Visualización de resultados
- Gestión de donaciones
- Cálculo de métricas de impacto

**Estados Principales**:
- `isLoggedIn`: Estado de autenticación
- `userRole`: Rol actual (donor, foundation, beneficiary)
- `selectedFile`: Archivo seleccionado para análisis
- `preview`: Preview de imagen
- `result`: Resultado del análisis
- `donations`: Lista de donaciones

#### `Login.jsx`
Componente de login/selector de rol:
- Interfaz de bienvenida
- Botones para seleccionar rol
- Diseño moderno con logo

#### `mockData.js`
Datos mock para simulación:
- `USERS`: Array de usuarios (donantes, fundaciones, beneficiarios)
- `DONATIONS`: Array de donaciones de ejemplo
- Funciones auxiliares para acceso a datos

#### `taxSummary.js`
Lógica de cálculo tributario:
- `getTaxSummaryForUser(userId, donations)`: Calcula resumen tributario
- Filtra donaciones por usuario
- Calcula totales donados y entregados
- Calcula base de deducción potencial

---

## Algoritmo de Asignación

### Función: `selectFoundationForItem(item, foundations)`

**Input**:
```javascript
item = {
  type: "camiseta",
  group: "niño",
  condition: "bueno",
  climate: "calor"
}
```

**Proceso**:

1. **Normalización de Grupo**:
   - Convierte grupo a formato estándar (niño/adulto)

2. **Filtrado por Clima**:
   ```javascript
   candidatas = foundations.filter(f => 
     f.climateFocus.includes(item.climate)
   )
   ```
   - Si no hay coincidencias, usa "mixto" como comodín

3. **Puntuación**:
   - Coincidencia de grupo objetivo: +10 puntos
   - Coincidencia exacta de clima (no mixto): +5 puntos

4. **Selección**:
   - Selecciona fundación con mayor puntaje
   - Si no hay match, usa primera fundación como fallback

5. **Generación de Razón**:
   - Genera explicación determinista
   - Opcionalmente mejora con IA

**Output**:
```javascript
{
  foundationId: "fundacion-di",
  foundationName: "FUNDACIÓN DI",
  reason: "Coincidencia perfecta: clima 'calor' y grupo 'niño'",
  foundation: { /* objeto completo de fundación */ }
}
```

### Ejemplo de Asignación

**Prenda**: Camiseta para niño
- Tipo: camiseta
- Grupo: niño
- Clima inferido: calor

**Fundaciones Candidatas**:
1. FUNDACIÓN DI: `climateFocus: ["calor", "mixto"]`, `targetGroups: ["niño", "adulto"]`
   - Puntaje: 15 (10 por grupo + 5 por clima exacto)

2. FUNDACIÓN PA: `climateFocus: ["frio", "mixto"]`, `targetGroups: ["niño", "adulto"]`
   - Puntaje: 10 (10 por grupo, clima es mixto)

**Resultado**: FUNDACIÓN DI (mayor puntaje)

---

## API Endpoints

### POST `/api/analyze`

**Descripción**: Analiza una imagen de prenda y asigna una fundación.

**Request**:
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `image` (archivo de imagen)

**Response (Success - 200)**:
```json
{
  "tipoPrenda": "camiseta",
  "grupo": "niño",
  "estado": "bueno",
  "climate": "calor",
  "fundacion": {
    "id": "fundacion-di",
    "nombre": "FUNDACIÓN DI",
    "reason": "Coincidencia perfecta: clima 'calor' y grupo 'niño'"
  }
}
```

**Response (Error - 400)**:
```json
{
  "error": "No se proporcionó ninguna imagen"
}
```

**Response (Error - 500)**:
```json
{
  "error": "Error al analizar la imagen",
  "message": "Detalles del error"
}
```

### GET `/health`

**Descripción**: Health check del servidor.

**Response (200)**:
```json
{
  "status": "ok"
}
```

---

## Estructura de Datos

### Fundación

```javascript
{
  id: "fundacion-di",
  name: "FUNDACIÓN DI",
  code: "145455",
  address: "SAN PEDRO DE",
  province: "GUAYAS",
  city: "GUAYAQUIL",
  canton: "GUAYAQUIL",
  parroquia: "CHONGON B",
  institution: "Ministerio de Inc",
  classification: "Fundaciones",
  status: "Registrada",
  regions: ["costa"],
  climateFocus: ["calor", "mixto"],
  targetGroups: ["niño", "adulto"],
  description: "Fundación registrada en GUAYAS..."
}
```

### Donación

```javascript
{
  id: "don_001",
  donorId: "ana_donor",
  foundationId: "fundacion-di",
  itemDescription: "Camiseta de algodón azul para niño",
  type: "camiseta",
  group: "niño",
  condition: "bueno",
  status: "entregado", // pendiente | en_camino | entregado
  beneficiaryName: "Juan",
  estimatedValueUSD: 10.00 // null si pendiente de revisión
}
```

### Usuario

```javascript
{
  id: "ana_donor",
  name: "Ana",
  role: "donor" // donor | foundation | beneficiary
}
```

### Resultado de Análisis

```javascript
{
  tipoPrenda: "camiseta",
  grupo: "niño",
  estado: "bueno",
  climate: "calor",
  fundacion: {
    id: "fundacion-di",
    nombre: "FUNDACIÓN DI",
    reason: "Explicación de la asignación"
  }
}
```

### Resumen Tributario

```javascript
{
  totalDonatedUSD: 150.00,
  totalDeliveredUSD: 100.00,
  potentialDeductionBaseUSD: 150.00,
  year: 2024
}
```

---

## Flujos de Usuario

### Flujo Completo: Donante Analiza Prenda

1. **Login**: Usuario selecciona rol "Donante"
2. **Selección de Usuario**: Selecciona su perfil del dropdown
3. **Carga de Imagen**: 
   - Click en área de carga
   - Selecciona archivo de imagen
   - Preview automático
4. **Análisis**:
   - Click en "Analizar Prenda"
   - Loading state
   - Llamada a API
5. **Resultado**:
   - Muestra detalles de la prenda
   - Muestra fundación asignada
   - Muestra explicación de asignación
   - Aviso sobre valoración pendiente
6. **Siguiente Acción**:
   - Analizar otra prenda
   - Ver mis donaciones
   - Consultar beneficios tributarios

### Flujo Completo: Fundación Gestiona Donación

1. **Login**: Usuario selecciona rol "Fundación"
2. **Selección de Fundación**: Selecciona su fundación del dropdown
3. **Visualización**:
   - Ve lista de donaciones asignadas
   - Ve información del donante
   - Ve estado de cada donación
4. **Acción**:
   - Marca donación como entregada
   - Estado cambia a "Entregado"
   - Se actualiza en tiempo real

### Flujo Completo: Beneficiario Consulta Donaciones

1. **Login**: Usuario selecciona rol "Beneficiario"
2. **Visualización**:
   - Ve donaciones recibidas
   - Ve información de fundación y donante
   - Ve estado de las donaciones

---

## Consideraciones de Diseño

### Principios de Diseño

1. **Separación de Responsabilidades**:
   - Frontend: Presentación y UX
   - Backend: Lógica de negocio y API
   - OpenAI: Análisis de imágenes

2. **Modularidad**:
   - Funciones puras para lógica de asignación
   - Componentes React reutilizables
   - Módulos separados por funcionalidad

3. **Escalabilidad**:
   - Sistema de matching extensible
   - Fácil agregar nuevas fundaciones
   - Estructura preparada para base de datos

4. **Experiencia de Usuario**:
   - Interfaz intuitiva
   - Feedback visual inmediato
   - Estados de carga claros
   - Manejo de errores amigable

### Decisiones de Arquitectura

1. **Mock Data**: Los datos están en memoria para demostración. En producción se usaría una base de datos.

2. **Autenticación Mock**: El sistema de login es simulado. En producción se implementaría autenticación real.

3. **Valoración Manual**: El sistema simula valoración por experto. En producción podría automatizarse o integrarse con sistema de expertos.

4. **Explicación con IA Opcional**: La explicación de asignación puede generarse con IA o usar razón determinista como fallback.

---

## Mejoras Futuras

### Funcionalidades Potenciales

1. **Base de Datos**: Migrar de mock data a base de datos real (PostgreSQL, MongoDB)
2. **Autenticación Real**: Implementar sistema de autenticación (JWT, OAuth)
3. **Notificaciones**: Sistema de notificaciones para donantes y fundaciones
4. **Tracking Real**: Integración con servicios de envío para tracking real
5. **Dashboard Analytics**: Dashboard con métricas avanzadas
6. **Valoración Automatizada**: IA para estimar valor de prendas
7. **Multi-idioma**: Soporte para múltiples idiomas
8. **App Móvil**: Aplicación móvil nativa o PWA

### Optimizaciones Técnicas

1. **Caché**: Implementar caché para respuestas de OpenAI
2. **Rate Limiting**: Limitar requests por usuario
3. **Validación Avanzada**: Validación más robusta de imágenes
4. **Compresión de Imágenes**: Optimizar imágenes antes de enviar a OpenAI
5. **Testing**: Suite completa de tests unitarios e integración
6. **CI/CD**: Pipeline de despliegue automático
7. **Monitoreo**: Sistema de logging y monitoreo

---

## Conclusión

AMANU es una plataforma completa que demuestra el potencial de la IA en la optimización de procesos de donación. El sistema combina análisis inteligente de imágenes, matching algorítmico y gestión multi-rol para crear una experiencia fluida tanto para donantes como para fundaciones.

La arquitectura modular y el código limpio facilitan el mantenimiento y la extensión del sistema para futuras mejoras.

