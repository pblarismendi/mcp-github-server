# 🌐 Configuración de GitHub Pages

## ✅ Estado Actual

GitHub Pages está **disponible** para tu repositorio. He creado la configuración necesaria para activarlo.

## 🚀 Pasos para Activar GitHub Pages

### Opción 1: Activación Manual (Recomendado)

1. **Ve a la configuración del repositorio:**
   - https://github.com/pblarismendi/mcp-github-server/settings/pages

2. **Configura la fuente:**
   - **Source:** Selecciona "Deploy from a branch"
   - **Branch:** Selecciona `main` o `gh-pages`
   - **Folder:** Selecciona `/docs`
   - Haz clic en "Save"

3. **Espera unos minutos** para que GitHub procese el sitio

4. **Tu sitio estará disponible en:**
   - `https://pblarismendi.github.io/mcp-github-server/`

### Opción 2: Activación Automática con GitHub Actions

Ya he creado el workflow `.github/workflows/pages.yml` que:
- ✅ Se ejecuta automáticamente cuando haces push a `main`
- ✅ Despliega automáticamente la carpeta `/docs` a GitHub Pages
- ✅ No requiere configuración manual adicional

**Solo necesitas:**
1. Hacer push de los cambios (incluyendo la carpeta `docs/`)
2. Ir a Settings → Pages y seleccionar "GitHub Actions" como fuente
3. El sitio se desplegará automáticamente

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

