# 🧪 Guía de Testing

Esta guía explica cómo ejecutar y escribir tests para el servidor MCP de GitHub.

## 📋 Requisitos

- Node.js 18+
- pnpm o npm instalado

## 🚀 Instalación de Dependencias

```bash
pnpm install
# o
npm install
```

## 🧪 Ejecutar Tests

### Ejecutar todos los tests en modo watch
```bash
pnpm test
# o
npm test
```

### Ejecutar tests una vez
```bash
pnpm test:run
# o
npm run test:run
```

### Ejecutar tests con UI interactiva
```bash
pnpm test:ui
# o
npm run test:ui
```

### Ejecutar tests con cobertura
```bash
pnpm test:coverage
# o
npm run test:coverage
```

## 📁 Estructura de Tests

```
src/
  __tests__/
    mocks/
      octokit.mock.ts    # Mock de Octokit para simular API de GitHub
    setup.ts             # Configuración global de tests
    pull-requests.test.ts # Tests de Pull Requests
    repositories.test.ts  # Tests de Repositorios
    issues.test.ts       # Tests de Issues
    user.test.ts         # Tests de Usuario
```

## 🎯 Estrategia de Testing

### Tests Unitarios con Mocks

Todos los tests usan **mocks** de la API de GitHub, lo que significa que:

✅ **No afectan repositorios reales**  
✅ **Son rápidos** (no hacen llamadas HTTP)  
✅ **Son determinísticos** (siempre dan el mismo resultado)  
✅ **No requieren tokens de GitHub**  

### Mock de Octokit

El archivo `src/__tests__/mocks/octokit.mock.ts` contiene mocks de todas las funciones de Octokit que usamos. Estos mocks:

- Simulan respuestas realistas de la API de GitHub
- Permiten verificar que las funciones se llaman con los parámetros correctos
- No hacen llamadas HTTP reales

## 📝 Escribir Nuevos Tests

### Ejemplo: Test de una nueva herramienta

```typescript
import { describe, it, expect } from 'vitest';
import { createMockOctokit } from './mocks/octokit.mock';

describe('Mi Nueva Funcionalidad', () => {
  const mockOctokit = createMockOctokit();

  it('debería hacer algo correctamente', async () => {
    const result = await mockOctokit.miNuevaFuncion({
      param1: 'value1',
    });

    expect(result.data).toBeDefined();
    expect(mockOctokit.miNuevaFuncion).toHaveBeenCalledWith({
      param1: 'value1',
    });
  });
});
```

## 🔍 Verificaciones Comunes

### Verificar que una función se llamó
```typescript
expect(mockOctokit.pulls.create).toHaveBeenCalled();
```

### Verificar parámetros específicos
```typescript
expect(mockOctokit.pulls.create).toHaveBeenCalledWith({
  owner: 'test-owner',
  repo: 'test-repo',
  title: 'Test PR',
});
```

### Verificar propiedades del resultado
```typescript
expect(result.data.number).toBe(1);
expect(result.data.state).toBe('open');
```

## 🧩 Tests de Integración (Opcional)

Si quieres hacer tests de integración con un repositorio real:

1. Crea un repositorio de prueba en GitHub
2. Configura un token de prueba en `.env.test`
3. Crea tests que usen el token real (marcados con `test.integration`)

**⚠️ Advertencia:** Los tests de integración afectan repositorios reales. Úsalos con cuidado.

## 📊 Cobertura de Código

El objetivo es mantener una cobertura de código >80%. Puedes ver la cobertura ejecutando:

```bash
pnpm test:coverage
```

Esto generará un reporte HTML en `coverage/index.html`.

## 🐛 Debugging Tests

### Ejecutar un test específico
```bash
pnpm test pull-requests
```

### Ejecutar en modo verbose
```bash
pnpm test --reporter=verbose
```

### Ejecutar con Node debugger
```bash
node --inspect-brk node_modules/.bin/vitest
```

## 📚 Recursos

- [Documentación de Vitest](https://vitest.dev/)
- [Guía de Testing de Node.js](https://nodejs.org/en/docs/guides/testing/)
- [Best Practices de Testing](https://github.com/goldbergyoni/javascript-testing-best-practices)

## ✅ Checklist para Nuevos Tests

- [ ] Test cubre el caso feliz (happy path)
- [ ] Test cubre casos de error
- [ ] Test verifica parámetros correctos
- [ ] Test verifica respuesta correcta
- [ ] Test usa mocks (no afecta repositorios reales)
- [ ] Test tiene nombre descriptivo
- [ ] Test está en el archivo correcto

---

**Nota:** Todos los tests deben pasar antes de hacer commit. Usa `pnpm test:run` antes de hacer push.

