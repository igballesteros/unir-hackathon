#!/bin/bash

# Script para obtener la IP local en macOS/Linux

echo "🔍 Obteniendo tu IP local..."
echo ""

# macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null)
    if [ -z "$IP" ]; then
        IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)
    fi
# Linux
else
    IP=$(hostname -I | awk '{print $1}' 2>/dev/null)
    if [ -z "$IP" ]; then
        IP=$(ip route get 8.8.8.8 2>/dev/null | awk '{print $7; exit}')
    fi
fi

if [ -z "$IP" ]; then
    echo "❌ No se pudo obtener la IP local"
    echo "Intenta ejecutar manualmente:"
    echo "  macOS: ifconfig | grep 'inet ' | grep -v 127.0.0.1"
    echo "  Linux: hostname -I"
else
    echo "✅ Tu IP local es: $IP"
    echo ""
    echo "📋 URLs para compartir:"
    echo "   Frontend: http://$IP:5173"
    echo "   Backend:  http://$IP:3000"
    echo ""
    echo "💡 Asegúrate de que ambos servidores estén corriendo:"
    echo "   1. Backend:  cd backend && npm run dev"
    echo "   2. Frontend: cd frontend && npm run dev"
fi

