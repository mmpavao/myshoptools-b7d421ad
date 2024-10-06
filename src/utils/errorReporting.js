import { safePostMessage } from '../firebase/config';

const createSafeRequestObject = (request) => {
  if (request instanceof Request) {
    return {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      // Add any other properties you need, but avoid non-clonable ones
    };
  }
  return String(request); // Convert to string if not a Request object
};

export const reportHTTPError = (error, request) => {
  const errorData = {
    message: error.message,
    stack: error.stack,
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