# 📊 Explicación del Coverage

## ¿Por qué el coverage estaba en 0%?

El coverage estaba en 0% porque los tests originales solo probaban los **mocks de Octokit**, no el código real de `src/index.ts`.

### Problema Original

```typescript
// ❌ Estos tests NO ejecutan código de index.ts
const mockOctokit = createMockOctokit();
const result = await mockOctokit.pulls.create(...);
```

Estos tests verifican que los mocks funcionan, pero no ejecutan el código real del servidor MCP.

## Solución: Refactorización para Testeabilidad

### 1. Crear Handlers Separados

Creamos `src/handlers/tools.ts` con funciones testeables:

```typescript
// ✅ Código testeable
export async function handleCreatePullRequest(octokit: Octokit, args: any) {
  // Lógica real aquí
}
```

### 2. Tests que Ejecutan Código Real

```typescript
// ✅ Estos tests SÍ ejecutan código real
const result = await handleCreatePullRequest(octokit, args);
expect(result.content).toBeDefined();
```

## Coverage Actual

```
src/handlers/tools.ts: 97.91% ✅
src/index.ts: 0% (pendiente de refactorizar)
```

## Próximos Pasos para Mejorar Coverage

### Opción 1: Refactorizar index.ts (Recomendado)

Refactorizar `index.ts` para usar los handlers:

```typescript
// En index.ts
import { handleCreatePullRequest } from './handlers/tools.js';

case "create_pull_request": {
  return await handleCreatePullRequest(octokit, args);
}
```

**Ventajas:**
- ✅ Coverage completo
- ✅ Código más modular
- ✅ Más fácil de mantener

### Opción 2: Tests de Integración del Servidor

Crear tests que prueben el servidor MCP completo:

```typescript
// Mockear antes de importar
vi.mock('@octokit/rest', ...);

// Importar después de mockear
const server = await import('../index.js');
// Probar el servidor directamente
```

**Desventajas:**
- Más complejo
- Requiere mockear todo el módulo

## Recomendación

**Refactorizar gradualmente `index.ts`** para usar los handlers. Esto:
1. Mejora el coverage inmediatamente
2. Hace el código más mantenible
3. Facilita futuros tests

## Ver Coverage

```bash
# Ver coverage completo
pnpm test:coverage

# Ver coverage solo de handlers
pnpm test:coverage --run handlers

# Ver reporte HTML
pnpm test:coverage
# Luego abre: coverage/index.html
```

## Estado Actual

- ✅ Handlers refactorizados y testeables
- ✅ Tests de handlers funcionando (97.91% coverage)
- ⏳ `index.ts` pendiente de refactorizar
- ✅ Estructura lista para mejorar coverage gradualmente

