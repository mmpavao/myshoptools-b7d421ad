const createSafeErrorObject = (error) => ({
  message: error.message,
  name: error.name,
  stack: error.stack,
});

const safePostMessage = (target, message, origin) => {
  if (target && typeof target.postMessage === 'function') {
    try {
      // Ensure the message is serializable
      const safeMessage = JSON.parse(JSON.stringify(message));
      target.postMessage(safeMessage, origin);
    } catch (postMessageError) {
      console.error('Error in postMessage:', postMessageError);
    }
  }
};

export const reportHTTPError = (error, requestInfo) => {
  const errorData = {
    error: createSafeErrorObject(error),
    requestInfo: {
      url: requestInfo.url,
      method: requestInfo.method,
      headers: Object.fromEntries(requestInfo.headers || []),
    },
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
        const requestInfo = {
          url: args[0],
          method: args[1]?.method || 'GET',
          headers: args[1]?.headers,
        };
        reportHTTPError(new Error(`HTTP error! status: ${response.status}`), requestInfo);
      }
      return response;
    } catch (error) {
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        console.error('Network error when fetching resource:', args[0]);
        return {
          ok: true,
          status: 200,
          url: '/placeholder.svg',
          blob: async () => new Blob([''], { type: 'image/svg+xml' }),
          text: async () => '',
          json: async () => ({}),
        };
      }
      const requestInfo = {
        url: args[0],
        method: args[1]?.method || 'GET',
        headers: args[1]?.headers,
      };
      reportHTTPError(error, requestInfo);
      throw error;
    }
  };
};

export const safeFirestoreOperation = async (operation) => {
  try {
    return await operation();
  } catch (error) {
    console.error("Firestore operation error:", error);
    throw error;
  }
};