/**
 * Utilidades de validación para parámetros de herramientas
 */

export function validateOwnerRepo(args: any): { owner: string; repo: string } {
  if (!args.owner || typeof args.owner !== 'string' || args.owner.trim().length === 0) {
    throw new Error('El parámetro "owner" es requerido y debe ser una cadena no vacía');
  }
  if (!args.repo || typeof args.repo !== 'string' || args.repo.trim().length === 0) {
    throw new Error('El parámetro "repo" es requerido y debe ser una cadena no vacía');
  }
  return {
    owner: args.owner.trim(),
    repo: args.repo.trim(),
  };
}

export function validatePositiveNumber(value: any, paramName: string, min = 1, max?: number): number {
  if (value === undefined || value === null) {
    throw new Error(`El parámetro "${paramName}" es requerido`);
  }
  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  if (isNaN(num) || !isFinite(num)) {
    throw new Error(`El parámetro "${paramName}" debe ser un número válido`);
  }
  if (num < min) {
    throw new Error(`El parámetro "${paramName}" debe ser al menos ${min}`);
  }
  if (max !== undefined && num > max) {
    throw new Error(`El parámetro "${paramName}" no puede ser mayor que ${max}`);
  }
  return num;
}

export function validateString(value: any, paramName: string, required = true): string {
  if (required && (!value || typeof value !== 'string' || value.trim().length === 0)) {
    throw new Error(`El parámetro "${paramName}" es requerido y debe ser una cadena no vacía`);
  }
  if (value && typeof value !== 'string') {
    throw new Error(`El parámetro "${paramName}" debe ser una cadena`);
  }
  return value ? value.trim() : '';
}

export function validateEnum<T extends string>(
  value: any,
  paramName: string,
  allowedValues: readonly T[],
  required = true
): T {
  if (required && !value) {
    throw new Error(`El parámetro "${paramName}" es requerido`);
  }
  if (value && !allowedValues.includes(value as T)) {
    throw new Error(
      `El parámetro "${paramName}" debe ser uno de: ${allowedValues.join(', ')}`
    );
  }
  return value as T;
}

export function validateDate(value: any, paramName: string): string {
  if (!value || typeof value !== 'string') {
    throw new Error(`El parámetro "${paramName}" debe ser una fecha en formato ISO 8601`);
  }
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new Error(`El parámetro "${paramName}" debe ser una fecha válida en formato ISO 8601`);
  }
  return value;
}

