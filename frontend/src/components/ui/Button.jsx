import React from 'react';
import { cn } from '../../lib/utils';

const Button = React.forwardRef(
  (
    {
      children,
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      fullWidth = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      startIcon, // Alias for leftIcon
      as: Component = 'button', // Support custom component rendering
      asChild = false, // Add asChild prop
      ...props
    },
    ref
  ) => {
    const variants = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      outline:
        'border border-input hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
      danger:
        'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    };

    const sizes = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 py-2 px-4',
      lg: 'h-11 px-8',
      icon: 'h-10 w-10',
    };

    const baseStyles =
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    // Use startIcon if provided, otherwise fall back to leftIcon
    const StartIcon = startIcon || LeftIcon;

    // If asChild is true, clone the child and add our classes to it
    if (asChild) {
      return React.cloneElement(React.Children.only(children), {
        className: cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        ),
        ref,
        ...props,
      });
    }

    const buttonProps = {
      className: cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      ),
      disabled:
        (Component === 'button' && (isLoading || disabled)) || undefined,
      'aria-disabled': isLoading || disabled || undefined,
      ref,
      ...props,
    };

    return (
      <Component {...buttonProps}>
        {isLoading ? (
          <>
            <svg
              className='animate-spin -ml-1 mr-3 h-5 w-5 text-current'
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
            {children}
          </>
        ) : (
          <>
            {StartIcon && (
              <span className='mr-2'>
                {React.isValidElement(StartIcon) ? (
                  StartIcon
                ) : (
                  <StartIcon className='h-5 w-5' />
                )}
              </span>
            )}
            {children}
            {RightIcon && (
              <span className='ml-2'>
                {React.isValidElement(RightIcon) ? (
                  RightIcon
                ) : (
                  <RightIcon className='h-5 w-5' />
                )}
              </span>
            )}
          </>
        )}
      </Component>
    );
  }
);

Button.displayName = 'Button';

export { Button };
