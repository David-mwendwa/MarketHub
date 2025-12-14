import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import WishlistButton from '../../components/common/WishlistButton';
import ProductCard from '../../components/products/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [successState, setSuccessState] = useState({
    show: false,
    message: '',
  });

  // Enhanced mock product data
  const product = {
    id,
    name: `Premium Wireless Headphones ${id}`,
    brand: 'AudioPro',
    price: 249.99,
    originalPrice: 299.99,
    rating: 4.7,
    reviewCount: 215,
    inStock: true,
    sku: 'AUDIO-2023-001',
    category: 'Electronics',
    tags: ['wireless', 'bluetooth', 'noise-cancelling', 'over-ear'],
    description:
      'Experience crystal-clear sound with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and plush ear cushions for all-day comfort.',
    features: [
      'Active Noise Cancellation (ANC) technology',
      '30-hour battery life with quick charge (5 min = 4 hours)',
      'Bluetooth 5.0 with multipoint connectivity',
      'Built-in microphone with voice assistant support',
      'Foldable design with travel case included',
    ],
    specifications: {
      Model: 'AudioPro X500',
      Connectivity: 'Bluetooth 5.0, 3.5mm audio jack',
      'Battery Life': 'Up to 30 hours (ANC on), 40 hours (ANC off)',
      'Charging Time': '2.5 hours (full charge)',
      Weight: '255g',
      Warranty: '2 years manufacturer warranty',
    },
    details: [
      'High-quality materials',
      'Eco-friendly production',
      '2-year warranty',
      'Free returns within 30 days',
      'Free shipping on all orders',
      '24/7 customer support',
    ],
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572639512301-17080122e2a6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    ],
    colors: [
      { name: 'Black', class: 'bg-gray-900', selectedClass: 'ring-gray-900' },
      { name: 'Silver', class: 'bg-gray-300', selectedClass: 'ring-gray-400' },
      { name: 'Blue', class: 'bg-blue-600', selectedClass: 'ring-blue-700' },
    ],
    sizes: [{ name: 'One Size', inStock: true }],
    reviews: {
      average: 4.7,
      totalCount: 215,
      featured: [
        {
          id: 1,
          title: 'Amazing sound quality!',
          rating: 5,
          content:
            'The sound quality is absolutely incredible. The noise cancellation works like a charm in noisy environments.',
          author: 'Alex Johnson',
          date: '2023-05-15',
        },
        {
          id: 2,
          title: 'Very comfortable',
          rating: 4,
          content:
            'Great headphones overall. The ear cushions are super comfortable even after long hours of use.',
          author: 'Sam Wilson',
          date: '2023-06-22',
        },
      ],
    },
    relatedProducts: [
      {
        id: '2',
        name: 'Wireless Earbuds Pro',
        price: 179.99,
        originalPrice: 219.99,
        rating: 4.5,
        reviewCount: 128,
        image:
          'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        category: 'Electronics',
        isNew: true,
        isOnSale: true,
      },
      {
        id: '3',
        name: 'Bluetooth Speaker',
        price: 129.99,
        originalPrice: 159.99,
        rating: 4.2,
        reviewCount: 89,
        image:
          'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        category: 'Audio',
        isNew: false,
        isOnSale: true,
      },
      {
        id: '4',
        name: 'Noise Cancelling Headphones',
        price: 199.99,
        originalPrice: 249.99,
        rating: 4.8,
        reviewCount: 215,
        image:
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        category: 'Headphones',
        isNew: true,
        isOnSale: true,
      },
    ],
  };

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
  const handleWishlistUpdate = (isAdded, productName) => {
    setSuccessState({
      show: true,
      message: isAdded
        ? `Added ${productName} to your wishlist!`
        : `Removed ${productName} from your wishlist!`,
    });
    setTimeout(() => setSuccessState({ show: false, message: '' }), 2000);
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
    // If qty is an event object (from direct click), use the current quantity
    if (qty && typeof qty === 'object' && qty.nativeEvent) {
      qty = quantity;
    } else {
      // Ensure qty is a number, default to 1 if not
      qty = typeof qty === 'number' ? qty : 1;
    }

    // Check if product is valid
    if (!product || typeof product !== 'object') {
      return;
    }

    // Safely access product properties with fallbacks
    const productName = product.name || 'Product';
    const productId = product.id || '';
    const productPrice = product.price || 0;
    const productImage =
      Array.isArray(product.images) && product.images.length > 0
        ? product.images[0]
        : '';

    const cartItem = {
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage,
      quantity: qty,
    };

    // Add to cart
    try {
      addToCart(cartItem);

      // Create success message with the product name
      const itemText = qty > 1 ? 'items' : 'item';
      const successMessage = `Added ${qty} ${itemText} of ${productName} to the cart`;

      setSuccessState({
        show: true,
        message: successMessage,
      });

      setTimeout(() => setSuccessState({ show: false, message: '' }), 2000);
    } catch (error) {
      // Silent error handling
    }
  };

  // Handle quantity change
  const updateQuantity = (newQuantity) => {
    const validQuantity = Math.max(1, newQuantity);
    setQuantity(validQuantity);
    handleAddToCart(validQuantity);
  };

  // Format price with currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
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
        as={Link}
        to='/shop'
        variant='ghost'
        startIcon={<ArrowLeft className='h-4 w-4' />}
        className='mb-6'>
        Back to shop
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
                src={product.images[selectedImage]}
                alt={product.name}
                className={`w-full h-full object-contain transition-transform duration-300 ${
                  isZoomed ? 'scale-150' : 'scale-100'
                }`}
                style={{
                  transformOrigin: isZoomed
                    ? `${zoomPosition.x}% ${zoomPosition.y}%`
                    : 'center',
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
                onWishlistUpdate={handleWishlistUpdate}
              />
            </div>
          </div>

          {/* Image gallery */}
          <div className='grid grid-cols-4 gap-3'>
            {product.images.map((image, index) => (
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
                    src={image}
                    alt={`${product.name} - ${index + 1}`}
                    className='w-full h-full object-cover'
                  />
                </div>
                <div
                  className={`absolute inset-0 bg-black/10 transition-opacity ${
                    selectedImage === index
                      ? 'opacity-0'
                      : 'group-hover:opacity-30'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className='pt-2'>
          {/* Brand and SKU */}
          <div className='flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3'>
            <span>Brand: {product.brand}</span>
            <span className='h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600'></span>
            <span>SKU: {product.sku}</span>
            <span className='h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600'></span>
            <span className='text-green-600 dark:text-green-400 font-medium'>
              In Stock
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
                {product.rating.toFixed(1)}
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

          {/* Description */}
          <div className='prose dark:prose-invert max-w-none mb-8'>
            <p className='text-gray-700 dark:text-gray-300'>
              {product.description}
            </p>
          </div>

          {/* Color selection */}
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
                    color.selectedClass
                  }`}
                  title={color.name}>
                  <span className='sr-only'>{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and add to cart */}
          <div className='space-y-4 mb-8'>
            <div>
              <h3 className='text-sm font-medium text-gray-900 dark:text-white mb-2'>
                Quantity
              </h3>
              <div className='flex items-center space-x-4'>
                <div className='flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden'>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      updateQuantity(quantity - 1);
                    }}
                    className='px-3 py-2 text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors'>
                    <Minus className='h-4 w-4' />
                  </button>
                  <span className='w-12 text-center border-x border-gray-300 dark:border-gray-600 py-2'>
                    {quantity}
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      updateQuantity(quantity + 1);
                    }}
                    className='px-3 py-2 text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors'>
                    <Plus className='h-4 w-4' />
                  </button>
                </div>
                <span className='text-sm text-gray-500 dark:text-gray-400'>
                  {product.inStock ? 'In stock' : 'Out of stock'}
                </span>
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-3'>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart(quantity);
                }}
                className='flex-1 h-12 text-base font-medium'
                disabled={!product.inStock}>
                <ShoppingCart className='h-5 w-5 mr-2' />
                Add to Cart
              </Button>

              <div className='flex items-center gap-2'>
                <div className='relative h-12 w-12'>
                  <WishlistButton
                    product={product}
                    className='h-full w-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center justify-center'
                    onWishlistUpdate={handleWishlistUpdate}
                  />
                </div>

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
                  {product.specifications.Warranty || '1-Year Warranty'}
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  We offer a {product.specifications.Warranty || '1-year'}{' '}
                  warranty on all our products.
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
          {/* Description Tab */}
          {activeTab === 'description' && (
            <div className='prose dark:prose-invert max-w-none'>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
                Product Details
              </h3>
              <p className='text-gray-700 dark:text-gray-300 mb-6'>
                {product.description}
              </p>

              <h4 className='text-lg font-medium text-gray-900 dark:text-white mb-3'>
                Features
              </h4>
              <ul className='space-y-2 mb-6'>
                {product.features.map((feature, index) => (
                  <li key={index} className='flex items-start'>
                    <Check className='h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                    <span className='text-gray-700 dark:text-gray-300'>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div className='bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg'>
                <h4 className='text-lg font-medium text-gray-900 dark:text-white mb-3'>
                  What's in the box?
                </h4>
                <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                  <li className='flex items-center'>
                    <Check className='h-4 w-4 text-green-500 mr-2' />
                    <span className='text-gray-700 dark:text-gray-300'>
                      {product.name}
                    </span>
                  </li>
                  <li className='flex items-center'>
                    <Check className='h-4 w-4 text-green-500 mr-2' />
                    <span className='text-gray-700 dark:text-gray-300'>
                      USB-C Charging Cable
                    </span>
                  </li>
                  <li className='flex items-center'>
                    <Check className='h-4 w-4 text-green-500 mr-2' />
                    <span className='text-gray-700 dark:text-gray-300'>
                      Travel Case
                    </span>
                  </li>
                  <li className='flex items-center'>
                    <Check className='h-4 w-4 text-green-500 mr-2' />
                    <span className='text-gray-700 dark:text-gray-300'>
                      User Manual
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Specifications Tab */}
          {activeTab === 'specifications' && (
            <div className='space-y-6'>
              <div>
                <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
                  Specifications
                </h3>
                <div className='bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg'>
                  <div className='border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-0'>
                    <dl className='sm:divide-y sm:divide-gray-200 dark:divide-gray-700'>
                      {product.specifications ? (
                        Object.entries(product.specifications).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                              <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                                {key}
                              </dt>
                              <dd className='mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2'>
                                {value}
                              </dd>
                            </div>
                          )
                        )
                      ) : (
                        <div className='py-4 text-center text-gray-500 dark:text-gray-400'>
                          No specifications available for this product.
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              </div>

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
              <div className='md:flex md:items-center md:justify-between'>
                <div>
                  <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
                    Customer Reviews
                  </h3>
                  <div className='flex items-center mt-1'>
                    {renderRating(product.rating)}
                    <p className='ml-2 text-sm text-gray-500 dark:text-gray-400'>
                      Based on {product.reviewCount} reviews
                    </p>
                  </div>
                </div>
                <Button
                  variant='outline'
                  className='mt-4 md:mt-0'
                  onClick={() =>
                    document
                      .getElementById('review-form')
                      .scrollIntoView({ behavior: 'smooth' })
                  }>
                  Write a review
                </Button>
              </div>

              <div className='space-y-8'>
                {product.reviews.featured.map((review) => (
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
                ))}
              </div>

              <div id='review-form' className='pt-8'>
                <h4 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
                  Write a review
                </h4>
                <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'>
                  <form className='space-y-6'>
                    <div>
                      <label
                        htmlFor='rating'
                        className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                        Your rating
                      </label>
                      <div className='flex items-center space-x-1'>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-6 w-6 cursor-pointer ${
                              star <= 5
                                ? 'text-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                            fill={star <= 5 ? 'currentColor' : 'none'}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor='title'
                        className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                        Review title
                      </label>
                      <input
                        type='text'
                        id='title'
                        className='w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500'
                        placeholder='Summarize your review in a few words'
                      />
                    </div>

                    <div>
                      <label
                        htmlFor='review'
                        className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                        Your review
                      </label>
                      <textarea
                        id='review'
                        rows={4}
                        className='w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500'
                        placeholder='Share your experience with this product'
                        defaultValue={''}
                      />
                    </div>

                    <div className='flex items-center justify-end'>
                      <Button type='submit'>Submit review</Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
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
          {product.relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
