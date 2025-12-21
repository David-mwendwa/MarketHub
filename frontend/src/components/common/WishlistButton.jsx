import { useWishlist } from '../../contexts/WishlistContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Custom heart icon with animation
const HeartIcon = ({ isFilled, size = 20, className = '' }) => {
  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}>
      <AnimatePresence mode='wait'>
        {isFilled ? (
          <motion.div
            key='filled'
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            className='absolute inset-0 text-red-500'>
            <svg
              viewBox='0 0 24 24'
              fill='currentColor'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='w-full h-full'>
              <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
            </svg>
          </motion.div>
        ) : (
          <motion.div
            key='outline'
            initial={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className='absolute inset-0 text-gray-400 group-hover:text-red-500 transition-colors'>
            <svg
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='w-full h-full'>
              <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse effect when added to wishlist */}
      {isFilled && (
        <motion.div
          className='absolute inset-0 rounded-full bg-red-500/20'
          initial={{ scale: 1, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.6, repeat: isFilled ? 1 : 0 }}
        />
      )}
    </div>
  );
};

const WishlistButton = ({
  product,
  size = 20,
  className = '',
  onWishlistUpdate,
}) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product._id || product.id);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      removeFromWishlist(product._id || product.id);
      if (onWishlistUpdate) {
        onWishlistUpdate(false, product.name);
      } else {
        toast.success('Removed from wishlist', {
          position: 'bottom-right',
          style: {
            background: '#22c55e', // Green for success
            color: '#fff',
          },
        });
      }
    } else {
      addToWishlist(product);
      if (onWishlistUpdate) {
        onWishlistUpdate(true, product.name);
      } else {
        toast.success('Added to wishlist', {
          position: 'bottom-right',
          style: {
            background: '#22c55e', // Green for success
            color: '#fff',
          },
        });
      }
    }
  };

  return (
    <motion.button
      onClick={handleWishlistToggle}
      className={`p-2 rounded-full transition-colors group ${
        isWishlisted
          ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
          : 'text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700/50'
      } ${className}`}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      whileTap={{ scale: 0.9 }}>
      <HeartIcon isFilled={isWishlisted} size={20} />
    </motion.button>
  );
};

export default WishlistButton;
