#!/bin/bash

# Script de ejemplo para proteger una rama del repositorio
# Requiere GITHUB_TOKEN en el entorno
#
# ⚠️ IMPORTANTE: Este es un script de ejemplo genérico.
# Para uso en producción, crea tu propia copia con tus valores específicos
# y NO la subas al repositorio si contiene información sensible.

set -e

# Configuración - MODIFICA ESTOS VALORES según tu repositorio
OWNER="${GITHUB_OWNER:-tu-usuario-o-org}"
REPO="${GITHUB_REPO:-tu-repositorio}"
BRANCH="${GITHUB_BRANCH:-main}"

if [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ Error: GITHUB_TOKEN no está configurado"
  echo "   Ejecuta: export GITHUB_TOKEN=tu_token_aqui"
  exit 1
fi

if [ "$OWNER" = "tu-usuario-o-org" ] || [ "$REPO" = "tu-repositorio" ]; then
  echo "⚠️  Advertencia: Debes configurar OWNER y REPO antes de usar este script"
  echo "   Opción 1: Edita las variables en este script"
  echo "   Opción 2: Usa variables de entorno:"
  echo "     export GITHUB_OWNER=tu-usuario"
  echo "     export GITHUB_REPO=tu-repositorio"
  echo "     export GITHUB_BRANCH=main"
  exit 1
fi

echo "🔒 Protegiendo la rama '$BRANCH' del repositorio $OWNER/$REPO..."

# Configuración de protección de rama
# - Requiere PR antes de mergear
# - Requiere 1 aprobación
# - Descarta aprobaciones obsoletas cuando se agregan nuevos commits
# - Aplica protección también a administradores
# - No permite force pushes
# - No permite eliminar la rama

curl -X PUT \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$OWNER/$REPO/branches/$BRANCH/protection" \
  -d '{
    "required_status_checks": null,
    "enforce_admins": true,
    "required_pull_request_reviews": {
      "required_approving_review_count": 1,
      "dismiss_stale_reviews": true,
      "require_code_owner_reviews": false,
      "require_last_push_approval": false
    },
    "restrictions": null,
    "allow_force_pushes": false,
    "allow_deletions": false
  }' \
  -w "\n\nHTTP Status: %{http_code}\n"

echo ""
echo "✅ Rama '$BRANCH' protegida exitosamente!"
echo "   Ahora solo se pueden hacer cambios mediante Pull Requests con aprobación."

