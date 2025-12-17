import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { ROUTES } from '../../constants/routes';
import {
  Star,
  ShoppingCart,
  Eye,
  Loader2,
  Check,
  Minus,
  Plus,
  Heart,
} from 'lucide-react';

const ProductCard = ({ product, loading = false }) => {
  const {
    _id,
    name,
    price,
    specialPrice,
    rating = 0,
    thumbnail,
    category = 'Uncategorized',
    stock = { qty: 0, status: 'out_of_stock' },
    isNew,
    isOnSale,
    reviewCount = 0,
    typeId,
    vendor,
  } = product || {};

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const {
    addToCart,
    updateQuantity,
    removeFromCart,
    isInCart,
    increaseQuantity,
    decreaseQuantity,
    getItemQuantity,
  } = useCart();

  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const isOutOfStock = !product?.isInStock || stock?.qty <= 0;
  const currentStock = stock?.qty || 0;
  const displayPrice =
    specialPrice !== null && specialPrice < price ? specialPrice : price;
  const showOriginalPrice = specialPrice !== null && specialPrice < price;
  const isProductInCart = isInCart(_id);
  const currentQuantity = getItemQuantity(_id) || 0;

  const handleAddToCart = useCallback(
    (e) => {
      e?.preventDefault();
      e?.stopPropagation();

      console.log({ specialPrice });

      if (!_id || isOutOfStock) return;
      // Set loading state
      setIsAddingToCart(true);
      const productData = {
        ...product,
        _id,
        quantity: 1,
        price: displayPrice,
        originalPrice: price,
        stock: currentStock,
        thumbnail:
          thumbnail || 'https://via.placeholder.com/300x300?text=No+Image',
      };
      // Add to cart
      addToCart(productData);
      // Animation sequence
      setTimeout(() => {
        setIsAddingToCart(false);
        setIsAnimating(true);

        // Reset animation after showing checkmark
        setTimeout(() => {
          setIsAnimating(false);
        }, 1000); // Show checkmark for 1 second
      }, 500); // Show loading spinner for 0.5 seconds
    },
    [
      _id,
      isOutOfStock,
      displayPrice,
      price,
      currentStock,
      thumbnail,
      addToCart,
      product,
    ]
  );

  const handleWishlistToggle = useCallback(
    (e) => {
      e?.preventDefault();
      e?.stopPropagation();

      if (!_id) return;

      if (isInWishlist(_id)) {
        removeFromWishlist(_id);
      } else {
        addToWishlist(product);
      }
    },
    [_id, isInWishlist, product, addToWishlist, removeFromWishlist]
  );

  if (loading) {
    return <ProductCardSkeleton />;
  }

  if (!_id) {
    console.error('Product ID is undefined', { product });
    return null;
  }

  const productUrl = ROUTES.PRODUCT.replace(':id', _id);

  return (
    <div className='group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full'>
      <Link
        to={productUrl}
        className='block group-hover:shadow-inner transition-all duration-300 bg-white'>
        {/* Product Image */}
        <div className='relative h-56 w-full flex items-center justify-center p-2 bg-white'>
          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className='absolute inset-0 bg-black/50 z-10 flex items-center justify-center'>
              <span className='bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full'>
                Out of Stock
              </span>
            </div>
          )}

          {/* Main image */}
          <div className='relative w-full h-full flex items-center justify-center p-4'>
            <img
              src={
                thumbnail || 'https://via.placeholder.com/300x300?text=No+Image'
              }
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
            {specialPrice != null && specialPrice < price && (
              <div className='bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full'>
                {Math.round(((price - specialPrice) / price) * 100)}% OFF
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className='absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20'>
            <div className='flex justify-center space-x-2'>
              <button
                onClick={handleWishlistToggle}
                className={`p-2 rounded-full transition-colors ${
                  isInWishlist(_id)
                    ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/80 dark:text-red-200'
                    : 'bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700'
                }`}
                title={
                  isInWishlist(_id) ? 'Remove from wishlist' : 'Add to wishlist'
                }>
                <Heart
                  className='h-5 w-5'
                  fill={isInWishlist(_id) ? 'currentColor' : 'none'}
                />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = productUrl;
                }}
                className='p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors'
                title='Quick view'>
                <Eye className='h-5 w-5 text-gray-700 dark:text-gray-300' />
              </button>
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
          <div className='flex-1 min-w-0 mr-4'>
            <div className='flex flex-col'>
              {specialPrice != null && specialPrice < price ? (
                <>
                  <div className='flex items-center space-x-1'>
                    <span className='text-base font-bold text-gray-900 dark:text-white whitespace-nowrap'>
                      KES {specialPrice?.toLocaleString()}
                    </span>
                  </div>
                  <div className='text-xs text-gray-500 dark:text-gray-400 line-through whitespace-nowrap'>
                    KES {price?.toLocaleString()}
                  </div>
                </>
              ) : (
                <span className='text-base font-bold text-gray-900 dark:text-white whitespace-nowrap'>
                  KES {price?.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {isProductInCart ? (
            <div className='flex-shrink-0'>
              {' '}
              {/* Prevent cart controls from affecting the layout */}
              <div className='flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 p-1'>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    decreaseQuantity(_id);
                  }}
                  className='p-1.5 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-full transition-colors'
                  aria-label='Decrease quantity'>
                  <Minus className='h-3 w-3' />
                </button>
                <span className='text-sm font-medium min-w-[20px] text-center'>
                  {getItemQuantity(_id) || 0}
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    increaseQuantity(_id);
                  }}
                  disabled={currentQuantity >= currentStock}
                  className='p-1.5 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50'
                  aria-label='Increase quantity'>
                  <Plus className='h-3 w-3' />
                </button>
              </div>
            </div>
          ) : (
            <div className='flex-shrink-0'>
              {' '}
              {/* Wrap button in a flex-shrink-0 container */}
              <Button
                size='sm'
                variant='outline'
                className={`rounded-full border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all duration-300 ${
                  isAnimating ? '!bg-green-100 dark:!bg-green-900/30' : ''
                }`}
                onClick={handleAddToCart}
                disabled={isAddingToCart || isOutOfStock}
                title={isOutOfStock ? 'Out of stock' : 'Add to cart'}>
                {isAddingToCart ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : isAnimating ? (
                  <Check className='h-4 w-4 text-green-600 dark:text-green-400' />
                ) : (
                  <ShoppingCart className='h-4 w-4' />
                )}
              </Button>
            </div>
          )}
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
