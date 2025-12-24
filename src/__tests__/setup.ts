import { vi } from 'vitest';

// Mock de dotenv para tests
vi.mock('dotenv', () => ({
  default: {
    config: vi.fn(),
  },
}));

// Mock de process.exit para evitar que los tests terminen
vi.spyOn(process, 'exit').mockImplementation((code?: string | number | null) => {
  throw new Error(`process.exit(${code}) was called`);
});

// Mock de variables de entorno
process.env.GITHUB_TOKEN = 'test-token';

