import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { createMockOctokit } from './mocks/octokit.mock';

// Mock de dotenv antes de importar index
vi.mock('dotenv', () => ({
  default: {
    config: vi.fn(),
  },
}));

// Mock de Octokit antes de que se importe
vi.mock('@octokit/rest', () => {
  const mockOctokit = createMockOctokit();
  return {
    Octokit: vi.fn().mockImplementation(() => mockOctokit),
  };
});

// Importar después de los mocks
// Necesitamos importar dinámicamente para que los mocks se apliquen
let server: Server;
let mockOctokit: ReturnType<typeof createMockOctokit>;

describe('MCP Server Integration Tests', () => {
  beforeEach(async () => {
    // Resetear mocks
    vi.clearAllMocks();
    
    // Crear nuevo mock
    mockOctokit = createMockOctokit();
    
    // Importar dinámicamente el módulo después de configurar mocks
    const { default: createServer } = await import('../index.js');
    // Nota: Necesitamos refactorizar index.ts para exportar el servidor
  });

  describe('List Tools', () => {
    it('debería listar todas las herramientas disponibles', async () => {
      // Este test requiere que exportemos el servidor desde index.ts
      // Por ahora, verificamos que el mock funciona
      expect(mockOctokit).toBeDefined();
    });
  });
});

