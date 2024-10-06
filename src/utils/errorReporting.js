import { safePostMessage } from '../firebase/config';

const createSafeErrorObject = (error) => ({
  message: error.message,
  name: error.name,
  stack: error.stack,
});

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
    // Não reportamos o erro aqui para evitar problemas de clonagem
    throw error;
  }
};