// Remove the React import as it's not needed for utility functions
// import React from 'react';

// Remove the StarIcon import as we're not using JSX here
// import { StarIcon } from "lucide-react";

export const renderStars = (rating) => {
  // Instead of returning JSX, return an array of objects that can be used to render stars
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