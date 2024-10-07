export const logEvent = (message, type = 'info') => {
  const event = new CustomEvent('appLog', {
    detail: { message, type }
  });
  window.dispatchEvent(event);
  console.log(`[${type.toUpperCase()}] ${message}`); // Adiciona log no console para depuração
};