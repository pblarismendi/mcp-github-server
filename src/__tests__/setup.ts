import { vi } from 'vitest';

// Mock de dotenv para tests
vi.mock('dotenv', () => ({
  default: {
    config: vi.fn(),
  },
}));

// Mock de variables de entorno
process.env.GITHUB_TOKEN = 'test-token';

