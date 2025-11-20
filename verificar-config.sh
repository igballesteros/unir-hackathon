#!/bin/bash

# Script para verificar la configuración del proyecto
# Uso: ./verificar-config.sh

echo "🔍 Verificando configuración del proyecto..."
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Verificar Node.js
echo "📦 Verificando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✅ Node.js instalado: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Verificar npm
echo "📦 Verificando npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✅ npm instalado: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm no está instalado${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# Verificar estructura de directorios
echo "📁 Verificando estructura de directorios..."
if [ -d "backend" ]; then
    echo -e "${GREEN}✅ Directorio backend existe${NC}"
else
    echo -e "${RED}❌ Directorio backend no existe${NC}"
    ERRORS=$((ERRORS + 1))
fi

if [ -d "frontend" ]; then
    echo -e "${GREEN}✅ Directorio frontend existe${NC}"
else
    echo -e "${RED}❌ Directorio frontend no existe${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# Verificar archivos importantes
echo "📄 Verificando archivos importantes..."

if [ -f "backend/server.js" ]; then
    echo -e "${GREEN}✅ backend/server.js existe${NC}"
else
    echo -e "${RED}❌ backend/server.js no existe${NC}"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "backend/foundations.js" ]; then
    echo -e "${GREEN}✅ backend/foundations.js existe${NC}"
else
    echo -e "${RED}❌ backend/foundations.js no existe${NC}"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "frontend/src/App.jsx" ]; then
    echo -e "${GREEN}✅ frontend/src/App.jsx existe${NC}"
else
    echo -e "${RED}❌ frontend/src/App.jsx no existe${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# Verificar node_modules
echo "📦 Verificando dependencias instaladas..."

if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✅ Dependencias del backend instaladas${NC}"
else
    echo -e "${YELLOW}⚠️  Dependencias del backend no instaladas. Ejecuta: cd backend && npm install${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✅ Dependencias del frontend instaladas${NC}"
else
    echo -e "${YELLOW}⚠️  Dependencias del frontend no instaladas. Ejecuta: cd frontend && npm install${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# Verificar archivo .env
echo "🔐 Verificando configuración de entorno..."

if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✅ Archivo backend/.env existe${NC}"
    
    # Verificar si tiene OPENAI_API_KEY
    if grep -q "OPENAI_API_KEY" backend/.env && ! grep -q "OPENAI_API_KEY=sk-tu-api-key-aqui" backend/.env; then
        echo -e "${GREEN}✅ OPENAI_API_KEY configurada${NC}"
    else
        echo -e "${YELLOW}⚠️  OPENAI_API_KEY no configurada o usa valor por defecto${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${YELLOW}⚠️  Archivo backend/.env no existe. Créalo con:${NC}"
    echo "   echo 'OPENAI_API_KEY=sk-tu-api-key-aqui' > backend/.env"
    echo "   echo 'PORT=3000' >> backend/.env"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# Resumen
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ ¡Todo está configurado correctamente!${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Configuración básica OK, pero hay $WARNINGS advertencia(s)${NC}"
    exit 0
else
    echo -e "${RED}❌ Se encontraron $ERRORS error(es) y $WARNINGS advertencia(s)${NC}"
    exit 1
fi

