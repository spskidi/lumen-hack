import React from 'react';
import LoadingSpinner from './ui/LoadingSpinner';

const LoadingState = ({
  isLoading,
  children,
  loadingText = 'Loading...',
  className = '',
  spinnerSize = 'md',
  fullPage = false,
}) => {
  if (isLoading) {
    return (
      <div
        className={`flex flex-col items-center justify-center space-y-4 ${
          fullPage ? 'min-h-screen' : 'py-12'
        } ${className}`}
      >
        <LoadingSpinner size={spinnerSize} />
        {loadingText && (
          <p className="text-gray-600 dark:text-gray-400">{loadingText}</p>
        )}
      </div>
    );
  }

  return children;
};

export default LoadingState;
