# 📦 Instalación de Dependencias de Testing

Para ejecutar los tests, necesitas instalar las dependencias de desarrollo.

## Instalación

### Opción 1: Con pnpm (recomendado)
```bash
pnpm install
pnpm add -D vitest @vitest/ui
```

### Opción 2: Con npm
```bash
npm install
npm install --save-dev vitest @vitest/ui
```

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

### Error con pnpm store
Si tienes problemas con pnpm, intenta:
```bash
pnpm install --force
```

O usa npm en su lugar.

