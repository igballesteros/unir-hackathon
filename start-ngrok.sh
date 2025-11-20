#!/bin/bash

# Script para iniciar backend, frontend y ngrok automáticamente
# Requiere: ngrok instalado (brew install ngrok o desde ngrok.com)

echo "🚀 Iniciando aplicación con ngrok..."
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar si ngrok está instalado
if ! command -v ngrok &> /dev/null; then
    echo -e "${RED}❌ ngrok no está instalado${NC}"
    echo ""
    echo "Instala ngrok con uno de estos métodos:"
    echo "  macOS: brew install ngrok"
    echo "  O descarga desde: https://ngrok.com/download"
    echo ""
    exit 1
fi

# Verificar si hay un authtoken configurado (opcional pero recomendado)
if ! ngrok config check &> /dev/null; then
    echo -e "${YELLOW}⚠️  ngrok no tiene authtoken configurado${NC}"
    echo "Es recomendable configurarlo para URLs más estables:"
    echo "  1. Crea cuenta en https://ngrok.com"
    echo "  2. Ejecuta: ngrok config add-authtoken TU_TOKEN"
    echo ""
    read -p "¿Continuar sin authtoken? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Crear directorio para logs si no existe
mkdir -p .ngrok-logs

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Deteniendo procesos...${NC}"
    kill $BACKEND_PID $FRONTEND_PID $NGROK_BACKEND_PID $NGROK_FRONTEND_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Iniciar backend
echo -e "${GREEN}📦 Iniciando backend...${NC}"
cd backend
npm run dev > ../.ngrok-logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..
sleep 2

# Iniciar frontend
echo -e "${GREEN}🎨 Iniciando frontend...${NC}"
cd frontend
npm run dev > ../.ngrok-logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..
sleep 3

# Iniciar ngrok para backend
echo -e "${GREEN}🌐 Iniciando túnel ngrok para backend (puerto 3000)...${NC}"
ngrok http 3000 --log=stdout > .ngrok-logs/ngrok-backend.log 2>&1 &
NGROK_BACKEND_PID=$!
sleep 3

# Iniciar ngrok para frontend
echo -e "${GREEN}🌐 Iniciando túnel ngrok para frontend (puerto 5173)...${NC}"
ngrok http 5173 --log=stdout > .ngrok-logs/ngrok-frontend.log 2>&1 &
NGROK_FRONTEND_PID=$!
sleep 3

# Obtener URLs de ngrok
echo ""
echo -e "${GREEN}✅ Servidores iniciados${NC}"
echo ""
echo "📋 Obteniendo URLs de ngrok..."
echo ""

# Esperar un poco más para que ngrok se inicialice
sleep 2

# Intentar obtener URLs de la API de ngrok (requiere authtoken)
BACKEND_URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | grep -o '"public_url":"https://[^"]*' | head -1 | cut -d'"' -f4)
FRONTEND_URL=$(curl -s http://localhost:4041/api/tunnels 2>/dev/null | grep -o '"public_url":"https://[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$BACKEND_URL" ]; then
    echo -e "${YELLOW}⚠️  No se pudo obtener la URL del backend automáticamente${NC}"
    echo "   Abre http://localhost:4040 en tu navegador para ver la URL del backend"
    BACKEND_URL="http://localhost:4040"
else
    echo -e "${GREEN}✅ Backend URL: ${BACKEND_URL}${NC}"
fi

if [ -z "$FRONTEND_URL" ]; then
    echo -e "${YELLOW}⚠️  No se pudo obtener la URL del frontend automáticamente${NC}"
    echo "   Abre http://localhost:4041 en tu navegador para ver la URL del frontend"
    FRONTEND_URL="http://localhost:4041"
else
    echo -e "${GREEN}✅ Frontend URL: ${FRONTEND_URL}${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 ¡Todo listo!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 URLs para compartir:"
echo ""
if [ "$BACKEND_URL" != "http://localhost:4040" ]; then
    echo -e "   Backend:  ${GREEN}${BACKEND_URL}${NC}"
fi
if [ "$FRONTEND_URL" != "http://localhost:4041" ]; then
    echo -e "   Frontend: ${GREEN}${FRONTEND_URL}${NC}"
fi
echo ""
echo "🔧 Para ver las URLs manualmente:"
echo "   Backend:  http://localhost:4040"
echo "   Frontend: http://localhost:4041"
echo ""
echo "⚠️  IMPORTANTE: Necesitas configurar la URL del backend en el frontend"
echo ""
echo "Opción 1: Crear archivo frontend/.env.local con:"
if [ "$BACKEND_URL" != "http://localhost:4040" ]; then
    echo "   VITE_API_URL=${BACKEND_URL}/api"
else
    echo "   VITE_API_URL=https://TU_URL_NGROK_BACKEND/api"
fi
echo ""
echo "Opción 2: Reiniciar frontend con variable de entorno:"
if [ "$BACKEND_URL" != "http://localhost:4040" ]; then
    echo "   cd frontend && VITE_API_URL=${BACKEND_URL}/api npm run dev"
else
    echo "   cd frontend && VITE_API_URL=https://TU_URL_NGROK_BACKEND/api npm run dev"
fi
echo ""
echo "📝 Logs disponibles en: .ngrok-logs/"
echo ""
echo -e "${YELLOW}Presiona Ctrl+C para detener todos los servicios${NC}"
echo ""

# Mantener el script corriendo
wait

