import React from 'react';
import { Toast } from "@/components/ui/toast";
import { X } from "lucide-react";
import Alert from './Alert';

const CustomToast = ({ variant, title, description, onClose }) => {
  return (
    <Toast className="w-full max-w-xs bg-white dark:bg-gray-800 rounded-lg shadow-lg p-0">
      <Alert type={variant} message={description} />
      <button
        type="button"
        className="absolute right-2 top-2 rounded-md p-1 text-gray-400 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
        onClick={onClose}
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </Toast>
  );
};

export default CustomToast;