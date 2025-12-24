# 🔧 Configuración de Auto-aprobación de PRs

## 📋 Resumen

El workflow `auto-approve.yml` puede auto-aprobar PRs del dueño del repositorio. Sin embargo, GitHub Actions no puede aprobar PRs directamente por seguridad, por lo que necesitas configurar un Personal Access Token (PAT) opcional.

## 🚀 Opción 1: Con PAT (Auto-aprobación completa)

### Pasos:

1. **Crear un Personal Access Token (PAT)**:
   - Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - O usa este enlace directo: https://github.com/settings/tokens
   - Haz clic en "Generate new token (classic)"
   - Dale un nombre descriptivo (ej: "Auto-approve PRs")
   - Selecciona el scope `repo` (necesitas permisos completos de repositorio)
   - Genera el token y **cópialo inmediatamente** (no podrás verlo de nuevo)

2. **Agregar el PAT como secret en GitHub**:
   - Ve a tu repositorio → Settings → Secrets and variables → Actions
   - Haz clic en "New repository secret"
   - Nombre: `GH_PAT`
   - Valor: Pega el token que copiaste
   - Guarda el secret

3. **Listo**: Ahora el workflow auto-aprobará tus PRs automáticamente

## 🚀 Opción 2: Sin PAT (Solo comentario)

Si no configuras el PAT, el workflow simplemente agregará un comentario al PR indicando que está listo para mergear. Tendrás que aprobarlo manualmente, pero al menos sabrás que está listo.

## ⚠️ Consideraciones de Seguridad

- **El PAT tiene acceso completo al repositorio**: Úsalo solo en repositorios de confianza
- **Rota el token periódicamente**: Cambia el PAT cada 3-6 meses
- **No compartas el token**: Manténlo seguro y nunca lo subas al código
- **Revoca el token si es comprometido**: Si sospechas que fue expuesto, revócalo inmediatamente

## 🔄 Alternativa: Cambiar Protección de Rama

Si prefieres no usar PAT, puedes cambiar la protección de rama para permitir que el dueño pueda mergear sin aprobación:

1. Ve a Settings → Branches → Protección de rama `main`
2. En "Restrict who can push to matching branches", agrega tu usuario como excepción
3. O desactiva temporalmente "Require pull request reviews" para tus propios PRs

**Nota**: Esta opción reduce la seguridad, ya que permite mergear sin revisión.

## 📚 Referencias

- [GitHub Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)

