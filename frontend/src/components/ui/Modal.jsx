import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

const Modal = ({
  isOpen = false,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnClickOutside = true,
  closeOnEsc = true,
  className,
  ...props
}) => {
  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && closeOnEsc) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, closeOnEsc]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full',
  };

  return (
    <div
      className='fixed inset-0 z-50 overflow-y-auto'
      aria-labelledby='modal-title'
      role='dialog'
      aria-modal='true'>
      <div className='flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
        {/* Background overlay */}
        <div
          className='fixed inset-0 bg-black/50 transition-opacity'
          aria-hidden='true'
          onClick={closeOnClickOutside ? onClose : null}
        />

        {/* Modal panel */}
        <div
          className={cn(
            'inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:align-middle',
            sizeClasses[size],
            className
          )}
          role='dialog'
          aria-modal='true'
          aria-labelledby='modal-headline'
          onClick={(e) => e.stopPropagation()}
          {...props}>
          {/* Header */}
          <div className='bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200 dark:border-gray-700'>
            <div className='flex items-center justify-between'>
              <h3
                className='text-lg font-medium leading-6 text-gray-900 dark:text-white'
                id='modal-headline'>
                {title}
              </h3>
              <Button
                variant='ghost'
                size='icon'
                onClick={onClose}
                className='text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-white'
                aria-label='Close'>
                <X className='h-5 w-5' />
              </Button>
            </div>
          </div>

          {/* Body */}
          <div className='bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6'>
            <div className='mt-2'>{children}</div>
          </div>

          {/* Footer */}
          {footer && (
            <div className='bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-200 dark:border-gray-700'>
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ModalFooter = ({ children, className, ...props }) => (
  <div
    className={cn(
      'flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3',
      className
    )}
    {...props}>
    {children}
  </div>
);

export { Modal, ModalFooter };

export default Modal;
