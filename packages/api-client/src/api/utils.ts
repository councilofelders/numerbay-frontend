function authHeaders(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
}

/**
 * Safely reads the authentication token from the context
 * @param context The API context containing configuration
 * @returns The authentication token or null if not available
 */
function safeTokenRead(context: { config: { auth?: { onTokenRead?: () => any } } }): any {
  return context.config.auth?.onTokenRead?.();
}

/**
 * Wraps an API method with error handling to ensure errors are properly caught and logged
 * @param apiMethod The API method to wrap
 * @returns A wrapped API method that handles errors
 */
function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  apiMethod: T
): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await apiMethod(...args);
    } catch (error) {
      // Log the error with the API method name for better debugging
      console.error(`API Error in ${apiMethod.name || 'unknown method'}:`, error);
      
      // Rethrow the error to allow it to be caught by the calling code
      throw error;
    }
  }) as T;
}

export {
  authHeaders,
  safeTokenRead,
  withErrorHandling
};
