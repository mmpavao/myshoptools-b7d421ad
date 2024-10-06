import { safePostMessage } from '../firebase/config';

const createSafeRequestObject = (request) => {
  return {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
  };
};

export const reportHTTPError = (error, request) => {
  const errorData = {
    message: error.message,
    stack: error.stack,
    request: request instanceof Request ? createSafeRequestObject(request) : request,
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