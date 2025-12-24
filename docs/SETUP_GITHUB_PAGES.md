# 🌐 Configuración de GitHub Pages

## ✅ Estado Actual

GitHub Pages está **disponible** para tu repositorio. He creado la configuración necesaria para activarlo.

## 🚀 Pasos para Activar GitHub Pages

### ⚠️ IMPORTANTE: Debes habilitar GitHub Pages PRIMERO

**Antes de ejecutar el workflow, debes habilitar GitHub Pages manualmente:**

### Paso 1: Habilitar GitHub Pages (OBLIGATORIO)

1. **Ve a la configuración del repositorio:**
   - https://github.com/pblarismendi/mcp-github-server/settings/pages

2. **Configura la fuente:**
   - **Source:** Selecciona **"GitHub Actions"** (NO "Deploy from a branch")
   - Haz clic en "Save"

3. **Espera unos segundos** para que GitHub configure el sitio

### Paso 2: Hacer Push de los Cambios

```bash
git add docs/ .github/workflows/pages.yml
git commit -m "feat: Agregar configuración de GitHub Pages"
git push origin main
```

### Paso 3: Verificar el Despliegue

1. Ve a la pestaña **"Actions"** en GitHub
2. Busca el workflow **"Deploy GitHub Pages"**
3. Espera a que termine (debería tomar 1-2 minutos)
4. Tu sitio estará disponible en:
   - `https://pblarismendi.github.io/mcp-github-server/`

## 🔄 Alternativa: Usar Branch en lugar de GitHub Actions

Si prefieres no usar GitHub Actions, puedes usar esta configuración más simple:

1. **Ve a Settings → Pages:**
   - **Source:** Selecciona "Deploy from a branch"
   - **Branch:** Selecciona `main`
   - **Folder:** Selecciona `/docs`
   - Haz clic en "Save"

2. **El sitio se desplegará automáticamente** sin necesidad de workflows

## 📁 Estructura de Archivos

He creado:
- `docs/index.html` - Página principal con navegación
- `.github/workflows/pages.yml` - Workflow para despliegue automático

## 🎨 Personalización

Puedes personalizar el sitio editando `docs/index.html`:
- Cambiar colores y estilos
- Agregar más secciones
- Integrar con generadores de documentación (VitePress, Docusaurus, etc.)

## 🔗 URLs Disponibles

Una vez activado, tendrás:
- **Sitio principal:** `https://pblarismendi.github.io/mcp-github-server/`
- **README:** `https://pblarismendi.github.io/mcp-github-server/README.md`
- **README.DEV:** `https://pblarismendi.github.io/mcp-github-server/README.DEV.md`

## 📝 Notas

- GitHub Pages es **gratis** para repositorios públicos
- El sitio se actualiza automáticamente con cada push a `main`
- Puedes usar un dominio personalizado si lo deseas
- El sitio está disponible públicamente

## 🐛 Solución de Problemas

### El sitio no se muestra
- Verifica que GitHub Pages esté activado en Settings → Pages
- Espera 5-10 minutos después de activarlo
- Revisa los logs en Actions → Deploy GitHub Pages

### Errores en el workflow
- Verifica que la carpeta `docs/` exista
- Asegúrate de que `docs/index.html` esté presente
- Revisa los permisos en Settings → Actions → General

### Contenido no se actualiza
- Haz un nuevo push a `main`
- Espera a que el workflow termine de ejecutarse
- Limpia la caché del navegador

## 🚀 Próximos Pasos

1. **Haz push de los cambios:**
   ```bash
   git add docs/ .github/workflows/pages.yml
   git commit -m "feat: Agregar configuración de GitHub Pages"
   git push origin main
   ```

2. **Activa GitHub Pages:**
   - Ve a Settings → Pages
   - Selecciona "Deploy from a branch" o "GitHub Actions"
   - Guarda los cambios

3. **Espera y verifica:**
   - Espera 5-10 minutos
   - Visita `https://pblarismendi.github.io/mcp-github-server/`

¡Listo! Tu documentación estará disponible públicamente en GitHub Pages.

