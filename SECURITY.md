# 🔒 Guía de Seguridad

## ⚠️ Scripts con Información Sensible

### Scripts que NO deben subirse al repositorio

Los siguientes scripts contienen información específica de repositorios y están en `.gitignore`:

- `protect-main-branch.sh` - Contiene valores hardcodeados (`OWNER`, `REPO`)
- `test-protect-branch.js` - Contiene valores hardcodeados (`OWNER`, `REPO`)

### ¿Por qué es peligroso subirlos?

1. **Riesgo de modificación maliciosa**: Si alguien con acceso al repositorio modifica estos scripts para desproteger ramas y crea un PR, podrías aprobar accidentalmente cambios que comprometan la seguridad.

2. **Información expuesta**: Aunque no contienen tokens (que vienen del entorno), exponen la estructura de tu repositorio y configuración específica.

3. **Facilita ataques**: Un atacante podría usar estos scripts como referencia para crear scripts maliciosos dirigidos a tu repositorio.

### ✅ Solución: Usar Scripts Genéricos

En su lugar, usa los scripts de ejemplo genéricos:

- `protect-branch.example.sh` - Script genérico que usa variables de entorno
- Usa la herramienta MCP `protect_branch` directamente desde tu aplicación

### 📋 Mejores Prácticas

1. **Nunca subas scripts con valores hardcodeados** de repositorios específicos
2. **Usa variables de entorno** para configuración sensible
3. **Revisa cuidadosamente los PRs** que modifican scripts de seguridad
4. **Usa la herramienta MCP `protect_branch`** en lugar de scripts cuando sea posible
5. **Mantén tus tokens seguros** - nunca los subas al repositorio (ya están en `.gitignore`)

### 🛡️ Protección de Ramas

La protección de ramas está configurada con:

- ✅ Requiere PR antes de mergear
- ✅ Requiere 1 aprobación mínima
- ✅ Protección aplicada también a administradores (`enforce_admins: true`)
- ✅ No permite force pushes
- ✅ No permite eliminar la rama

Esto significa que **incluso si alguien modifica un script**, necesitará:
1. Crear un PR
2. Obtener tu aprobación
3. Mergear el PR

**Pero siempre revisa cuidadosamente los PRs que modifican scripts de seguridad o configuración.**

### 🔐 Gestión de Tokens

- Los tokens nunca deben estar en el código
- Usa variables de entorno (`GITHUB_TOKEN`)
- Los tokens deben tener solo los permisos necesarios
- Rota los tokens periódicamente
- Usa tokens con scope mínimo requerido (`repo` para este proyecto)

### 📚 Recursos Adicionales

- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Token Scopes](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)

