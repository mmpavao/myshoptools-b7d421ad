import { safePostMessage } from '../firebase/config';

const createSafeRequestObject = (request) => {
  if (request instanceof Request) {
    return {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      // Adicione outras propriedades necessárias, evitando as não clonáveis
    };
  }
  return String(request); // Converte para string se não for um objeto Request
};

const createSafeErrorObject = (error) => {
  return {
    message: error.message,
    name: error.name,
    stack: error.stack,
    // Adicione outras propriedades de erro que sejam relevantes e seguras para clonar
  };
};

export const reportHTTPError = (error, request) => {
  const errorData = {
    error: createSafeErrorObject(error),
    request: createSafeRequestObject(request),
  };

  safePostMessage(window.parent, {
    type: 'error',
    data: errorData,
  }, '*');
};

export const wrapFetch = () => {
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    try {
      const response = await originalFetch(...args);
      if (!response.ok) {
        reportHTTPError(new Error(`HTTP error! status: ${response.status}`), args[0]);
      }
      return response;
    } catch (error) {
      reportHTTPError(error, args[0]);
      throw error;
    }
  };
};