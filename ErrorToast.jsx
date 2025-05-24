import React, { useEffect, useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

const ErrorToast = ({ connectionError }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (connectionError) {
      setIsVisible(true);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [connectionError]);

  if (!isVisible || !connectionError) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full">
      <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-start space-x-3">
        <AlertCircle size={20} className="flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium">{connectionError}</p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-red-600 rounded-full transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default ErrorToast;