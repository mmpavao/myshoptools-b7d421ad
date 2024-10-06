export const formatCurrency = (value) => {
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.-]/g, '')) : value;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
};

export const parseCurrency = (value) => {
  return parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
};