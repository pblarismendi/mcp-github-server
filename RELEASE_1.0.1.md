# 🚀 Release v1.0.1 - Guía de Publicación

## 📋 Checklist Pre-Release

- [x] ✅ Versión actualizada en `package.json` a `1.0.1`
- [ ] ⏳ Build del proyecto
- [ ] ⏳ Tests pasando
- [ ] ⏳ Crear tag v1.0.1
- [ ] ⏳ Push del tag
- [ ] ⏳ Publicar en npm

## 🚀 Pasos para Publicar v1.0.1

### 1. Build del Proyecto

```bash
npm run build
# o
pnpm build
```

### 2. Ejecutar Tests (Opcional pero recomendado)

```bash
npm run test:run
# o
pnpm test:run
```

### 3. Crear Tag y Release

```bash
# Crear tag anotado
git tag -a v1.0.1 -m "Release v1.0.1 - Mejoras y GitHub Pages"

# Push del tag
git push origin v1.0.1
```

### 4. Actualizar package.json y hacer commit

```bash
# Ya está actualizado, solo hacer commit si hay otros cambios
git add package.json
git commit -m "chore: Bump version to 1.0.1"
git push origin main
```

### 5. Publicar en npm

```bash
npm publish --access public
# o
pnpm publish --access public
```

## 📝 Notas del Release

### Cambios en v1.0.1

- ✅ README separado para npm y desarrolladores
- ✅ Configuración de GitHub Pages
- ✅ Mejoras en documentación
- ✅ Workflow de despliegue automático

## 🔗 Verificación

Después de publicar, verifica:

1. **GitHub Release:**
   - https://github.com/pblarismendi/mcp-github-server/releases
   - Deberías ver `v1.0.1`

2. **npm:**
   - https://www.npmjs.com/package/mcp-github-server
   - Deberías ver la versión `1.0.1`

3. **Instalación:**
   ```bash
   npm install -g mcp-github-server@1.0.1
   ```

## ⚡ Comandos Rápidos (Todo en uno)

```bash
# Build
npm run build

# Crear tag y push
git tag -a v1.0.1 -m "Release v1.0.1 - Mejoras y GitHub Pages"
git push origin v1.0.1

# Publicar en npm
npm publish --access public
```

¡Listo! 🎉

