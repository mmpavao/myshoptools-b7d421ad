import React from 'react';
import { StarIcon } from "lucide-react";

export const renderStars = (rating) => {
  return [...Array(5)].map((_, index) => (
    <StarIcon key={index} className={`w-5 h-5 ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
  ));
};

export const formatPrice = (price) => {
  return typeof price === 'number' ? price.toFixed(2) : '0.00';
};

export const calculateOldPrice = (currentPrice, discount) => {
  return currentPrice / (1 - discount / 100);
};