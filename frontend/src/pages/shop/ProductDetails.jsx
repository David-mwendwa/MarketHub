import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Star,
  Heart,
  Share2,
  Truck,
  Shield,
  ArrowLeft,
  Minus,
  Plus,
  Check,
  ShoppingCart,
  Tag,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  CreditCard,
  Info,
  Loader2,
  AlertCircle,
} from 'lucide-react';

import WishlistButton from '../../components/common/WishlistButton';
import ProductCard from '../../components/products/ProductCard';
import { productsAPI } from '../../lib/api';
import { toast } from 'react-hot-toast';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    cartItems,
    addToCart,
    removeFromCart,
    isInCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [product, setProduct] = useState(null);
  const [successState, setSuccessState] = useState({
    show: false,
    message: '',
  });

  // Fetch product data
  const fetchProduct = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await productsAPI.getById(id);

      if (response?.product) {
        const completeProduct = {
          ...response.product,
          _id: response.product._id || id,
        };

        setProduct(completeProduct);

        // Safely process gallery items
        const items = Array.isArray(completeProduct.gallery)
          ? completeProduct.gallery
              .filter((item) => item)
              .map((item) => ({
                url:
                  item.url || item.full || item.thumbnail || '/placeholder.jpg',
                alt: completeProduct.name || 'Product image',
              }))
          : [];

        // Rest of your gallery items handling...
        if (items.length === 0 && completeProduct.thumbnail) {
          items.push({
            url: completeProduct.thumbnail,
            alt: completeProduct.name || 'Product thumbnail',
          });
        }

        if (items.length === 0) {
          items.push({
            url: '/placeholder.jpg',
            alt: 'Product image not available',
          });
        }

        setGalleryItems(items);
        setError(null);
      } else {
        throw new Error('Product not found');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product. Please try again later.');
      toast.error('Failed to load product details');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  // Call fetchProduct when component mounts or id changes
  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id, fetchProduct]);

  useEffect(() => {
    if (product) {
      console.log('Product data:', product);
      console.log('Gallery items:', galleryItems);
    }
  }, [product, galleryItems]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
        <span className='ml-2'>Loading product details...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen p-4 text-center'>
        <AlertCircle className='w-12 h-12 text-red-500 mb-4' />
        <h2 className='text-xl font-semibold mb-2'>Product Not Found</h2>
        <p className='text-gray-600 dark:text-gray-300 mb-6'>
          {error ||
            'The product you are looking for does not exist or has been removed.'}
        </p>
        <Button onClick={() => navigate('/shop')}>
          <ArrowLeft className='w-4 h-4 mr-2' />
          Back to Shop
        </Button>
      </div>
    );
  }

  // Handle image zoom functionality
  const handleImageMouseMove = (e) => {
    if (!isZoomed) return;

    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  // Handle wishlist success message
  const handleWishlistUpdate = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (!product || !product._id) {
      console.error('Product or product ID is missing');
      return;
    }

    try {
      if (isInWishlist(product._id)) {
        removeFromWishlist(product._id);
        toast.success(`Removed ${product.name} from your wishlist!`, {
          position: 'bottom-right',
        });
      } else {
        addToWishlist({
          _id: product._id,
          name: product.name,
          price: parseFloat(product.price) || 0,
          image:
            product.thumbnail ||
            (Array.isArray(product.gallery) && product.gallery[0]?.thumbnail) ||
            '/placeholder-product.jpg',
          sku: product.sku,
          stock: product.stock?.qty || 0,
          // Include any other necessary product fields
          ...product,
        });
        toast.success(`Added ${product.name} to your wishlist!`, {
          position: 'bottom-right',
        });
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist. Please try again.', {
        position: 'bottom-right',
      });
    }
  };

  // Share product
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on our store!`,
          url: window.location.href,
        });
      } else {
        setShowShareOptions(!showShareOptions);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Copy link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareOptions(false);
    setSuccessState({
      show: true,
      message: 'Link copied to clipboard!',
    });
    setTimeout(() => setSuccessState({ show: false, message: '' }), 2000);
  };

  // Handle adding product to cart with animation
  const handleAddToCart = (qty) => {
    try {
      if (!product) {
        toast.error('Product not available');
        return;
      }

      const finalQuantity = qty?.nativeEvent
        ? 1
        : Math.max(1, Number(qty) || 1);

      // Check if item is already in cart
      const existingCartItem = cartItems?.find(
        (item) => item._id === product._id
      );

      if (existingCartItem) {
        toast.info('Item is already in your cart', {
          position: 'bottom-right',
        });
        return;
      }

      // Add new item with quantity 1
      addToCart({
        _id: product._id,
        name: product.name,
        price: parseFloat(product.price) || 0,
        quantity: 1, // Always add 1 initially
        image:
          product.thumbnail ||
          (Array.isArray(product.gallery) && product.gallery[0]?.thumbnail) ||
          '/placeholder-product.jpg',
        sku: product.sku,
        stock: product.stock?.qty || 0,
      });

      toast.success(`${product.name} added to cart`, {
        position: 'bottom-right',
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  // Format price with KSh
  const formatPrice = (price) => {
    return `KSh ${Number(price).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  // Render star rating
  const renderRating = (rating) => {
    return (
      <div className='flex items-center'>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= Math.floor(rating)
                ? 'text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
            fill={star <= rating ? 'currentColor' : 'none'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className='container mx-auto px-4 py-8 sm:py-12'>
      {/* Back button */}
      <Button
        variant='ghost'
        onClick={() => navigate(-1)}
        startIcon={<ArrowLeft className='h-4 w-4' />}
        className='mb-6'>
        Back
      </Button>

      {/* Success notification */}
      <AnimatePresence>
        {successState.show && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className='fixed bottom-4 right-4 z-[100] bg-green-500 text-white px-4 py-3 rounded-md shadow-lg flex items-center space-x-2 max-w-md'>
            <Check className='h-5 w-5 flex-shrink-0' />
            <span>{successState.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'>
        {/* Product Images */}
        <div className='space-y-4'>
          <div
            className='relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700'
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleImageMouseMove}>
            <div className='aspect-w-1 aspect-h-1 w-full'>
              <img
                src={
                  product.gallery?.[selectedImage]?.url ||
                  product.gallery?.[selectedImage]?.full ||
                  product.gallery?.[selectedImage]?.thumbnail ||
                  product.thumbnail ||
                  '/placeholder.jpg'
                }
                alt={product.name}
                className={`w-full h-full object-contain transition-transform duration-300 ${
                  isZoomed ? 'scale-150' : 'scale-100'
                }`}
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  e.target.src = '/placeholder.jpg';
                }}
              />
            </div>

            {/* Sale badge */}
            <div className='absolute top-4 right-4 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full'>
              SALE
            </div>

            {/* Wishlist button */}
            <div className='absolute top-4 left-4'>
              <WishlistButton
                product={product}
                className='bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700/90'
                isActive={isInWishlist(product?._id || '')}
                onWishlistUpdate={handleWishlistUpdate}
              />
            </div>
          </div>

          {/* Image gallery */}
          {!isLoading && galleryItems.length > 0 && (
            <div className='grid grid-cols-4 gap-3'>
              {galleryItems.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-primary-500 ring-2 ring-primary-500/30'
                      : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                  }`}>
                  <div className='aspect-w-1 aspect-h-1 w-full'>
                    <img
                      src={image.url}
                      alt={image.alt}
                      className='w-full h-full object-cover'
                      onError={(e) => {
                        e.target.src = '/placeholder.jpg';
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className='pt-2'>
          {/* Brand and SKU */}
          <div className='flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3'>
            <span>Brand: {product.brand}</span>
            <span className='h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600'></span>
            <span>SKU: {product.sku}</span>
            <span className='h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600'></span>
            <span
              className={
                product.stock?.qty > 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }>
              {product.stock?.qty > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Product title */}
          <h1 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3'>
            {product.name}
          </h1>

          {/* Rating and reviews */}
          <div className='flex flex-wrap items-center gap-3 mb-4'>
            <div className='flex items-center bg-primary-50 dark:bg-primary-900/30 px-2.5 py-1 rounded-full'>
              {renderRating(product.rating)}
              <span className='ml-1.5 text-sm font-medium text-primary-700 dark:text-primary-300'>
                {product.rating.average?.toFixed(1) || '0.0'}
              </span>
            </div>
            <a
              href='#reviews'
              className='text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors'>
              {product.reviewCount} reviews
            </a>
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              | {product.soldCount || '500+'} sold
            </span>
          </div>

          {/* Price */}
          <div className='flex flex-wrap items-baseline gap-3 mb-6'>
            <span className='text-3xl font-bold text-gray-900 dark:text-white'>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className='text-lg text-gray-500 dark:text-gray-400 line-through'>
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.originalPrice > product.price && (
              <span className='ml-2 px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full'>
                Save{' '}
                {Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            )}
          </div>

          {/* Color selection */}
          {product.colors && product.colors.length > 0 && (
            <div className='mb-6'>
              <h3 className='text-sm font-medium text-gray-900 dark:text-white mb-2'>
                Color
              </h3>
              <div className='flex flex-wrap gap-2'>
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    type='button'
                    className={`w-10 h-10 rounded-full flex items-center justify-center ring-2 ring-offset-2 ${
                      color.selectedClass || ''
                    }`}
                    title={color.name}>
                    <span className='sr-only'>{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and add to cart */}
          <div className='space-y-4 mb-8'>
            <div>
              <h3 className='text-sm font-medium text-gray-900 dark:text-white mb-2'>
                Quantity
              </h3>
              <div className='flex items-center space-x-4'>
                <div className='flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden'>
                  <button
                    onClick={() => decreaseQuantity(product._id)}
                    disabled={!product || !isInCart(product._id)}
                    className='px-3 py-2 text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                    <Minus className='h-4 w-4' />
                  </button>
                  <span className='w-12 text-center border-x border-gray-300 dark:border-gray-600 py-2'>
                    {cartItems?.find((item) => item._id === product?._id)
                      ?.quantity || 1}
                  </span>
                  <button
                    onClick={() => increaseQuantity(product._id)}
                    disabled={
                      !product ||
                      !isInCart(product._id) ||
                      (cartItems?.find((item) => item._id === product._id)
                        ?.quantity || 0) >= (product?.stock?.qty || 1)
                    }
                    className='px-3 py-2 text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                    <Plus className='h-4 w-4' />
                  </button>
                </div>
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-3'>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart(1); // Always add 1 at a time
                }}
                className='flex-1 h-12 text-base font-medium'
                disabled={
                  !product?.stock?.qty > 0 ||
                  cartItems?.some((item) => item._id === product?._id)
                }>
                <ShoppingCart className='h-5 w-5 mr-2' />
                {cartItems?.some((item) => item._id === product?._id)
                  ? 'In Cart'
                  : product?.stock?.qty > 0
                    ? 'Add to Cart'
                    : 'Out of Stock'}
              </Button>

              <div className='flex items-center gap-2'>
                <WishlistButton
                  product={product}
                  className='h-12 w-12 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center justify-center transition-colors rounded-md'
                  buttonClass='h-full w-full flex items-center justify-center p-0'
                  iconClass='h-5 w-5 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                  onWishlistUpdate={handleWishlistUpdate}
                />

                <div className='relative h-12 w-12'>
                  <Button
                    variant='outline'
                    size='icon'
                    className='h-full w-full p-0'
                    onClick={handleShare}
                    aria-label='Share product'>
                    <Share2 className='h-5 w-5' />
                  </Button>

                  {/* Share dropdown */}
                  <AnimatePresence>
                    {showShareOptions && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className='absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black/5 dark:ring-white/10 overflow-hidden z-10'>
                        <button
                          onClick={copyToClipboard}
                          className='w-full px-4 py-2.5 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'>
                          Copy link
                        </button>
                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='block px-4 py-2.5 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'>
                          Share on Facebook
                        </a>
                        <a
                          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Check out ${product.name}`)}`}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='block px-4 py-2.5 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'>
                          Share on Twitter
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Buy Now button */}
            {product.inStock && (
              <Button
                variant='secondary'
                className='w-full h-12 text-base font-medium'>
                Buy Now
              </Button>
            )}
          </div>

          {/* Product details */}
          <div className='space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6'>
            <div className='flex items-start'>
              <Truck className='h-6 w-6 text-primary-500 mr-3 mt-0.5 flex-shrink-0' />
              <div>
                <h3 className='font-medium text-gray-900 dark:text-white'>
                  Free & Fast Shipping
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Free standard shipping on all orders over $50. Express
                  delivery available.
                </p>
              </div>
            </div>

            <div className='flex items-start'>
              <ShieldCheck className='h-6 w-6 text-primary-500 mr-3 mt-0.5 flex-shrink-0' />
              <div>
                <h3 className='font-medium text-gray-900 dark:text-white'>
                  {product.warranty || '1-Year Warranty'}
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  {product.warranty
                    ? `This product comes with a ${product.warranty}`
                    : 'We offer a 1-year warranty on all our products.'}
                </p>
              </div>
            </div>

            <div className='flex items-start'>
              <CreditCard className='h-6 w-6 text-primary-500 mr-3 mt-0.5 flex-shrink-0' />
              <div>
                <h3 className='font-medium text-gray-900 dark:text-white'>
                  Secure Payment
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Pay with confidence using our secure payment methods.
                </p>
              </div>
            </div>

            <div className='flex items-start'>
              <MessageSquare className='h-6 w-6 text-primary-500 mr-3 mt-0.5 flex-shrink-0' />
              <div>
                <h3 className='font-medium text-gray-900 dark:text-white'>
                  24/7 Support
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Our customer support team is available around the clock to
                  assist you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className='mt-16 max-w-4xl mx-auto'>
        <div className='border-b border-gray-200 dark:border-gray-700'>
          <nav className='-mb-px flex space-x-8 overflow-x-auto pb-px'>
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                }`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'reviews' && (
                  <span className='ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full'>
                    {product.reviewCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className='py-8'>
          {/* Description Tab i.e http://localhost:5173/product/693ef6ef3123f379d3b7db72 */}
          {activeTab === 'description' && (
            <div className='space-y-6'>
              <div className='bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg'>
                <div className='px-4 py-5 sm:px-6'>
                  <h3 className='text-lg font-medium leading-6 text-gray-900 dark:text-white'>
                    Product Description
                  </h3>
                </div>
                <div className='border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6'>
                  {product.description ? (
                    <div
                      className='prose prose-sm max-w-none text-gray-700 dark:text-gray-300'
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  ) : (
                    <p className='text-gray-500 dark:text-gray-400 italic'>
                      No description available for this product.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Specifications Tab */}
          {activeTab === 'specifications' && (
            <div className='space-y-6'>
              {/* Short Description Section */}
              <div className='bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg'>
                <div className='px-4 py-5 sm:px-6'>
                  <h3 className='text-lg font-medium leading-6 text-gray-900 dark:text-white'>
                    Product Overview
                  </h3>
                </div>
                <div className='border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6'>
                  {product.shortDescription ? (
                    <div
                      className='prose prose-sm max-w-none text-gray-700 dark:text-gray-300'
                      dangerouslySetInnerHTML={{
                        __html: product.shortDescription,
                      }}
                    />
                  ) : (
                    <p className='text-gray-500 dark:text-gray-400 italic'>
                      No description available for this product.
                    </p>
                  )}
                </div>
              </div>

              {/* Specifications Section */}

              <div className='bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-600 p-4 rounded-r'>
                <div className='flex'>
                  <div className='flex-shrink-0'>
                    <Info
                      className='h-5 w-5 text-blue-400'
                      aria-hidden='true'
                    />
                  </div>
                  <div className='ml-3'>
                    <p className='text-sm text-blue-700 dark:text-blue-300'>
                      Need more detailed specifications? Our support team is
                      happy to help with any questions you may have.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className='space-y-8'>
              <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-8'>
                <div>
                  <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-1'>
                    Customer Reviews
                  </h3>
                  <div className='flex items-center'>
                    {renderRating(product.rating?.average || 0)}
                    <span className='ml-2 text-sm text-gray-600 dark:text-gray-300'>
                      ({product.reviewCount || 0} reviews)
                    </span>
                  </div>
                </div>
                <Button
                  variant='outline'
                  className='mt-4 md:mt-0'
                  onClick={() =>
                    document
                      .getElementById('review-form')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }>
                  Write a review
                </Button>
              </div>
              <div className='space-y-8'>
                {product.reviews?.featured?.length > 0 ? (
                  product.reviews.featured.map((review) => (
                    <div
                      key={review.id}
                      className='border-b border-gray-200 dark:border-gray-700 pb-8'>
                      <div className='flex items-center mb-2'>
                        <div className='flex items-center'>
                          {renderRating(review.rating)}
                        </div>
                        <span className='ml-2 text-sm font-medium text-gray-900 dark:text-white'>
                          {review.title}
                        </span>
                      </div>
                      <p className='text-sm text-gray-600 dark:text-gray-300 mb-2'>
                        {review.content}
                      </p>
                      <div className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
                        <span>{review.author}</span>
                        <span className='mx-2'>•</span>
                        <time dateTime={review.date}>
                          {new Date(review.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='text-center py-12'>
                    <MessageSquare className='h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4' />
                    <h4 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                      No reviews yet
                    </h4>
                    <p className='text-gray-500 dark:text-gray-400 mb-6'>
                      Be the first to review this product!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {product.relatedProducts?.length > 0 && (
        <section className='mt-16'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
              You may also like
            </h2>
            <Button variant='outline' size='sm' as={Link} to='/shop'>
              View all
            </Button>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {product.relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
