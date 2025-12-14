import React from 'react';
import { cn } from '../../lib/utils';

const variantClasses = {
  default: 'bg-background text-foreground',
  destructive:
    'border-red-500/50 text-red-700 dark:text-red-400 dark:border-red-500 [&>svg]:text-red-500',
  success:
    'border-green-500/50 text-green-700 dark:text-green-400 dark:border-green-500 [&>svg]:text-green-500',
};

const Alert = React.forwardRef(
  ({ className, variant = 'default', ...props }, ref) => {
    const baseClasses =
      'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4';
    const variantClass = variantClasses[variant] || variantClasses.default;

    return (
      <div
        ref={ref}
        role='alert'
        className={cn(baseClasses, variantClass, className)}
        {...props}
      />
    );
  }
);
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
