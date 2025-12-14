import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

const CategoryCard = ({
  category,
  className = '',
  variant = 'default', // 'default' or 'homepage'
}) => {
  const {
    id,
    name,
    image,
    description,
    count,
    productCount,
    icon,
    bg = 'bg-white/20',
    height = 'h-80',
    showExplore = true,
  } = category;

  const itemsCount = count || productCount;

  if (variant === 'homepage') {
    return (
      <Link
        to={`/shop?category=${name.toLowerCase()}`}
        className={`group relative overflow-hidden rounded-2xl shadow-lg ${height} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${className}`}>
        {/* Background Image with Overlay */}
        <div className='absolute inset-0 z-0'>
          <div className='absolute inset-0 w-full h-full'>
            {/* Background color overlay */}
            <div
              className={`absolute inset-0 ${bg} transition-all duration-300 group-hover:opacity-90`}></div>
            <img
              src={
                image ||
                `https://picsum.photos/seed/category-${id || name}/600/400`
              }
              alt={name}
              className='absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
              loading='lazy'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent'></div>
          </div>
        </div>

        {/* Content */}
        <div className='relative z-10 h-full flex flex-col p-6'>
          {/* Top Section */}
          <div className='flex-1 flex flex-col items-center justify-center text-center text-white'>
            <div className='w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 group-hover:bg-white/30'>
              <div className='text-white'>{icon}</div>
            </div>
            <h3 className='text-2xl font-bold mb-2'>{name}</h3>
            {itemsCount !== undefined && (
              <p className='text-sm text-white/80'>
                {itemsCount} {itemsCount === 1 ? 'item' : 'items'} available
              </p>
            )}
          </div>

          {/* Bottom Section */}
          {showExplore && (
            <div className='mt-auto'>
              <div className='h-px w-full bg-white/20 mb-4'></div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-white/80'>
                  Explore Collection
                </span>
                <div className='w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300 transform group-hover:translate-x-1'>
                  <svg
                    className='w-4 h-4 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M14 5l7 7m0 0l-7 7m7-7H3'
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </Link>
    );
  }

  // Default variant (for categories page)
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl shadow-lg h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${className}`}>
      <div className='absolute inset-0 z-0'>
        <img
          src={
            image || `https://picsum.photos/seed/category-${id || name}/600/400`
          }
          alt={name}
          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
          loading='lazy'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent' />
      </div>

      <div className='relative z-10 h-full flex flex-col p-6 justify-end'>
        {icon && (
          <div className='w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3 group-hover:bg-white/30 transition-colors duration-300'>
            <div className='text-white'>
              {React.cloneElement(icon, { className: 'w-6 h-6' })}
            </div>
          </div>
        )}
        <h3 className='text-2xl font-bold text-white mb-2 drop-shadow-sm'>
          {name}
        </h3>

        {description && (
          <p className='text-sm text-white/90 line-clamp-2 mb-4 drop-shadow-sm'>
            {description}
          </p>
        )}

        <hr className='border-t border-white/20 my-4' />

        <div className='flex items-center justify-between'>
          {itemsCount !== undefined && (
            <span className='text-sm text-white/80'>
              {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
            </span>
          )}

          <Button
            as={Link}
            to={`/shop?category=${name.toLowerCase()}`}
            variant='outline'
            size='sm'
            className='bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:border-white/30'>
            View All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
