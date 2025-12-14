import React from 'react';

export const Backdrop = ({
  children,
  className = '',
  backdropClassName = 'bg-black/60 backdrop-blur-sm',
  zIndex = 'z-50',
}) => {
  return (
    <div className={`fixed inset-0 ${zIndex} ${className}`}>
      <div
        className={`fixed inset-0 ${backdropClassName} transition-all duration-200`}
        aria-hidden='true'
      />
      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <div className='relative w-full max-w-md'>{children}</div>
      </div>
    </div>
  );
};

Backdrop.defaultProps = {
  backdropClassName: 'bg-black/60 backdrop-blur-sm',
  zIndex: 'z-50',
};

export default Backdrop;
