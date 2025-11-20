# Cómo Compartir la Aplicación Web

Hay varias formas de compartir tu aplicación web sin desplegarla a producción. Aquí tienes las opciones:

## Opción 1: Red Local (Misma Wi-Fi) 🌐

Esta es la opción más simple si ambas computadoras están en la misma red Wi-Fi.

### Pasos:

1. **Obtén tu IP local:**
   ```bash
   # En macOS/Linux:
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # O más simple:
   ipconfig getifaddr en0  # macOS
   ```

2. **Inicia el backend:**
   ```bash
   cd backend
   npm run dev
   ```
   El servidor estará disponible en `http://[TU_IP]:3000`

3. **Inicia el frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   Vite mostrará la URL de red local, algo como: `http://192.168.1.100:5173`

4. **Comparte la URL del frontend** con la otra persona:
   - La URL será algo como: `http://192.168.1.100:5173`
   - Asegúrate de que el firewall permita conexiones en los puertos 3000 y 5173

### Nota de Seguridad:
- Solo funciona en la misma red local
- Asegúrate de que tu firewall permita conexiones entrantes

---

## Opción 2: Túnel Público (ngrok) 🌍

Esta opción permite compartir desde cualquier lugar, incluso si están en redes diferentes.

### Instalación de ngrok:

1. **Descarga ngrok:**
   - Ve a https://ngrok.com/download
   - O instala con Homebrew (macOS):
     ```bash
     brew install ngrok
     ```

2. **Crea una cuenta gratuita** en ngrok.com (opcional pero recomendado)

3. **Autentica ngrok** (si creaste cuenta):
   ```bash
   ngrok config add-authtoken TU_TOKEN_AQUI
   ```

### Uso:

1. **Inicia tu backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Inicia tu frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Crea un túnel para el backend** (en otra terminal):
   ```bash
   ngrok http 3000
   ```
   Esto te dará una URL como: `https://abc123.ngrok.io`

4. **Crea un túnel para el frontend** (en otra terminal):
   ```bash
   ngrok http 5173
   ```
   Esto te dará otra URL como: `https://xyz789.ngrok.io`

5. **Actualiza la URL del API en el frontend:**
   - Edita `frontend/src/App.jsx`
   - Cambia temporalmente `API_URL` a la URL del túnel del backend:
     ```javascript
     const API_URL = 'https://abc123.ngrok.io/api'
     ```

6. **Comparte la URL del túnel del frontend** con la otra persona

### Nota:
- Las URLs de ngrok cambian cada vez que lo reinicias (a menos que tengas plan de pago)
- La versión gratuita tiene límites de uso

---

## Opción 3: Túnel Público (localtunnel) 🚇

Alternativa gratuita a ngrok, más simple pero menos estable.

### Instalación:

```bash
npm install -g localtunnel
```

### Uso:

1. **Inicia tu backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Inicia tu frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Crea túnel para backend:**
   ```bash
   lt --port 3000
   ```
   Te dará una URL como: `https://random-name.loca.lt`

4. **Crea túnel para frontend:**
   ```bash
   lt --port 5173
   ```
   Te dará otra URL

5. **Actualiza la URL del API** en el frontend como en la opción 2

---

## Opción 4: Cloudflare Tunnel (Cloudflared) ☁️

Gratuito y más estable que localtunnel.

### Instalación:

```bash
# macOS
brew install cloudflare/cloudflare/cloudflared

# O descarga desde: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
```

### Uso:

1. **Inicia tus servidores** (backend y frontend)

2. **Crea túnel para backend:**
   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```

3. **Crea túnel para frontend:**
   ```bash
   cloudflared tunnel --url http://localhost:5173
   ```

4. **Actualiza la URL del API** en el frontend

---

## Recomendación

- **Para pruebas rápidas en la misma red:** Usa la Opción 1 (Red Local)
- **Para compartir desde cualquier lugar:** Usa la Opción 2 (ngrok) o Opción 4 (Cloudflare Tunnel)

---

## Solución de Problemas

### El frontend no puede conectarse al backend:
- Verifica que el backend esté corriendo
- Verifica que la URL del API sea correcta
- Si usas túnel, asegúrate de actualizar la URL del API en el frontend

### Error de CORS:
- El backend ya tiene CORS configurado, pero si tienes problemas, verifica que `cors()` esté habilitado en `server.js`

### Firewall bloquea conexiones:
- En macOS: System Settings > Network > Firewall > Options > Permitir conexiones entrantes
- En Linux: `sudo ufw allow 3000` y `sudo ufw allow 5173`

