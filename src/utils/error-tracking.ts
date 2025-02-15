// Global error handler for uncaught errors
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global error:', {
    message,
    source,
    lineno,
    colno,
    error,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  });
  return false;
};

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled promise rejection:', {
    reason: event.reason,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  });
});

// Custom error types
export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

// Error parsing utility
export function parseError(error: any): Error {
  if (error instanceof Error) {
    return error;
  }
  
  if (typeof error === 'string') {
    return new Error(error);
  }
  
  if (typeof error === 'object') {
    return new Error(JSON.stringify(error));
  }
  
  return new Error('An unknown error occurred');
}

// Error context utility
export function addErrorContext(error: Error, context: Record<string, any>): Error {
  const errorWithContext = error as Error & { context?: Record<string, any> };
  errorWithContext.context = context;
  return errorWithContext;
}