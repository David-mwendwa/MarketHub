import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const Logo = ({
  className = '',
  withBadge = true,
  size = 'xl',
  iconOnly = false,
  theme = 'default', // 'default' | 'inverse' | 'minimal'
}) => {
  const sizeClasses = {
    sm: { text: 'text-lg', icon: 'h-4 w-4' },
    md: { text: 'text-xl', icon: 'h-5 w-5' },
    lg: { text: 'text-2xl', icon: 'h-6 w-6' },
    xl: { text: 'text-3xl', icon: 'h-7 w-7' },
  };

  const themeClasses = {
    default: {
      text: 'from-primary-600 to-primary-800',
      badge:
        'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300',
      icon: 'text-primary-500',
    },
    inverse: {
      text: 'from-white to-gray-100',
      badge: 'bg-white/20 text-white',
      icon: 'text-white',
    },
    minimal: {
      text: 'from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400',
      badge: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      icon: 'text-primary-500',
    },
  };

  const currentTheme = themeClasses[theme] || themeClasses.default;
  const currentSize = sizeClasses[size] || sizeClasses.xl;

  return (
    <Link
      to='/'
      className={`inline-flex items-center font-bold tracking-tight ${className}`}
      aria-label='MarketHub EA - Home'>
      {iconOnly ? (
        <ShoppingBag
          className={`${currentSize.icon} ${currentTheme.icon} transition-transform group-hover:scale-110`}
          aria-hidden='true'
        />
      ) : (
        <>
          <ShoppingBag
            className={`${currentSize.icon} ${currentTheme.icon} mr-2 ${!iconOnly ? 'block' : 'hidden'}`}
            aria-hidden='true'
          />
          <span
            className={`${currentSize.text} bg-gradient-to-r ${currentTheme.text} bg-clip-text text-transparent`}>
            Market
            <span className={currentTheme.icon}>Hub</span>
            {withBadge && (
              <span
                className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${currentTheme.badge}`}>
                EA
              </span>
            )}
          </span>
        </>
      )}
    </Link>
  );
};

export default Logo;
