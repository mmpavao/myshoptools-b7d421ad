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
  if (typeof value === 'number') return value;
  return parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
};

export const formatInputCurrency = (value) => {
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d)(\d{2})$/, "$1,$2");
  value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");
  return value;
};