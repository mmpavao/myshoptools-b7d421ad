import React from 'react';
import { Toast } from "@/components/ui/toast";
import { X } from "lucide-react";

const iconTypes = {
  success: (
    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
    </svg>
  ),
};

const CustomToast = ({ variant, title, description, onClose }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200';
      case 'error':
        return 'bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200';
      case 'warning':
        return 'bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <Toast className="w-full max-w-xs bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex items-center p-4">
        <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${getVariantStyles()}`}>
          {iconTypes[variant] || iconTypes.success}
          <span className="sr-only">{variant} icon</span>
        </div>
        <div className="ml-3 text-sm font-normal text-gray-500 dark:text-gray-400">{description}</div>
        <button
          type="button"
          className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          <span className="sr-only">Close</span>
          <X className="w-4 h-4" />
        </button>
      </div>
    </Toast>
  );
};

export default CustomToast;