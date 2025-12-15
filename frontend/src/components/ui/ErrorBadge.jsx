import { AlertTriangle, X } from 'lucide-react';

const ErrorBadge = ({ message, onDismiss, className = '' }) => {
  return (
    <div
      className={`flex items-center justify-between p-4 mb-6 rounded-lg border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20 ${className}`}
      role='alert'>
      <div className='flex items-start'>
        <AlertTriangle className='h-5 w-5 text-red-500 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0' />
        <div className='text-sm text-red-700 dark:text-red-200'>{message}</div>
      </div>
      {onDismiss && (
        <button
          type='button'
          onClick={onDismiss}
          className='ml-4 -mx-1.5 -my-1.5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-lg p-1.5 inline-flex h-8 w-8 hover:bg-red-100 dark:hover:bg-red-900/50'
          aria-label='Dismiss'>
          <X className='h-5 w-5' />
        </button>
      )}
    </div>
  );
};

export default ErrorBadge;
