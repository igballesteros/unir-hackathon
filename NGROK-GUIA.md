# Guía para Compartir con ngrok 🚀

Esta guía te ayudará a compartir tu aplicación web usando ngrok sin necesidad de desplegarla a producción.

## 📋 Requisitos Previos

1. **Instalar ngrok:**
   ```bash
   # macOS
   brew install ngrok
   
   # O descarga desde: https://ngrok.com/download
   ```

2. **Configurar authtoken (recomendado):**
   - Crea una cuenta gratuita en https://ngrok.com
   - Obtén tu authtoken desde el dashboard
   - Ejecuta:
     ```bash
     ngrok config add-authtoken TU_TOKEN_AQUI
     ```
   
   **Nota:** Sin authtoken, las URLs cambiarán cada vez que reinicies ngrok.

## 🚀 Método Rápido (Script Automatizado)

### Opción A: Script Completo (recomendado)

El script `start-ngrok.sh` inicia todo automáticamente:

```bash
chmod +x start-ngrok.sh
./start-ngrok.sh
```

Este script:
- ✅ Inicia el backend
- ✅ Inicia el frontend
- ✅ Inicia ngrok para ambos
- ✅ Muestra las URLs públicas

### Opción B: Script Simple

Si ya tienes backend y frontend corriendo:

```bash
chmod +x ngrok-simple.sh
./ngrok-simple.sh
```

## 📝 Método Manual (Paso a Paso)

### Paso 1: Iniciar Backend

```bash
cd backend
npm run dev
```

El backend estará en `http://localhost:3000`

### Paso 2: Iniciar Frontend

En otra terminal:

```bash
cd frontend
npm run dev
```

El frontend estará en `http://localhost:5173`

### Paso 3: Crear Túnel para Backend

En otra terminal:

```bash
ngrok http 3000
```

Esto mostrará algo como:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

**Copia la URL HTTPS** (ej: `https://abc123.ngrok.io`)

### Paso 4: Crear Túnel para Frontend

En otra terminal:

```bash
ngrok http 5173
```

Esto mostrará otra URL como:
```
Forwarding  https://xyz789.ngrok.io -> http://localhost:5173
```

**Copia esta URL también** (ej: `https://xyz789.ngrok.io`)

### Paso 5: Configurar Frontend para Usar Backend en ngrok

Crea el archivo `frontend/.env.local`:

```bash
cd frontend
echo "VITE_API_URL=https://abc123.ngrok.io/api" > .env.local
```

**Importante:** Reemplaza `abc123.ngrok.io` con la URL real de tu túnel del backend.

### Paso 6: Reiniciar Frontend

Detén el frontend (Ctrl+C) y reinícialo:

```bash
npm run dev
```

Ahora el frontend usará el backend a través de ngrok.

### Paso 7: Compartir la URL del Frontend

Comparte la URL del túnel del frontend (ej: `https://xyz789.ngrok.io`) con la otra persona.

## 🔍 Ver URLs de ngrok

Si usas múltiples túneles, ngrok crea interfaces web para ver las URLs:

- **Backend ngrok:** http://localhost:4040
- **Frontend ngrok:** http://localhost:4041

Abre estas URLs en tu navegador para ver las URLs públicas.

## ⚠️ Notas Importantes

### 1. URLs Temporales
- Las URLs de ngrok cambian cada vez que reinicias (a menos que tengas plan de pago)
- Con authtoken gratuito, las URLs son más estables pero aún pueden cambiar

### 2. Límites de la Versión Gratuita
- Límite de conexiones simultáneas
- URLs pueden cambiar al reiniciar
- Límite de ancho de banda

### 3. Seguridad
- Las URLs de ngrok son públicas
- Cualquiera con la URL puede acceder
- No uses para datos sensibles sin autenticación

### 4. CORS
- El backend ya tiene CORS configurado
- Si tienes problemas, verifica que `cors()` esté habilitado en `server.js`

## 🐛 Solución de Problemas

### El frontend no puede conectarse al backend

1. **Verifica que el backend esté corriendo:**
   ```bash
   curl http://localhost:3000/health
   ```

2. **Verifica la URL en `.env.local`:**
   ```bash
   cat frontend/.env.local
   ```
   Debe ser: `VITE_API_URL=https://TU_URL_NGROK_BACKEND/api`

3. **Verifica que ngrok esté corriendo:**
   - Abre http://localhost:4040 para el backend
   - Debe mostrar el túnel activo

### Error "ngrok: command not found"

Instala ngrok:
```bash
brew install ngrok
# O descarga desde ngrok.com
```

### Las URLs cambian cada vez

Configura un authtoken:
```bash
ngrok config add-authtoken TU_TOKEN
```

### El frontend muestra errores de CORS

El backend ya tiene CORS configurado. Si persiste el problema:
1. Verifica que `cors()` esté en `server.js`
2. Reinicia el backend

## 📚 Recursos Adicionales

- Documentación de ngrok: https://ngrok.com/docs
- Dashboard de ngrok: https://dashboard.ngrok.com

## 🎯 Resumen Rápido

```bash
# 1. Iniciar backend
cd backend && npm run dev

# 2. Iniciar frontend (en otra terminal)
cd frontend && npm run dev

# 3. Iniciar ngrok para backend (en otra terminal)
ngrok http 3000
# Copia la URL: https://abc123.ngrok.io

# 4. Iniciar ngrok para frontend (en otra terminal)
ngrok http 5173
# Copia la URL: https://xyz789.ngrok.io

# 5. Configurar frontend
cd frontend
echo "VITE_API_URL=https://abc123.ngrok.io/api" > .env.local

# 6. Reiniciar frontend
npm run dev

# 7. Compartir: https://xyz789.ngrok.io
```

¡Listo! 🎉

