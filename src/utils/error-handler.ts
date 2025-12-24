/**
 * Manejo mejorado de errores de GitHub API
 */

export interface ErrorDetails {
  message: string;
  status?: number;
  code?: string;
  suggestion?: string;
}

interface RequestErrorLike {
  status?: number;
  message: string;
  name?: string;
}

function isRequestError(error: unknown): error is RequestErrorLike {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'message' in error &&
    typeof (error as RequestErrorLike).message === 'string'
  );
}

export function handleGitHubError(error: unknown): ErrorDetails {
  // Error de la API de GitHub
  if (isRequestError(error)) {
    const status = error.status;
    const message = error.message;

    switch (status) {
      case 401:
        return {
          message: 'No autorizado: Token de GitHub inválido o expirado',
          status: 401,
          code: 'UNAUTHORIZED',
          suggestion: 'Verifica que tu GITHUB_TOKEN sea válido y tenga los permisos necesarios',
        };

      case 403:
        return {
          message: 'Prohibido: No tienes permisos para realizar esta acción',
          status: 403,
          code: 'FORBIDDEN',
          suggestion:
            'Verifica que tu token tenga los permisos necesarios (scope) para esta operación',
        };

      case 404:
        return {
          message: 'No encontrado: El recurso solicitado no existe',
          status: 404,
          code: 'NOT_FOUND',
          suggestion: 'Verifica que el repositorio, issue, PR o recurso exista y sea accesible',
        };

      case 422:
        return {
          message: `Error de validación: ${message}`,
          status: 422,
          code: 'VALIDATION_ERROR',
          suggestion: 'Verifica que todos los parámetros sean correctos y válidos',
        };

      case 429:
        return {
          message: 'Rate limit excedido: Demasiadas solicitudes a la API de GitHub',
          status: 429,
          code: 'RATE_LIMIT',
          suggestion:
            'Espera unos minutos antes de hacer más solicitudes. Considera implementar caché para reducir llamadas',
        };

      case 500:
      case 502:
      case 503:
      case 504:
        return {
          message: `Error del servidor de GitHub: ${message}`,
          status: status,
          code: 'SERVER_ERROR',
          suggestion: 'GitHub está experimentando problemas. Intenta nuevamente más tarde',
        };

      default:
        return {
          message: `Error de GitHub API: ${message}`,
          status: status,
          code: 'API_ERROR',
          suggestion: 'Verifica tu conexión y que GitHub esté disponible',
        };
    }
  }

  // Error de validación personalizado
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'VALIDATION_ERROR',
      suggestion: 'Verifica que todos los parámetros requeridos estén presentes y sean válidos',
    };
  }

  // Error desconocido
  return {
    message: 'Error desconocido',
    code: 'UNKNOWN_ERROR',
    suggestion: 'Contacta al soporte si el problema persiste',
  };
}

export function formatErrorResponse(error: unknown): {
  content: Array<{ type: 'text'; text: string }>;
  isError: boolean;
} {
  const errorDetails = handleGitHubError(error);

  const errorText = JSON.stringify(
    {
      error: errorDetails.message,
      code: errorDetails.code,
      status: errorDetails.status,
      suggestion: errorDetails.suggestion,
    },
    null,
    2
  );

  return {
    content: [
      {
        type: 'text',
        text: errorText,
      },
    ],
    isError: true,
  };
}

