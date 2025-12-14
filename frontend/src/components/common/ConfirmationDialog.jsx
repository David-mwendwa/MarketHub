import { Button } from '../ui/Button';
import { X, AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { Backdrop } from '../ui/Backdrop';

const variantStyles = {
  danger: {
    bg: 'bg-red-50 dark:bg-red-900/30',
    text: 'text-red-600 dark:text-red-400',
    icon: AlertCircle,
    button: 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-500',
    border: 'border-red-100 dark:border-red-800/50',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-900/30',
    text: 'text-amber-600 dark:text-amber-400',
    icon: AlertTriangle,
    button: 'bg-amber-600 hover:bg-amber-700 focus-visible:ring-amber-500',
    border: 'border-amber-100 dark:border-amber-800/50',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    text: 'text-blue-600 dark:text-blue-400',
    icon: Info,
    button: 'bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500',
    border: 'border-blue-100 dark:border-blue-800/50',
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-900/30',
    text: 'text-green-600 dark:text-green-400',
    icon: CheckCircle,
    button: 'bg-green-600 hover:bg-green-700 focus-visible:ring-green-500',
    border: 'border-green-100 dark:border-green-800/50',
  },
};

export const ConfirmationDialog = ({
  open,
  onOpenChange,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  itemName,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  variant = 'warning',
  isDestructive = false,
  isLoading = false,
  children,
}) => {
  if (!open) return null;

  // Get the appropriate style based on variant and isDestructive
  const style = variantStyles[variant];
  const IconComponent = style.icon;

  // Highlight the item name in the description if provided
  const renderDescription = () => {
    if (!itemName) return description;
    const parts = description.split('{item}');
    return (
      <>
        {parts[0]}
        <span className={`font-bold ${style.text}`}>{itemName}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <Backdrop className='flex items-center justify-center p-4'>
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700'>
        {/* Header */}
        <div className={`px-6 py-5 border-b ${style.border} flex items-center`}>
          <div
            className={`flex-shrink-0 h-10 w-10 rounded-full ${style.bg} flex items-center justify-center mr-3`}>
            <IconComponent className={`h-5 w-5 ${style.text}`} />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
              {title}
            </h3>
            {description && (
              <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                {renderDescription()}
              </p>
            )}
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className='ml-auto p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors'>
            <X className='h-5 w-5' />
          </button>
        </div>

        {/* Body */}
        {children && (
          <div className='px-6 py-5 bg-gray-50/50 dark:bg-gray-700/30'>
            <div className='text-sm text-gray-600 dark:text-gray-300'>
              {children}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className='px-6 py-4 bg-gray-50 dark:bg-gray-800/60 flex justify-end space-x-3'>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className='px-5'>
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 ${style.button}`}>
            {isLoading ? (
              <span className='flex items-center'>
                <svg
                  className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'>
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                </svg>
                {confirmText}
              </span>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </Backdrop>
  );
};
