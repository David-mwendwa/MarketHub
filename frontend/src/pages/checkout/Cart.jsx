import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import WishlistButton from '@/components/common/WishlistButton';

// Shipping Modal Component
const ShippingModal = ({
  shippingOptions,
  shipping,
  setShipping,
  subtotal,
  onClose,
}) => (
  <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
    <div className='bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto'>
      <div className='p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
            Shipping Options
          </h3>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'>
            <X className='h-6 w-6' />
          </button>
        </div>

        <div className='space-y-4'>
          {shippingOptions.map((option) => (
            <div
              key={option.id}
              className={`p-4 border rounded-lg ${
                shipping === option.price
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}>
              <div className='flex items-start'>
                <input
                  type='radio'
                  id={option.id}
                  name='shipping-option'
                  className='h-4 w-4 mt-1 text-primary-600 border-gray-300 focus:ring-primary-500'
                  checked={shipping === option.price}
                  onChange={() => setShipping(option.price)}
                />
                <div className='ml-3'>
                  <label
                    htmlFor={option.id}
                    className='block text-sm font-medium text-gray-900 dark:text-white'>
                    {option.name}
                  </label>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    {option.description}
                  </p>
                  <p className='text-sm mt-1'>
                    {subtotal >= option.freeThreshold ? (
                      <span className='text-green-600 dark:text-green-400 font-medium'>
                        Free shipping
                      </span>
                    ) : (
                      <>
                        {formatCurrency(option.price)}
                        {option.freeThreshold > 0 && (
                          <span className='text-gray-500 dark:text-gray-400 text-xs ml-2'>
                            Free on orders over{' '}
                            {formatCurrency(option.freeThreshold)
                              .replace('Ksh', '')
                              .trim()}
                          </span>
                        )}
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='mt-6 flex justify-end'>
          <Button onClick={onClose} className='px-4 py-2'>
            Close
          </Button>
        </div>
      </div>
    </div>
  </div>
);
import {
  Trash2,
  ArrowLeft,
  ShoppingBag,
  Plus,
  Minus,
  Truck,
  Shield,
  RefreshCw,
  ArrowRight,
  X,
  Clock,
  Tag,
  Heart,
  Check,
  ChevronDown,
  AlertTriangle,
  Package,
  ChevronRight,
  Star,
  CheckCircle,
  Info,
  Headphones,
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishListContext';
import { format } from 'date-fns';
import { formatCurrency } from '../../lib/utils';

const Cart = () => {
  const { isInWishlist } = useWishlist();

  // Get all cart values from context
  const {
    cartItems: items = [],
    subtotal = 0,
    shipping = 0,
    tax = 0,
    total = 0,
    itemCount = 0,
    updateQuantity = () => {},
    removeFromCart = () => {},
    clearCart = () => {},
    addToCart = () => {},
    isInCart = () => false,
  } = useCart() || {};

  const [isRemoving, setIsRemoving] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  // Use shipping from context instead of local state
  // const [shipping, setShipping] = useState(0);

  // Shipping options data
  const shippingOptions = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      price: 9.99,
      description: '3-5 business days',
      freeThreshold: 100,
    },
    {
      id: 'express',
      name: 'Express Shipping',
      price: 19.99,
      description: '1-2 business days',
      freeThreshold: 200,
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      price: 29.99,
      description: 'Next business day',
      freeThreshold: 300,
    },
  ];

  useEffect(() => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + Math.floor(Math.random() * 3) + 3);
    const formattedDate = format(deliveryDate, 'EEEE, MMMM d, yyyy');

    const timer = setTimeout(() => {
      setEstimatedDelivery(formattedDate);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const relatedProducts = [
    {
      id: '101',
      name: 'Wireless Earbuds Pro',
      price: 129.99,
      image:
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      rating: 4.7,
      reviewCount: 124,
      inStock: true,
      stock: 15,
    },
    {
      id: '102',
      name: 'Bluetooth Speaker',
      price: 89.99,
      image:
        'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      rating: 4.5,
      reviewCount: 89,
      inStock: true,
      stock: 8,
    },
    {
      id: '103',
      name: 'Noise Cancelling Headphones',
      price: 199.99,
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      rating: 4.8,
      reviewCount: 215,
      inStock: true,
      stock: 3,
    },
  ];

  const applyPromoCode = (e) => {
    e.preventDefault();
    if (promoCode.trim() === '') return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsPromoApplied(true);
      setIsLoading(false);
      setShowPromoInput(false);
    }, 1000);
  };

  const getStockStatus = (item) => {
    // Handle both number and object stock formats
    const stockQty =
      typeof item.stock === 'number' ? item.stock : (item.stock?.qty ?? 0);
    const stockStatus =
      item.stockStatus || (stockQty > 0 ? 'in_stock' : 'out_of_stock');

    if (stockStatus === 'out_of_stock' || stockQty <= 0) {
      return {
        text: 'Out of Stock',
        color: 'text-gray-500 dark:text-gray-400',
        isInStock: false,
      };
    }

    if (stockQty > 10) {
      return {
        text: 'In Stock',
        color: 'text-green-600 dark:text-green-400',
        isInStock: true,
      };
    }

    if (stockQty > 3) {
      return {
        text: `${stockQty} left in stock`,
        color: 'text-amber-600 dark:text-amber-400',
        isInStock: true,
      };
    }

    return {
      text: `Only ${stockQty} left!`,
      color: 'text-red-600 dark:text-red-400',
      isInStock: true,
    };
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      return;
    }
    updateQuantity(id, parseInt(newQuantity, 10));
  };

  const handleRemoveItem = (id) => {
    setIsRemoving(true);
    try {
      removeFromCart(id);
    } catch (error) {
      console.error('❌ Error removing item:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleAddToCart = (product) => {
    try {
      addToCart(product, 1);
    } catch (error) {}
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  // Empty Cart UI
  if (!items || !Array.isArray(items) || items.length === 0) {
    return (
      <div className='container mx-auto px-4 py-12'>
        <div className='max-w-2xl mx-auto text-center'>
          <div className='relative inline-block mb-6'>
            <ShoppingBag className='mx-auto h-20 w-20 text-gray-300 dark:text-gray-600' />
            <div className='absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-8 h-8 flex items-center justify-center'>
              <X className='h-5 w-5' />
            </div>
          </div>

          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-3'>
            Your cart is empty
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto'>
            Looks like you haven't added anything to your cart yet. Let's find
            something special for you!
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center mb-12'>
            <Button
              as={Link}
              to='/shop'
              className='bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 text-base'
              startIcon={<ArrowLeft className='h-5 w-5' />}>
              Continue Shopping
            </Button>
            <Button
              variant='outline'
              as={Link}
              to='/deals'
              className='px-8 py-3 text-base'>
              <Tag className='h-5 w-5 mr-2 text-rose-500' />
              View Today's Deals
            </Button>
          </div>

          {/* Recommended Products */}
          <div className='mt-16 text-left'>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
              You might also like
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {relatedProducts.map((product) => (
                <div
                  key={product.id}
                  className='group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 dark:border-gray-700'>
                  <div className='aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-xl bg-gray-100 dark:bg-gray-700'>
                    <img
                      src={product.image}
                      alt={product.name}
                      className='h-48 w-full object-cover object-center group-hover:opacity-90 transition-opacity duration-200'
                    />
                    {product.stock < 5 && product.stock > 0 && (
                      <div className='absolute top-3 left-3 bg-amber-100 dark:bg-amber-900/80 text-amber-800 dark:text-amber-100 text-xs font-medium px-2.5 py-0.5 rounded-full'>
                        Only {product.stock} left!
                      </div>
                    )}
                  </div>
                  <div className='p-4'>
                    <div className='flex items-center mb-1'>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= Math.floor(product.rating)
                              ? 'text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                          fill={
                            star <= product.rating ? 'currentColor' : 'none'
                          }
                        />
                      ))}
                      <span className='ml-1 text-xs text-gray-500 dark:text-gray-400'>
                        ({product.reviewCount})
                      </span>
                    </div>
                    <h3 className='font-medium text-gray-900 dark:text-white mb-1 line-clamp-2 h-10'>
                      {product.name}
                    </h3>
                    <div className='flex items-center justify-between mt-3'>
                      <span className='text-lg font-bold text-gray-900 dark:text-white'>
                        ${product.price.toFixed(2)}
                      </span>
                      <Button
                        size='sm'
                        onClick={() => {
                          // Add to cart logic would go here
                          updateQuantity(product.id, 1);
                        }}
                        className='bg-primary-600 hover:bg-primary-700 text-white'>
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className='mt-10 text-center'>
              <Button
                variant='outline'
                as={Link}
                to='/shop'
                className='inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300'>
                View all products
                <ChevronRight className='ml-1 h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-12 relative'>
      {/* Shipping Modal */}
      {showShippingModal && (
        <ShippingModal
          shippingOptions={shippingOptions}
          shipping={shipping}
          setShipping={setShipping}
          subtotal={subtotal}
          onClose={() => setShowShippingModal(false)}
        />
      )}
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            Your Shopping Cart
          </h1>
          <p className='text-gray-500 dark:text-gray-400 mt-1'>
            {items.length} {items.length === 1 ? 'item' : 'items'}
            {itemCount > 0 &&
              ` • ${itemCount} ${itemCount === 1 ? 'piece' : 'pieces'}`}
            {' • '}
            {formatCurrency(subtotal)}
          </p>
        </div>

        <div className='flex flex-wrap gap-2'>
          <Button
            variant='outline'
            onClick={handleClearCart}
            className='text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex-1 md:flex-none'
            startIcon={<Trash2 className='h-4 w-4' />}>
            Clear Cart
          </Button>
        </div>
      </div>

      <div className='lg:grid lg:grid-cols-12 gap-8'>
        {/* Cart Items */}
        <div className='lg:col-span-8 space-y-4'>
          <AnimatePresence>
            {items.map((item, index) => {
              const stockStatus = getStockStatus(item);
              const stockQty =
                typeof item.stock === 'number'
                  ? item.stock
                  : (item.stock?.qty ?? 0);
              const isLowStock = stockQty < 5 && stockQty > 0;

              return (
                <motion.div
                  key={`${item.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  layout
                  transition={{
                    duration: 0.3,
                    layout: { type: 'spring', stiffness: 500, damping: 50 },
                  }}
                  className={`group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-200 hover:shadow-md ${
                    isRemoving ? 'opacity-50' : ''
                  }`}>
                  {/* Stock indicator bar */}
                  {isLowStock && (
                    <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600' />
                  )}

                  <div className='flex flex-col sm:flex-row'>
                    {/* Cart item image with thumbnail */}
                    <Link
                      to={`/product/${item._id || item.id}`}
                      className='w-full sm:w-40 h-40 bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0 relative group-hover:opacity-90 transition-opacity'>
                      <img
                        src={
                          item.thumbnail || 'https://via.placeholder.com/150'
                        }
                        alt={item.name}
                        className='w-full h-full object-cover'
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/150';
                        }}
                      />
                      {!stockStatus.isInStock && (
                        <div className='absolute bottom-2 left-2 bg-red-100 dark:bg-red-900/90 text-red-800 dark:text-red-100 text-xs font-medium px-2 py-0.5 rounded-full'>
                          Out of Stock
                        </div>
                      )}
                      {stockStatus.isInStock && isLowStock && (
                        <div
                          className={`absolute bottom-2 left-2 ${stockStatus.color.includes('red') ? 'bg-red-100 dark:bg-red-900/90 text-red-800 dark:text-red-100' : 'bg-amber-100 dark:bg-amber-900/90 text-amber-800 dark:text-amber-100'} text-xs font-medium px-2 py-0.5 rounded-full`}>
                          {stockStatus.text}
                        </div>
                      )}
                    </Link>

                    <div className='p-4 flex-1 flex flex-col sm:flex-row justify-between'>
                      <div className='flex-1'>
                        <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between'>
                          <div>
                            <Link
                              to={`/product/${item._id || item.id}`}
                              className='hover:opacity-80 transition-opacity'>
                              <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                                {item.name}
                              </h3>
                              {item.brand && (
                                <p className='text-sm text-gray-500 dark:text-gray-400'>
                                  {item.brand}
                                </p>
                              )}
                            </Link>

                            {/* Stock status for mobile */}
                            <div className='sm:hidden mt-1'>
                              <p
                                className={`text-xs ${stockStatus.color} flex items-center`}>
                                {!stockStatus.isInStock ? (
                                  <span>Out of Stock</span>
                                ) : isLowStock ? (
                                  <>
                                    <AlertTriangle className='h-3 w-3 mr-1' />
                                    <span>{stockStatus.text}</span>
                                  </>
                                ) : (
                                  <span>In Stock</span>
                                )}
                              </p>
                            </div>
                          </div>

                          <p className='text-lg font-semibold text-gray-900 dark:text-white mt-1 sm:mt-0 whitespace-nowrap'>
                            {formatCurrency(item.price * item.quantity)}
                            {item.quantity > 1 && (
                              <span className='text-sm font-normal text-gray-500 dark:text-gray-400 ml-1'>
                                (
                                {formatCurrency(item.price)
                                  .replace('Ksh', '')
                                  .trim()}{' '}
                                each)
                              </span>
                            )}
                          </p>
                        </div>

                        {/* Stock status for desktop */}
                        <div className='hidden sm:block mt-1'>
                          <p
                            className={`text-xs ${stockStatus.color} flex items-center`}>
                            {!stockStatus.isInStock ? (
                              <span>Out of Stock</span>
                            ) : isLowStock ? (
                              <>
                                <AlertTriangle className='h-3 w-3 mr-1' />
                                <span>{stockStatus.text}</span>
                              </>
                            ) : (
                              <span>In Stock</span>
                            )}
                          </p>
                        </div>

                        {/* Estimated delivery */}
                        <div className='flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1'>
                          <Clock className='h-3 w-3 mr-1' />
                          <span>Get it by {estimatedDelivery}</span>
                        </div>

                        {/* Quantity Controls */}
                        <div className='mt-3 flex flex-wrap items-center gap-3'>
                          <div className='flex items-center bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden border border-gray-200 dark:border-gray-600'>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleQuantityChange(
                                  item._id, // Changed from item.id to item._id
                                  item.quantity - 1
                                );
                              }}
                              disabled={item.quantity <= 1}
                              className='p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'>
                              <Minus className='h-4 w-4' />
                            </button>

                            <span className='w-10 text-center text-sm font-medium'>
                              {item.quantity}
                            </span>

                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleQuantityChange(
                                  item._id, // Changed from item.id to item._id
                                  item.quantity + 1
                                );
                              }}
                              disabled={
                                !stockStatus.isInStock ||
                                (isLowStock && item.quantity >= stockQty)
                              }
                              className='p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'>
                              <Plus className='h-4 w-4' />
                            </button>
                          </div>

                          <div className='flex items-center'>
                            <WishlistButton
                              product={item}
                              className='h-10 w-10 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center justify-center transition-colors rounded-md'
                              buttonClass='h-full w-full flex items-center justify-center p-0'
                            />

                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleRemoveItem(item._id);
                              }}
                              className='p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors'>
                              <Trash2 className='h-5 w-5' />
                              <span className='sr-only'>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className='lg:col-span-4'>
          <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden h-fit sticky top-6'>
            {/* Order Summary Header */}
            <div className='bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-100 dark:border-gray-700'>
              <div className='flex items-center justify-between'>
                <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
                  Order Summary
                </h2>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                  {itemCount > 0 &&
                    ` • ${itemCount} ${itemCount === 1 ? 'piece' : 'pieces'}`}
                </p>
              </div>
            </div>

            <div className='p-6'>
              {/* Order Summary Content */}
              <div className='space-y-4'>
                {/* Promo Code */}
                <div className='mb-2'>
                  {!isPromoApplied ? (
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <button
                          onClick={() => setShowPromoInput(!showPromoInput)}
                          className='text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 inline-flex items-center'>
                          <Tag className='h-4 w-4 mr-1' />
                          {showPromoInput
                            ? 'Hide promo code'
                            : 'Have a promo code?'}
                        </button>
                      </div>

                      <AnimatePresence>
                        {showPromoInput && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className='overflow-hidden'>
                            <form
                              onSubmit={applyPromoCode}
                              className='mt-2 flex gap-2'>
                              <input
                                type='text'
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                placeholder='Enter promo code'
                                className='flex-1 min-w-0 block w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white'
                              />
                              <Button
                                type='submit'
                                size='sm'
                                disabled={!promoCode.trim() || isLoading}
                                className='whitespace-nowrap'>
                                {isLoading ? 'Applying...' : 'Apply'}
                              </Button>
                            </form>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className='bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-sm p-3 rounded-md flex items-start'>
                      <CheckCircle className='h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0' />
                      <div>
                        <p className='font-medium'>Promo code applied!</p>
                        <p className='text-green-700 dark:text-green-300'>
                          You saved{' '}
                          {formatCurrency(discount).replace('Ksh', '').trim()}{' '}
                          with this order.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsPromoApplied(false)}
                        className='ml-auto text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300'>
                        <X className='h-4 w-4' />
                      </button>
                    </div>
                  )}
                </div>

                {/* Order Summary Details */}
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600 dark:text-gray-300'>
                      Subtotal
                    </span>
                    <span className='font-medium'>
                      {formatCurrency(subtotal)}
                    </span>
                  </div>

                  {shipping > 0 ? (
                    <div className='flex justify-between'>
                      <div className='flex items-center'>
                        <span className='text-gray-600 dark:text-gray-300'>
                          Shipping
                        </span>
                        <button
                          onClick={() => setShowShippingModal(true)}
                          className='ml-1 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'>
                          <Info className='h-4 w-4' />
                        </button>
                      </div>
                      <span className='font-medium'>
                        {formatCurrency(shipping)}
                      </span>
                    </div>
                  ) : (
                    <div className='flex justify-between text-green-600 dark:text-green-400'>
                      <span>Shipping</span>
                      <span className='font-medium'>FREE</span>
                    </div>
                  )}

                  <div className='flex justify-between'>
                    <span className='text-gray-600 dark:text-gray-300'>
                      Tax
                    </span>
                    <span className='font-medium'>{formatCurrency(tax)}</span>
                  </div>

                  {isPromoApplied && (
                    <div className='flex justify-between text-green-600 dark:text-green-400'>
                      <span>Promo Discount</span>
                      <span className='font-medium'>
                        -{formatCurrency(discount).replace('Ksh ', '')}
                      </span>
                    </div>
                  )}

                  <div className='border-t border-gray-200 dark:border-gray-700 pt-3 mt-2 flex justify-between font-semibold text-lg'>
                    <span>Total</span>
                    <div className='text-right'>
                      <div className='text-gray-900 dark:text-white'>
                        {formatCurrency(total)}
                      </div>
                      {shipping > 0 && subtotal < 100 && (
                        <div className='text-xs font-normal text-green-600 dark:text-green-400'>
                          Add{' '}
                          {formatCurrency(100 - subtotal)
                            .replace('Ksh', '')
                            .trim()}{' '}
                          more for free shipping!
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Estimated Delivery */}
                <div className='bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-sm p-3 rounded-md flex items-start'>
                  <Truck className='h-5 w-5 text-blue-500 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0' />
                  <div>
                    <p className='font-medium'>Estimated Delivery</p>
                    <p className='text-blue-700 dark:text-blue-300'>
                      {estimatedDelivery}
                    </p>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  className='w-full bg-primary-600 hover:bg-primary-700 text-white py-3 text-base font-medium mt-2'
                  size='lg'
                  as={Link}
                  to='/checkout'>
                  Proceed to Checkout
                  <ArrowRight className='ml-2 h-5 w-5' />
                </Button>

                <div className='text-center'>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    or{' '}
                    <Link
                      to='/shop'
                      className='text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium'>
                      Continue Shopping
                    </Link>
                  </p>
                </div>

                {/* Payment Methods */}
                <div className='pt-4 border-t border-gray-100 dark:border-gray-700 mt-4'>
                  <p className='text-xs text-gray-500 dark:text-gray-400 text-center mb-3'>
                    We accept
                  </p>
                  <div className='flex justify-center items-center gap-4 flex-wrap'>
                    {[
                      {
                        id: 'visa',
                        name: 'Visa',
                        icon: '/src/assets/images/visa-logo.svg',
                      },
                      {
                        id: 'mastercard',
                        name: 'Mastercard',
                        icon: '/src/assets/images/mastercard-logo.svg',
                      },
                      {
                        id: 'mpesa',
                        name: 'M-Pesa',
                        icon: '/src/assets/images/mpesa-logo.svg',
                      },
                      {
                        id: 'paypal',
                        name: 'PayPal',
                        icon: '/src/assets/images/paypal-logo.svg',
                      },
                    ].map((method) => (
                      <div
                        key={method.id}
                        className='h-8 w-12 bg-white dark:bg-gray-800 rounded flex items-center justify-center p-1 border border-gray-200 dark:border-gray-700'
                        title={method.name}>
                        <img
                          src={method.icon}
                          alt={method.name}
                          className='h-full w-auto object-contain'
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-payment.svg';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Security Badges */}
            <div className='bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-t border-gray-100 dark:border-gray-700'>
              <div className='flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left'>
                <div className='flex items-center text-green-600 dark:text-green-400'>
                  <Shield className='h-5 w-5 mr-1.5' />
                  <span className='text-xs font-medium'>Secure Checkout</span>
                </div>
                <div className='hidden sm:block h-4 w-px bg-gray-200 dark:bg-gray-600' />
                <div className='flex items-center text-blue-600 dark:text-blue-400'>
                  <RefreshCw className='h-4 w-4 mr-1.5' />
                  <span className='text-xs'>Easy Returns</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className='mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4'>
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
              {[
                {
                  icon: <Truck className='h-5 w-5 text-green-500' />,
                  title: 'Free Shipping',
                  desc: 'On orders over $100',
                },
                {
                  icon: <Shield className='h-5 w-5 text-blue-500' />,
                  title: 'Secure Payment',
                  desc: '100% secure payment',
                },
                {
                  icon: <RefreshCw className='h-5 w-5 text-purple-500' />,
                  title: 'Easy Returns',
                  desc: '30-day return policy',
                },
                {
                  icon: <Package className='h-5 w-5 text-amber-500' />,
                  title: 'Fast Delivery',
                  desc: '3-5 business days',
                },
                {
                  icon: <Shield className='h-5 w-5 text-rose-500' />,
                  title: '1-Year Warranty',
                  desc: 'On all products',
                },
                {
                  icon: <Headphones className='h-5 w-5 text-indigo-500' />,
                  title: '24/7 Support',
                  desc: 'Dedicated support',
                },
              ].map((item, index) => (
                <div key={index} className='text-center p-2'>
                  <div className='h-10 w-10 mx-auto bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-2'>
                    {item.icon}
                  </div>
                  <h4 className='text-xs font-medium text-gray-900 dark:text-white'>
                    {item.title}
                  </h4>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
