export const logEvent = (message, type = 'info') => {
  const event = new CustomEvent('appLog', {
    detail: { message, type }
  });
  window.dispatchEvent(event);
};