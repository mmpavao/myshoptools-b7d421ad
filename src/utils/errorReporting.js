const createSafeErrorObject = (error) => ({
  message: error.message,
  name: error.name,
  stack: error.stack,
});

const safePostMessage = (target, message, origin) => {
  if (target && typeof target.postMessage === 'function') {
    target.postMessage(message, origin);
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
        // Return a mock successful response with a placeholder image URL
        return {
          ok: true,
          status: 200,
          url: '/placeholder.svg',
          blob: async () => new Blob([''], { type: 'image/svg+xml' }),
          text: async () => '',
          json: async () => ({}),
        };
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
    // Don't report the error here to avoid cloning issues
    throw error;
  }
};