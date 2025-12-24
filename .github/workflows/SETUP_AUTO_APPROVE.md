# 🔧 Configuración de Auto-merge de PRs

## 📋 Resumen

El workflow `auto-approve.yml` puede mergear automáticamente los PRs del dueño del repositorio después de que pasen los tests. 

**⚠️ Importante**: GitHub no permite que un usuario apruebe su propio PR (incluso con PAT), por lo que este workflow mergea automáticamente el PR en lugar de aprobarlo.

## 🚀 Opción 1: Con PAT (Auto-merge completo)

### Pasos:

1. **Crear un Personal Access Token (PAT)**:
   - Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - O usa este enlace directo: https://github.com/settings/tokens
   - Haz clic en "Generate new token (classic)"
   - Dale un nombre descriptivo (ej: "Auto-merge PRs")
   - Selecciona el scope `repo` (necesitas permisos completos de repositorio)
   - Genera el token y **cópialo inmediatamente** (no podrás verlo de nuevo)

2. **Agregar el PAT como secret en GitHub**:
   - Ve a tu repositorio → Settings → Secrets and variables → Actions
   - Haz clic en "New repository secret"
   - Nombre: `GH_PAT`
   - Valor: Pega el token que copiaste
   - Guarda el secret

3. **Listo**: Ahora el workflow mergeará automáticamente tus PRs después de que pasen los tests

### Cómo funciona:

- El workflow espera a que todos los tests pasen
- Una vez que los tests pasan, mergea automáticamente el PR usando `squash merge`
- Solo funciona para PRs creados por el dueño del repositorio
- Los PRs de otros colaboradores siguen requiriendo aprobación manual

## 🚀 Opción 2: Sin PAT (Solo comentario)

Si no configuras el PAT, el workflow simplemente agregará un comentario al PR indicando que está listo para mergear. Tendrás que mergearlo manualmente después de aprobarlo.

## ⚠️ Consideraciones de Seguridad

- **El PAT tiene acceso completo al repositorio**: Úsalo solo en repositorios de confianza
- **Rota el token periódicamente**: Cambia el PAT cada 3-6 meses
- **No compartas el token**: Manténlo seguro y nunca lo subas al código
- **Revoca el token si es comprometido**: Si sospechas que fue expuesto, revócalo inmediatamente

## ⚠️ Limitación de GitHub

GitHub no permite que un usuario apruebe su propio PR, incluso usando un PAT. Por esta razón, este workflow:
- **No intenta aprobar** el PR (fallaría con error 422)
- **Mergea automáticamente** el PR después de que pasen los tests
- Esto requiere que la protección de rama permita mergear sin aprobación si el autor es el dueño

### Configuración de Protección de Rama Recomendada

Para que el auto-merge funcione correctamente, la protección de rama debe:
- ✅ Requerir PR antes de mergear
- ✅ Requerir que los tests pasen (status checks)
- ⚠️ **Permitir mergear sin aprobación** si el autor es el dueño del repositorio (esto se puede hacer agregando una excepción)

**Alternativa**: Si prefieres mantener la protección estricta, simplemente aprueba y mergea manualmente cuando veas el comentario del workflow.

## 📚 Referencias

- [GitHub Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)

