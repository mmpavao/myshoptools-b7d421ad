const createSafeErrorObject = (error) => ({
  message: error.message,
  name: error.name,
  stack: error.stack,
});

const safePostMessage = (target, message, origin) => {
  if (target && typeof target.postMessage === 'function') {
    try {
      const safeMessage = JSON.parse(JSON.stringify(message));
      target.postMessage(safeMessage, origin);
    } catch (postMessageError) {
      console.error('Error in postMessage:', postMessageError);
    }
  }
};

export const reportHTTPError = (error) => {
  const errorData = {
    error: createSafeErrorObject(error),
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
        reportHTTPError(new Error(`HTTP error! status: ${response.status}`));
      }
      return response;
    } catch (error) {
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        console.error('Network error when fetching resource:', args[0]);
        if (args[0].includes('firebasestorage.googleapis.com')) {
          console.warn('Firebase Storage resource unavailable:', args[0]);
          return {
            ok: false,
            status: 404,
            url: args[0],
            blob: async () => new Blob([''], { type: 'image/svg+xml' }),
            text: async () => '',
            json: async () => ({}),
          };
        }
      }
      reportHTTPError(error);
      throw error;
    }
  };
};

export const safeFirestoreOperation = async (operation) => {
  try {
    return await operation();
  } catch (error) {
    console.error("Firestore operation error:", error);
    reportHTTPError(error);
    throw error;
  }
};