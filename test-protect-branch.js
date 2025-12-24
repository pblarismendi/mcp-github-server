#!/usr/bin/env node

/**
 * Script de prueba para proteger la rama main usando Octokit
 * Simula el uso de la herramienta MCP protect_branch
 */

import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";

dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error("❌ Error: GITHUB_TOKEN no está configurado en el archivo .env");
  process.exit(1);
}

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

const OWNER = "pblarismendi";
const REPO = "mcp-github-server";
const BRANCH = "main";

async function protectBranch() {
  try {
    console.log(`🔒 Protegiendo la rama '${BRANCH}' del repositorio ${OWNER}/${REPO}...`);

    const protectionConfig = {
      required_status_checks: null,
      enforce_admins: true,
      required_pull_request_reviews: {
        required_approving_review_count: 1,
        dismiss_stale_reviews: true,
        require_code_owner_reviews: false,
        require_last_push_approval: false,
      },
      restrictions: null, // null permite PRs de cualquier usuario
      allow_force_pushes: false,
      allow_deletions: false,
    };

    const response = await octokit.repos.updateBranchProtection({
      owner: OWNER,
      repo: REPO,
      branch: BRANCH,
      ...protectionConfig,
    });

    console.log("\n✅ Rama protegida exitosamente!");
    console.log("\n📋 Configuración aplicada:");
    console.log(`   - Requiere PR antes de mergear: ✅`);
    console.log(`   - Aprobaciones requeridas: 1`);
    console.log(`   - Descarta aprobaciones obsoletas: ✅`);
    console.log(`   - Protección aplicada a administradores: ✅`);
    console.log(`   - Permite force pushes: ❌`);
    console.log(`   - Permite eliminar la rama: ❌`);
    console.log(`\n🔗 URL: ${response.data.url}`);
    console.log("\n✨ Ahora solo se pueden hacer cambios mediante Pull Requests con tu aprobación.");
  } catch (error) {
    if (error.status === 404) {
      console.error(`❌ Error: La rama '${BRANCH}' no existe en el repositorio ${OWNER}/${REPO}`);
    } else if (error.status === 403) {
      console.error(`❌ Error: No tienes permisos para proteger ramas en este repositorio`);
      console.error(`   Verifica que tu token tenga el scope 'repo' y permisos de administrador`);
    } else {
      console.error(`❌ Error al proteger la rama:`, error.message);
      if (error.response) {
        console.error(`   Status: ${error.status}`);
        console.error(`   Detalles:`, JSON.stringify(error.response.data, null, 2));
      }
    }
    process.exit(1);
  }
}

protectBranch();

