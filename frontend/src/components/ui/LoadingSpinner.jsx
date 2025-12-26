import React from 'react';
import { cn } from '../../lib/utils';

const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
  label = 'Loading...',
  showLabel = false,
  centered = false,
  fullScreen = false,
  className = '',
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    xs: { container: 'h-3 w-3', text: 'text-xs' },
    sm: { container: 'h-4 w-4', text: 'text-sm' },
    md: { container: 'h-5 w-5', text: 'text-sm' },
    lg: { container: 'h-8 w-8', text: 'text-base' },
    xl: { container: 'h-12 w-12', text: 'text-lg' },
  };

  // Color classes
  const colorClasses = {
    primary: 'text-primary-500',
    secondary: 'text-secondary',
    destructive: 'text-destructive',
    muted: 'text-muted-foreground',
    accent: 'text-accent-foreground',
    foreground: 'text-foreground',
    background: 'text-background',
  };

  // Animation variants
  const spinnerVariants = {
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
    ping: 'animate-ping',
    spin: 'animate-spin',
  };

  // Container classes
  const containerClasses = cn(
    'inline-flex items-center gap-3 transition-all duration-300',
    centered ? 'justify-center w-full' : 'justify-start',
    fullScreen &&
      'fixed inset-0 h-screen w-screen bg-background/80 backdrop-blur-sm z-50',
    className
  );

  // Spinner container classes
  const spinnerContainerClasses = cn(
    'relative flex items-center justify-center',
    sizeClasses[size]?.container || sizeClasses.md.container
  );

  // Spinner classes
  const spinnerClasses = cn(
    'animate-spin rounded-full border-t-2 border-b-2 border-current',
    colorClasses[color] || colorClasses.primary,
    'ease-linear duration-700'
  );

  // Label classes
  const labelClasses = cn(
    'font-medium',
    sizeClasses[size]?.text || 'text-sm',
    colorClasses[color] || colorClasses.primary
  );

  return (
    <div
      className={containerClasses}
      role='status'
      aria-live='polite'
      aria-busy='true'
      {...props}>
      <div className={spinnerContainerClasses}>
        <div
          className={spinnerClasses}
          style={{ width: '100%', height: '100%' }}>
          <span className='sr-only'>{label}</span>
        </div>
      </div>
      {showLabel && <span className={labelClasses}>{label}</span>}
    </div>
  );
};

export default LoadingSpinner;
