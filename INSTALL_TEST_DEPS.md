# 📦 Instalación de Dependencias de Testing

Para ejecutar los tests, necesitas instalar las dependencias de desarrollo.

## Instalación

### Opción 1: Script automático (recomendado)
```bash
bash fix-test-deps.sh
```

### Opción 2: Con pnpm (manual)
```bash
pnpm install
pnpm add -D vitest@^1.6.1 @vitest/ui@^1.6.1 @vitest/coverage-v8@^1.6.1
```

### Opción 3: Con npm
```bash
npm install
npm install --save-dev vitest@^1.6.1 @vitest/ui@^1.6.1 @vitest/coverage-v8@^1.6.1
```

**⚠️ Importante:** Todas las dependencias de vitest deben estar en la misma versión (1.6.1) para evitar conflictos.

## Verificar Instalación

Después de instalar, verifica que todo esté correcto:

```bash
pnpm test:run
# o
npm run test:run
```

Si ves errores, asegúrate de que:
1. Node.js 18+ está instalado
2. Las dependencias se instalaron correctamente
3. El archivo `vitest.config.ts` existe

## Problemas Comunes

### Error: "Cannot find module 'vitest'"
Ejecuta nuevamente:
```bash
pnpm install
# o
npm install
```

### Error: "unmet peer vitest@4.0.16: found 1.6.1"
Este error ocurre cuando las versiones de vitest no coinciden. Solución:
```bash
# Remover dependencias incorrectas
pnpm remove @vitest/coverage-v8 @vitest/ui vitest

# Instalar versiones compatibles
pnpm add -D vitest@^1.6.1 @vitest/ui@^1.6.1 @vitest/coverage-v8@^1.6.1
```

O simplemente ejecuta:
```bash
bash fix-test-deps.sh
```

### Error con pnpm store
Si tienes problemas con pnpm store, intenta:
```bash
pnpm install --force
```

O usa npm en su lugar:
```bash
npm install
npm install --save-dev vitest@^1.6.1 @vitest/ui@^1.6.1 @vitest/coverage-v8@^1.6.1
```

