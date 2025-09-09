
import React from 'react';
import { useToastContext } from '../context/ToastContext';

const Toast: React.FC = () => {
  const { toast } = useToastContext();

  if (!toast) return null;

  const styleClasses = toast.type === 'error' 
    ? 'bg-red-800 border-red-600' 
    : 'bg-stone-800 border-amber-600';

  return (
    <div 
        className={`fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-md text-white text-sm font-semibold shadow-lg z-50 transition-all duration-300 animate-fade-in-out border ${styleClasses}`}
    >
      {toast.message}
    </div>
  );
};

export default Toast;