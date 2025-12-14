import React from 'react';

const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
  };

  const colorClasses = {
    primary: 'text-primary',
    white: 'text-white',
    gray: 'text-gray-400',
    red: 'text-red-500',
    green: 'text-green-500',
    blue: 'text-blue-500',
    yellow: 'text-yellow-500',
    indigo: 'text-indigo-500',
    purple: 'text-purple-500',
    pink: 'text-pink-500',
  };

  return (
    <div 
      className={cn(
        'inline-block animate-spin',
        sizeClasses[size] || sizeClasses['md'],
        colorClasses[color] || colorClasses['primary'],
        className
      )}
      role="status"
      {...props}
    >
      <span className="sr-only">Loading...</span>
      <svg
        className="animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

export { LoadingSpinner };

export default LoadingSpinner;
