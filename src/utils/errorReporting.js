import { safePostMessage } from '../firebase/config';

const createSafeRequestObject = (request) => {
  if (request instanceof Request) {
    return {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      // Add other necessary properties, avoiding non-clonable ones
    };
  }
  return String(request); // Convert to string if not a Request object
};

const createSafeErrorObject = (error) => {
  return {
    message: error.message,
    name: error.name,
    stack: error.stack,
    // Add other relevant and safe-to-clone error properties
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

// New function to handle Firestore operations safely
export const safeFirestoreOperation = async (operation) => {
  try {
    return await operation();
  } catch (error) {
    console.error("Firestore operation error:", error);
    reportHTTPError(error, "Firestore Operation");
    throw error;
  }
};