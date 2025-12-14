import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import {
  ShoppingBag,
  Star,
  Truck,
  Shield as ShieldCheck,
  RefreshCw,
  Clock,
  Zap,
  ArrowRight,
  Check,
  ChevronRight,
  ChevronLeft,
  Heart,
  ShoppingCart,
  Menu,
  X,
  Search,
  User,
  CreditCard,
  Package,
  Headset,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  Trash2,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Github,
  Mail,
  Phone,
  MapPin,
  Clock as ClockIcon,
  Calendar,
  Tag,
  Percent,
  Gift,
  Award,
  Smartphone,
  Shirt,
  Home as HomeIcon,
  Dumbbell,
  BookOpen,
  Eye,
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import ProductCard from '../../components/products/ProductCard';
import CategoryCard from '../../components/categories/CategoryCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState(10); // add state for countdown
  const { addToCart } = useCart();

  const testimonials = [
    {
      id: 1,
      name: 'James M.',
      location: 'Nairobi, Kenya',
      rating: 5,
      comment:
        "The quality of these East African crafts is exceptional! My kikoyi blanket is the softest I've ever owned. Delivery was faster than expected!",
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      product: 'Kikoyi Blanket',
    },
    {
      id: 2,
      name: 'Neema J.',
      location: 'Arusha, Tanzania',
      rating: 5,
      comment:
        'Nimefurahi sana na bidhaa zilizoniletewa! Vipodozi vya asili vya mafuta ya mawese yanashangaza. Nimepata huduma bora na mimi nitarudi tena.',
      translation:
        'I am very happy with the products I received! The natural shea butter cosmetics are amazing. I received excellent service and I will return again.',
      image:
        'https://images.unsplash.com/photo-1551836022-d5d9e8461649?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=772&q=80',
      product: 'Shea Butter',
    },
    {
      id: 3,
      name: 'Thomas K.',
      location: 'Kampala, Uganda',
      rating: 5,
      comment:
        "The coffee from the slopes of Mount Elgon is absolutely divine. As a coffee connoisseur, I can confidently say this is some of the best I've tasted. The packaging was also very secure.",
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      product: 'Arabica Coffee',
    },
  ];

  const categories = [
    {
      name: 'Electronics',
      icon: <Smartphone className='w-6 h-6' />,
      count: 24,
      link: '/category/electronics',
      image:
        'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
      bgColor: 'bg-blue-50 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-100 dark:border-blue-800/50',
    },
    {
      name: 'Fashion',
      icon: <Shirt className='w-6 h-6' />,
      count: 42,
      link: '/category/fashion',
      image:
        'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?q=80&w=2070&auto=format&fit=crop',
      bgColor: 'bg-pink-50 dark:bg-pink-900/30',
      textColor: 'text-pink-600 dark:text-pink-400',
      borderColor: 'border-pink-100 dark:border-pink-800/50',
    },
    {
      name: 'Home & Living',
      icon: <Home className='w-6 h-6' />,
      count: 18,
      link: '/category/home-living',
      image:
        'https://images.unsplash.com/photo-1616486338815-3d98d60c8af5?q=80&w=2070&auto=format&fit=crop',
      bgColor: 'bg-amber-50 dark:bg-amber-900/30',
      textColor: 'text-amber-600 dark:text-amber-400',
      borderColor: 'border-amber-100 dark:border-amber-800/50',
    },
    {
      name: 'Beauty',
      icon: <Heart className='w-6 h-6' />,
      count: 15,
      link: '/category/beauty',
      image:
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop',
      bgColor: 'bg-purple-50 dark:bg-purple-900/30',
      textColor: 'text-purple-600 dark:text-purple-400',
      borderColor: 'border-purple-100 dark:border-purple-800/50',
    },
    {
      name: 'Sports',
      icon: <Dumbbell className='w-6 h-6' />,
      count: 22,
      link: '/category/sports',
      image:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop',
      bgColor: 'bg-green-50 dark:bg-green-900/30',
      textColor: 'text-green-600 dark:text-green-400',
      borderColor: 'border-green-100 dark:border-green-800/50',
    },
    {
      name: 'Books',
      icon: <BookOpen className='w-6 h-6' />,
      count: 36,
      link: '/category/books',
      image:
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/30',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      borderColor: 'border-indigo-100 dark:border-indigo-800/50',
    },
  ];

  useEffect(() => {
    // Simulate API call to get featured products
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const products = [
          {
            id: 1,
            name: 'Wireless Headphones',
            price: 8999,
            originalPrice: 12999,
            image:
              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
            rating: 4.8,
            reviewCount: 124,
            category: 'Electronics',
            colors: ['Black', 'White', 'Blue'],
            inStock: true,
            isNew: true,
            isOnSale: true,
          },
          {
            id: 2,
            name: 'Smart Watch Pro',
            price: 24999,
            originalPrice: 29999,
            image:
              'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
            rating: 4.6,
            reviewCount: 89,
            category: 'Electronics',
            colors: ['Black', 'Silver', 'Gold'],
            inStock: true,
            isNew: true,
            isOnSale: false,
          },
          {
            id: 3,
            name: 'Running Shoes',
            price: 7499,
            originalPrice: 9999,
            image:
              'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
            rating: 4.9,
            reviewCount: 215,
            category: 'Fashion',
            colors: ['Red', 'Black', 'White'],
            inStock: true,
            isNew: false,
            isOnSale: true,
          },
          {
            id: 4,
            name: 'Wireless Earbuds',
            price: 12999,
            originalPrice: 15999,
            image:
              'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&auto=format&fit=crop&q=80',
            rating: 4.7,
            reviewCount: 178,
            category: 'Electronics',
            colors: ['White', 'Black', 'Blue'],
            inStock: true,
            isNew: true,
            isOnSale: true,
          },
          {
            id: 5,
            name: 'Leather Wallet',
            price: 3499,
            originalPrice: 4999,
            image:
              'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
            rating: 4.5,
            reviewCount: 92,
            category: 'Fashion',
            colors: ['Brown', 'Black'],
            inStock: true,
            isNew: false,
            isOnSale: true,
          },
          {
            id: 6,
            name: 'Smartphone Stand',
            price: 1999,
            originalPrice: 2999,
            image:
              'https://images.unsplash.com/photo-1601784551446-3b745855697c?w=800&auto=format&fit=crop&q=80',
            rating: 4.3,
            reviewCount: 64,
            category: 'Accessories',
            colors: ['Black', 'Silver'],
            inStock: true,
            isNew: true,
            isOnSale: false,
          },
        ];

        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart({ ...product, quantity: 1 });
    // You might want to add a toast notification here
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star key={i} className='w-4 h-4 text-yellow-400 fill-current' />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <StarHalf key={i} className='w-4 h-4 text-yellow-400 fill-current' />
        );
      } else {
        stars.push(
          <Star key={i} className='w-4 h-4 text-gray-300 fill-current' />
        );
      }
    }

    return stars;
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Hero Section */}
      <div className='relative bg-gray-900 text-white overflow-hidden'>
        {/* Background image with promo-matching overlay */}
        <div className='absolute inset-0'>
          <div className='absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700'>
            <img
              src='https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop'
              alt=''
              className='w-full h-full object-cover mix-blend-overlay opacity-60'
              loading='eager'
            />
          </div>
          <div className='absolute inset-0 bg-gradient-to-r from-primary-600/90 to-primary-700/90'></div>
          <div className='absolute inset-0 bg-gradient-to-b from-transparent to-primary-800/80'></div>
        </div>

        {/* Main content */}
        <div className='container mx-auto px-4 py-20 md:py-28 lg:py-32 relative z-10'>
          <div className='flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto'>
            {/* Text content */}
            <div className='text-center lg:text-left lg:w-1/2 space-y-6'>
              <div className='inline-flex items-center px-4 py-2.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-sm mb-6 group hover:bg-white/10 transition-colors duration-300'>
                <span className='text-yellow-300/90 mr-3 text-base transform group-hover:scale-110 transition-transform duration-300'>
                  ✨
                </span>
                <span className='text-sm font-medium tracking-wide text-gray-100'>
                  <span className='font-semibold text-yellow-300/90'>
                    KARIBU SANA!
                  </span>{' '}
                  Welcome to East Africa's Premier Marketplace
                </span>
              </div>

              <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold leading-tight'>
                Discover the{' '}
                <span className='bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent'>
                  Best of
                </span>{' '}
                East Africa
              </h1>

              <p className='text-xl text-gray-200 max-w-2xl mx-auto lg:mx-0'>
                Experience authentic products from local artisans and
                businesses. Fast, reliable delivery across Kenya, Tanzania,
                Uganda, and beyond.
              </p>

              <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2'>
                <Button
                  as={Link}
                  to='/shop'
                  size='lg'
                  className='bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold group transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg'>
                  Shop Now
                  <ShoppingBag className='ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform' />
                </Button>
                <Button
                  as={Link}
                  to='/categories'
                  variant='outline'
                  size='lg'
                  className='border-white/30 text-white hover:bg-white/10 hover:border-white/60 transition-all duration-300 group'>
                  Explore Deals
                  <ArrowRight className='ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform' />
                </Button>
              </div>

              <div className='pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-200'>
                <div className='flex items-center'>
                  <div className='flex -space-x-2 mr-2'>
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className='w-8 h-8 rounded-full bg-white/20 border-2 border-white/20 flex items-center justify-center'>
                        <User className='w-4 h-4' />
                      </div>
                    ))}
                  </div>
                  <span>10,000+ Happy Customers</span>
                </div>
                <div className='flex items-center'>
                  <div className='w-8 h-8 rounded-full bg-white/20 border-2 border-white/20 flex items-center justify-center mr-2'>
                    <Check className='w-4 h-4' />
                  </div>
                  <span>100% Secure Checkout</span>
                </div>
              </div>
            </div>

            {/* Hero image */}
            <div className='lg:w-1/2 relative'>
              <div className='relative z-10 group'>
                {/* Main image with 3D effect */}
                <div className='relative z-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] transform group-hover:-translate-y-1 transition-all duration-500'>
                  <div className='bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-white/10'>
                    <img
                      src='https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=2070&auto=format&fit=crop'
                      alt='Modern E-commerce Shopping'
                      className='w-full h-auto object-cover rounded-lg transform group-hover:scale-[1.02] transition-all duration-500'
                      loading='eager'
                    />
                  </div>
                </div>

                {/* Floating device mockup */}
                <div className='absolute -bottom-6 -right-6 z-10 w-32 h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl p-2 shadow-xl border border-white/10 transform rotate-6 group-hover:rotate-3 transition-all duration-500'>
                  <div className='w-full h-full bg-gray-900 rounded-lg overflow-hidden'>
                    <img
                      src='https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1933&auto=format&fit=crop'
                      alt='Mobile Shopping'
                      className='w-full h-full object-cover opacity-90'
                    />
                  </div>
                </div>

                {/* Decorative elements */}
                <div className='absolute -left-6 -bottom-6 w-32 h-32 bg-yellow-400/20 rounded-full filter blur-2xl -z-10 group-hover:scale-110 transition-transform duration-700'></div>
                <div className='absolute -right-10 -top-6 w-40 h-40 bg-blue-400/20 rounded-full filter blur-2xl -z-10 group-hover:scale-110 transition-transform duration-700 delay-100'></div>

                {/* Ultra attention-grabbing discount badge */}
                <div className='absolute -left-4 -top-4 z-30 animate-continuous-bounce'>
                  <div className='text-gray-900 font-bold px-5 py-3 rounded-xl transform transition-all duration-300'>
                    <div className='text-xs tracking-widest'>UP TO</div>
                    <div className='text-3xl font-extrabold tracking-tight'>
                      50% OFF
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className='absolute -right-2 top-1/4 w-6 h-6 bg-green-400/30 rounded-full filter blur-md animate-float'></div>
                <div className='absolute left-10 -bottom-4 w-4 h-4 bg-pink-400/30 rounded-full filter blur-md animate-float animation-delay-2000'></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Banner */}
      <div className='bg-white dark:bg-gray-800 shadow-sm'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200 dark:divide-gray-700'>
            {[
              {
                icon: <Truck className='h-6 w-6 text-blue-500' />,
                title: 'Free Delivery',
                description: 'On orders over KES 5,000',
                bgColor: 'bg-blue-50 dark:bg-blue-900/30',
                borderColor: 'border-blue-100 dark:border-blue-800/50',
              },
              {
                icon: <ShieldCheck className='h-6 w-6 text-green-500' />,
                title: 'Secure Checkout',
                description: '100% secure payment',
                bgColor: 'bg-green-50 dark:bg-green-900/30',
                borderColor: 'border-green-100 dark:border-green-800/50',
              },
              {
                icon: <RefreshCw className='h-6 w-6 text-purple-500' />,
                title: 'Easy Returns',
                description: '30-day return policy',
                bgColor: 'bg-purple-50 dark:bg-purple-900/30',
                borderColor: 'border-purple-100 dark:border-purple-800/50',
              },
              {
                icon: <Headset className='h-6 w-6 text-amber-500' />,
                title: '24/7 Support',
                description: 'Dedicated support',
                bgColor: 'bg-amber-50 dark:bg-amber-900/30',
                borderColor: 'border-amber-100 dark:border-amber-800/50',
              },
            ].map((feature, index) => (
              <div key={index} className='flex items-center p-4'>
                <div className='text-primary-600 dark:text-primary-400 mr-4'>
                  {feature.icon}
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900 dark:text-white'>
                    {feature.title}
                  </h3>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <section className='py-16 bg-gray-50 dark:bg-gray-900'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <span className='inline-block px-4 py-1.5 mb-4 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 rounded-full'>
              Categories
            </span>
            <h2 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
              Shop by Category
            </h2>
            <div className='w-20 h-1 bg-primary-600 mx-auto mb-6'></div>
            <p className='text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
              Discover our carefully curated selection of product categories
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[
              {
                id: 'electronics',
                name: 'Electronics',
                count: 24,
                image:
                  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
                icon: <Smartphone className='w-6 h-6' />,
                bg: 'bg-blue-50 dark:bg-blue-900/30',
              },
              {
                id: 'fashion',
                name: 'Fashion',
                count: 36,
                image:
                  'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?q=80&w=2070&auto=format&fit=crop',
                icon: <Shirt className='w-6 h-6' />,
                bg: 'bg-pink-50 dark:bg-pink-900/30',
              },
              {
                id: 'home-living',
                name: 'Home & Living',
                count: 42,
                image:
                  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop',
                icon: <HomeIcon className='w-6 h-6' />,
                bg: 'bg-amber-50 dark:bg-amber-900/30',
              },
              {
                id: 'beauty',
                name: 'Beauty & Care',
                count: 28,
                image:
                  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop',
                icon: <Heart className='w-6 h-6' />,
                bg: 'bg-purple-50 dark:bg-purple-900/30',
              },
            ].map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                variant='homepage'
              />
            ))}
          </div>

          <div className='text-center mt-12'>
            <Button
              as={Link}
              to='/categories'
              variant='outline'
              className='border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 px-8 py-3'>
              View All Categories
              <ArrowRight className='ml-2 h-5 w-5' />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className='py-16 bg-white dark:bg-gray-900'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <span className='inline-block px-4 py-1.5 mb-4 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 rounded-full'>
              Our Selection
            </span>
            <h2 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
              Featured Products
            </h2>
            <div className='w-20 h-1 bg-primary-600 mx-auto mb-6'></div>
            <p className='text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
              Discover our handpicked selection of premium products
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className='text-center mt-12'>
            <Button
              as={Link}
              to='/shop'
              variant='outline'
              className='border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 px-8 py-3'>
              View All Products
              <ArrowRight className='ml-2 h-5 w-5' />
            </Button>
          </div>
        </div>
      </section>

      {/* East African Specials Banner */}
      <div className='relative overflow-hidden bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 text-white py-8 sm:py-10'>
        {/* African pattern overlay */}
        <div
          className='absolute inset-0 opacity-10'
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 .447 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29-22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fillOpacity='1' fillRule='evenodd'/%3E%3C/svg%3E\")",
            backgroundSize: '100px 100px',
          }}></div>

        {/* Decorative elements */}
        <div className='absolute -top-12 -left-12 w-40 h-40 bg-yellow-400/20 rounded-full filter blur-2xl'></div>
        <div className='absolute -bottom-12 -right-12 w-48 h-48 bg-red-500/20 rounded-full filter blur-2xl'></div>
        <div className='absolute top-1/2 -right-20 w-60 h-60 bg-white/10 rounded-full filter blur-2xl'></div>

        <div className='container mx-auto px-4 relative z-10'>
          <div className='max-w-5xl mx-auto'>
            <div className='flex flex-col md:flex-row items-center'>
              {/* Text Content */}
              <div className='md:w-2/3 text-center md:text-left mb-8 md:mb-0 md:pr-8'>
                {/* Badge */}
                <div className='inline-flex items-center px-4 py-1.5 mb-4 bg-white/20 backdrop-blur-sm rounded-full border border-white/30'>
                  <span className='text-yellow-300 mr-2'>✨</span>
                  <span className='text-sm font-semibold'>
                    East African Special
                  </span>
                </div>

                <h2 className='text-3xl md:text-5xl font-extrabold mb-3 leading-tight'>
                  <span className='text-yellow-300'>JAMAA</span> Deals are Here!
                </h2>

                <p className='text-lg md:text-xl mb-6 max-w-2xl mx-auto md:mx-0 font-medium'>
                  Experience the best of East Africa with up to
                  <span className='font-bold text-yellow-300 ml-1'>
                    50% OFF
                  </span>{' '}
                  on local favorites
                </p>

                {/* Countdown Timer */}
                <CountdownTimer
                  targetDate={
                    new Date(
                      Date.now() +
                        2 * 24 * 60 * 60 * 1000 +
                        12 * 60 * 60 * 1000 +
                        45 * 60 * 1000 +
                        30 * 1000
                    )
                  }
                />

                <div className='flex flex-col sm:flex-row justify-center md:justify-start gap-3'>
                  <Button
                    as={Link}
                    to='/shop?on_sale=true&region=east-africa'
                    size='lg'
                    className='bg-yellow-400 hover:bg-yellow-300 text-gray-900 hover:scale-105 transform transition-all duration-300 font-bold px-6 py-3 text-base shadow-lg border-0'>
                    Nunua Sasa (Shop Now)
                  </Button>

                  <Button
                    as={Link}
                    to='/categories?region=east-africa'
                    variant='outline'
                    size='lg'
                    className='border-2 border-white/30 bg-white/5 hover:bg-white/10 text-white hover:text-white px-6 py-3 text-base transition-all duration-300'>
                    Angalia Bidhaa (Browse Products)
                  </Button>
                </div>

                <p className='mt-4 text-sm text-white/90 flex items-center justify-center md:justify-start'>
                  <span className='inline-flex items-center justify-center w-5 h-5 mr-2 text-yellow-300'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='currentColor'>
                      <path
                        fillRule='evenodd'
                        d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V9z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </span>
                  <span>
                    Bei hizi ni maalum tu kwa siku chache! (Limited time offer!)
                  </span>
                </p>
              </div>

              {/* Image */}
              <div className='md:w-1/3 relative'>
                <div className='relative z-10'>
                  <div className='relative rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500'>
                    <img
                      src='https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=2071&auto=format&fit=crop'
                      alt='East African Market'
                      className='w-full h-auto object-cover'
                      loading='lazy'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'></div>
                  </div>
                  <div className='absolute -bottom-4 -left-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-2xl transform -rotate-12 border-4 border-white shadow-lg'>
                    🔥
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <section className='py-16 bg-gray-50 dark:bg-gray-900'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <span className='inline-block px-4 py-1.5 mb-4 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 rounded-full'>
              Testimonials
            </span>
            <h2 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
              Trusted by Happy Customers
            </h2>
            <div className='w-20 h-1 bg-primary-600 mx-auto mb-6'></div>
            <p className='text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
              Don't just take our word for it - here's what our customers say
              about their experience
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className='group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700'>
                {/* Rating */}
                <div className='flex items-center mb-4'>
                  <div className='flex'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-200 dark:text-gray-600'}`}
                      />
                    ))}
                  </div>
                  <span className='ml-2 text-sm text-gray-500 dark:text-gray-400'>
                    {testimonial.rating}.0/5.0
                  </span>
                </div>

                {/* Testimonial Text */}
                <p className='text-gray-700 dark:text-gray-300 mb-6 relative'>
                  <span className='absolute -top-4 -left-2 text-5xl text-gray-200 dark:text-gray-700 font-serif'>
                    "
                  </span>
                  <span className='relative z-10'>{testimonial.comment}</span>
                </p>

                {/* Customer Info */}
                <div className='flex items-center'>
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className='h-12 w-12 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm'
                  />
                  <div className='ml-4'>
                    <h4 className='font-semibold text-gray-900 dark:text-white'>
                      {testimonial.name}
                    </h4>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {testimonial.location} •{' '}
                      <span className='text-xs'>
                        {testimonial.date || '2 days ago'}
                      </span>
                    </p>
                    {testimonial.product && (
                      <div className='mt-1'>
                        <span className='inline-block px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full'>
                          {testimonial.product}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Add more testimonials as needed */}
            {testimonials.length < 3 && (
              <div className='bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-8 flex flex-col items-center justify-center text-center group hover:border-primary-500 transition-colors'>
                <div className='w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-4 text-primary-500 dark:text-primary-400'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-8 w-8'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 4v16m8-8H4'
                    />
                  </svg>
                </div>
                <h4 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                  Share Your Experience
                </h4>
                <p className='text-gray-500 dark:text-gray-400 text-sm mb-4'>
                  We'd love to hear about your shopping experience with us
                </p>
                <Button variant='outline' size='sm' className='mt-2'>
                  Write a Review
                </Button>
              </div>
            )}
          </div>

          <div className='text-center mt-12'>
            <Button
              as={Link}
              to='/testimonials'
              variant='outline'
              className='border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 px-8 py-3'>
              View All Testimonials
              <ArrowRight className='ml-2 h-5 w-5' />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

// Countdown Timer Component
const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        clearInterval(timer);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timerItems = [
    { value: timeLeft.days.toString().padStart(2, '0'), label: 'Siku' },
    { value: timeLeft.hours.toString().padStart(2, '0'), label: 'Saa' },
    { value: timeLeft.minutes.toString().padStart(2, '0'), label: 'Dakika' },
    { value: timeLeft.seconds.toString().padStart(2, '0'), label: 'Sekunde' },
  ];

  return (
    <div className='flex justify-center md:justify-start gap-2 mb-8'>
      {timerItems.map((item, index) => (
        <div key={index} className='text-center'>
          <div className='bg-black/30 backdrop-blur-sm rounded-lg w-14 h-14 flex flex-col items-center justify-center border border-white/20'>
            <span className='text-xl font-bold'>{item.value}</span>
            <span className='text-xs opacity-90'>{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
