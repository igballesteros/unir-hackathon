#!/bin/bash

# Script simplificado para usar ngrok
# Este script inicia ngrok para backend y frontend en puertos diferentes

echo "🌐 Iniciando ngrok..."
echo ""

# Verificar si ngrok está instalado
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok no está instalado"
    echo ""
    echo "Instala ngrok con:"
    echo "  brew install ngrok"
    echo "  O descarga desde: https://ngrok.com/download"
    exit 1
fi

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "🛑 Deteniendo ngrok..."
    kill $NGROK_BACKEND_PID $NGROK_FRONTEND_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Iniciar ngrok para backend en puerto 4040
echo "📡 Túnel para backend (puerto 3000) → http://localhost:4040"
ngrok http 3000 --log=stdout &
NGROK_BACKEND_PID=$!

# Esperar un segundo
sleep 1

# Iniciar ngrok para frontend en puerto 4041
echo "📡 Túnel para frontend (puerto 5173) → http://localhost:4041"
ngrok http 5173 --log=stdout &
NGROK_FRONTEND_PID=$!

echo ""
echo "✅ ngrok iniciado"
echo ""
echo "📋 URLs públicas:"
echo "   Backend:  http://localhost:4040 (ver URL pública aquí)"
echo "   Frontend: http://localhost:4041 (ver URL pública aquí)"
echo ""
echo "💡 Abre esas URLs en tu navegador para ver las URLs públicas de ngrok"
echo ""
echo "⚠️  Recuerda:"
echo "   1. Asegúrate de que backend y frontend estén corriendo"
echo "   2. Configura VITE_API_URL en frontend/.env.local con la URL pública del backend"
echo ""
echo "Presiona Ctrl+C para detener ngrok"

# Mantener el script corriendo
wait

