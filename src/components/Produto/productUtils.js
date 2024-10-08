export const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, index) => ({
    filled: index < Math.floor(rating),
    key: index
  }));
};

export const formatPrice = (price) => {
  return typeof price === 'number' ? price.toFixed(2) : '0.00';
};

export const calculateOldPrice = (currentPrice, discount) => {
  return currentPrice / (1 - discount / 100);
};