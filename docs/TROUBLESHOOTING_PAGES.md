# 🐛 Solución de Problemas - GitHub Pages

## Error: "Get Pages site failed" o "Not Found"

### Causa
GitHub Pages no está habilitado en el repositorio antes de ejecutar el workflow.

### Solución

**Opción 1: Habilitar GitHub Pages primero (Recomendado)**

1. Ve a: https://github.com/pblarismendi/mcp-github-server/settings/pages
2. En "Source", selecciona **"GitHub Actions"**
3. Haz clic en "Save"
4. Espera 10-20 segundos
5. Vuelve a ejecutar el workflow o haz un nuevo push

**Opción 2: Usar Branch en lugar de GitHub Actions**

1. Ve a: https://github.com/pblarismendi/mcp-github-server/settings/pages
2. En "Source", selecciona **"Deploy from a branch"**
3. Branch: `main`
4. Folder: `/docs`
5. Haz clic en "Save"
6. El sitio se desplegará automáticamente sin workflows

## Error: "Permission denied" o "403 Forbidden"

### Causa
Faltan permisos en el workflow.

### Solución
Verifica que el workflow tenga estos permisos:
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

## El sitio no se actualiza después de hacer push

### Solución
1. Espera 2-3 minutos (GitHub puede tardar)
2. Limpia la caché del navegador (Ctrl+F5 o Cmd+Shift+R)
3. Verifica que el workflow se ejecutó correctamente en Actions
4. Revisa los logs del workflow para ver errores

## El sitio muestra "404 Not Found"

### Causa
- GitHub Pages no está habilitado
- La carpeta `/docs` no existe o está vacía
- El archivo `index.html` no está en `/docs`

### Solución
1. Verifica que `docs/index.html` existe
2. Verifica que GitHub Pages esté habilitado en Settings → Pages
3. Haz un nuevo push si hiciste cambios

## Verificar Estado de GitHub Pages

1. Ve a: https://github.com/pblarismendi/mcp-github-server/settings/pages
2. Deberías ver:
   - ✅ "Your site is live at https://pblarismendi.github.io/mcp-github-server/"
   - O un mensaje indicando que está configurado

## Ver Logs del Workflow

1. Ve a: https://github.com/pblarismendi/mcp-github-server/actions
2. Haz clic en "Deploy GitHub Pages"
3. Revisa los logs de cada step para ver errores específicos

## Comandos Útiles

```bash
# Verificar que docs/index.html existe
ls -la docs/index.html

# Verificar estructura de docs/
ls -la docs/

# Hacer push de cambios
git add docs/ .github/workflows/pages.yml
git commit -m "fix: Actualizar configuración de Pages"
git push origin main
```

