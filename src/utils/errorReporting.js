import { safePostMessage } from '../firebase/config';

const createSafeErrorObject = (error) => ({
  message: error.message,
  name: error.name,
  stack: error.stack,
});

const createSafeRequestInfo = (request) => {
  if (typeof request === 'string') return request;
  return {
    url: request.url,
    method: request.method,
  };
};

export const reportHTTPError = (error, request) => {
  const errorData = {
    error: createSafeErrorObject(error),
    requestInfo: createSafeRequestInfo(request),
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

export const safeFirestoreOperation = async (operation) => {
  try {
    return await operation();
  } catch (error) {
    console.error("Firestore operation error:", error);
    reportHTTPError(error, "Firestore Operation");
    throw error;
  }
};