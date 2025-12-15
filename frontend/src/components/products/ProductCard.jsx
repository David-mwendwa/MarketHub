import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { ROUTES } from '../../constants/routes';
import { Star, ShoppingCart, Eye, Loader2 } from 'lucide-react';
import WishlistButton from '../common/WishlistButton';

const ProductCard = ({ product, loading = false }) => {
  const {
    id,
    name,
    price,
    originalPrice,
    rating = 0,
    thumbnail,
    category = 'Electronics',
    isNew,
    isOnSale,
    reviewCount = 0,
  } = product;

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist } = useWishlist();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingToCart(true);

    addToCart({
      ...product,
      quantity: 1,
      price: product.discountedPrice || product.price,
    });

    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => {
      setIsAddingToCart(false);
      setTimeout(() => setIsAnimating(false), 200);
    }, 1000);
  };

  if (loading) {
    return <ProductCardSkeleton />;
  }

  const productUrl = ROUTES.PRODUCT.replace(':id', id);

  return (
    <div className='group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full'>
      <Link
        to={productUrl}
        className='block group-hover:shadow-inner transition-all duration-300 bg-white'>
        {/* Product Image */}
        <div className='relative h-56 w-full flex items-center justify-center p-2 bg-white'>
          {/* Hover overlay */}
          <div className='absolute inset-0 bg-gradient-to-b from-transparent to-black/5 dark:to-black/10 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

          {/* Main image */}
          <div className='relative w-full h-full flex items-center justify-center p-4'>
            <img
              src={thumbnail}
              alt={name}
              className='max-h-[180px] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105'
              loading='lazy'
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  'https://via.placeholder.com/300x300?text=Image+Not+Available';
              }}
            />
          </div>

          {/* Badges */}
          <div className='absolute top-4 right-4 flex flex-col space-y-2'>
            {isNew && (
              <div className='bg-green-100 dark:bg-green-900/80 text-green-800 dark:text-green-200 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm'>
                New
              </div>
            )}
            {isOnSale && originalPrice > price && (
              <div className='bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full'>
                {Math.round(((originalPrice - price) / originalPrice) * 100)}%
                OFF
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className='absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20'>
            <div className='flex justify-center space-x-2'>
              <WishlistButton
                product={product}
                size={20}
                className='bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700'
              />
              <Link
                to={productUrl}
                className='p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors'
                onClick={(e) => e.stopPropagation()}>
                <Eye className='h-5 w-5 text-gray-700 dark:text-gray-300' />
              </Link>
            </div>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className='p-5 flex flex-col flex-grow'>
        <div className='flex items-center justify-between mb-2'>
          <span className='inline-block px-2.5 py-1 text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 rounded-full'>
            {category}
          </span>

          {/* Rating */}
          <div className='flex items-center'>
            <div className='flex text-amber-400'>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < Math.floor(rating) ? 'fill-current' : ''}`}
                />
              ))}
            </div>
            <span className='text-xs text-gray-500 dark:text-gray-400 ml-1'>
              {reviewCount}
            </span>
          </div>
        </div>

        <Link to={productUrl} className='group/title block'>
          <h3 className='text-base font-medium text-gray-900 dark:text-white line-clamp-2 mb-3 group-hover/title:text-primary-600 dark:group-hover/title:text-primary-400 transition-colors leading-tight min-h-[2.5rem]'>
            {name}
          </h3>
        </Link>

        {/* Price & Add to Cart */}
        <div className='mt-auto flex items-center justify-between'>
          <div>
            <span className='text-xl font-bold text-gray-900 dark:text-white'>
              KES {price?.toLocaleString()}
            </span>
            {originalPrice > price && (
              <span className='ml-2 text-sm text-gray-500 dark:text-gray-400 line-through'>
                KES {originalPrice?.toLocaleString()}
              </span>
            )}
          </div>
          <Button
            size='sm'
            variant='outline'
            className={`rounded-full border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all duration-300 ${
              isAnimating ? '!bg-green-100 dark:!bg-green-900/30' : ''
            }`}
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            title='Add to cart'>
            {isAddingToCart ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : isAnimating ? (
              <span className='text-green-600 dark:text-green-400'>✓</span>
            ) : (
              <ShoppingCart className='h-4 w-4' />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Skeleton Loader for Product Card
const ProductCardSkeleton = () => {
  return (
    <div className='group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full'>
      {/* Image Skeleton */}
      <div className='relative overflow-hidden aspect-square bg-gray-100 dark:bg-gray-700 animate-pulse' />

      {/* Content Skeleton */}
      <div className='p-5 flex flex-col flex-grow'>
        {/* Category Skeleton */}
        <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-1/3 mb-3' />

        {/* Title Skeleton */}
        <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded w-4/5 mb-4' />

        {/* Rating Skeleton */}
        <div className='flex items-center mb-4'>
          <div className='flex space-x-1'>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className='h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full'
              />
            ))}
          </div>
          <div className='h-3 w-10 bg-gray-200 dark:bg-gray-700 rounded-full ml-2' />
        </div>

        {/* Color Swatches Skeleton */}
        <div className='flex items-center mb-4 space-x-2'>
          <div className='h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded-full' />
          <div className='flex -space-x-1.5'>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className='h-4 w-4 rounded-full bg-gray-200 dark:bg-gray-700'
              />
            ))}
          </div>
        </div>

        {/* Price & Add to Cart Skeleton */}
        <div className='mt-auto flex items-center justify-between'>
          <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3' />
          <div className='h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-full' />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
