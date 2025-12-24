#!/bin/bash

# Script para corregir las dependencias de testing
# Ejecuta: bash fix-test-deps.sh

echo "🔧 Corrigiendo dependencias de testing..."

# Remover dependencias de vitest con versiones incorrectas
pnpm remove @vitest/coverage-v8 @vitest/ui vitest 2>/dev/null || true

# Instalar versiones compatibles
echo "📦 Instalando vitest@^1.6.1..."
pnpm add -D vitest@^1.6.1 @vitest/ui@^1.6.1 @vitest/coverage-v8@^1.6.1

echo "✅ Dependencias corregidas!"
echo ""
echo "Ahora puedes ejecutar:"
echo "  pnpm test:run        # Ejecutar tests una vez"
echo "  pnpm test            # Ejecutar tests en modo watch"
echo "  pnpm test:coverage   # Ver cobertura de código"

