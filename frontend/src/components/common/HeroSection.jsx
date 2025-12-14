import React from 'react';

const HeroSection = ({
  title,
  highlightText,
  highlightText2,
  highlightClass2 = '',
  description,
  background = 'from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900',
  textColor = 'text-gray-900 dark:text-white',
  highlightColor = 'text-primary-600 dark:text-primary-400',
  descriptionColor = 'text-gray-600 dark:text-gray-300',
  badgeText,
  badgeColor = 'text-primary-600 dark:text-primary-400',
  className = '',
  titleSize = 'text-4xl md:text-5xl',
  descriptionClass = 'text-base',
  children,
}) => {
  return (
    <section
      className={`relative bg-gradient-to-r ${background} py-8 sm:py-12 ${className}`}>
      {/* Background elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -right-20 -top-20 w-64 h-64 bg-primary-100 dark:bg-primary-900/30 rounded-full filter blur-3xl opacity-40'></div>
        <div className='absolute -left-20 -bottom-20 w-64 h-64 bg-purple-100 dark:bg-purple-900/30 rounded-full filter blur-3xl opacity-40'></div>
      </div>

      <div className='container mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <div className='max-w-4xl mx-auto text-center'>
          {badgeText && (
            <span
              className={`inline-block ${badgeColor} text-sm font-medium mb-4`}>
              {badgeText}
            </span>
          )}
          <div className='flex flex-wrap items-center justify-center gap-3 mb-4'>
            <h1 className={`${titleSize} font-bold ${textColor} leading-tight`}>
              {title}{' '}
              {highlightText && (
                <span className={highlightColor}>{highlightText}</span>
              )}
            </h1>
            {highlightText2 && (
              <span className={`${highlightClass2} self-start`}>
                {highlightText2}
              </span>
            )}
          </div>
          {description && (
            <p
              className={`${descriptionClass} ${descriptionColor} max-w-2xl mx-auto`}>
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
