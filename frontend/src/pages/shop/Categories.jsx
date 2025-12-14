import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import HeroSection from '../../components/common/HeroSection';
import {
  Smartphone,
  Shirt,
  Home,
  Heart,
  Dumbbell,
  BookOpen,
  ArrowRight,
  Search,
  Filter,
} from 'lucide-react';

import CategoryCard from '../../components/categories/CategoryCard';

const categories = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Discover the latest gadgets and cutting-edge technology',
    icon: <Smartphone className='w-6 h-6' />,
    image:
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    productCount: 245,
  },
  {
    id: 'fashion',
    name: 'Fashion',
    description: 'Trendy clothing and accessories for every style',
    icon: <Shirt className='w-6 h-6' />,
    image:
      'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    bg: 'bg-pink-50 dark:bg-pink-900/30',
    productCount: 312,
  },
  {
    id: 'home-living',
    name: 'Home & Living',
    description: 'Transform your space with our curated collection',
    icon: <Home className='w-6 h-6' />,
    image:
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    bg: 'bg-amber-50 dark:bg-amber-900/30',
    productCount: 189,
  },
  {
    id: 'beauty',
    name: 'Beauty & Care',
    description: 'Enhance your natural beauty with premium products',
    icon: <Heart className='w-6 h-6' />,
    image:
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    bg: 'bg-purple-50 dark:bg-purple-900/30',
    productCount: 156,
  },
  {
    id: 'sports',
    name: 'Sports & Fitness',
    description: 'Gear up for your active lifestyle',
    icon: <Dumbbell className='w-6 h-6' />,
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    bg: 'bg-green-50 dark:bg-green-900/30',
    productCount: 278,
  },
  {
    id: 'books',
    name: 'Books & Media',
    description: 'Expand your mind with our vast collection',
    icon: <BookOpen className='w-6 h-6' />,
    image:
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    bg: 'bg-indigo-50 dark:bg-indigo-900/30',
    productCount: 201,
  },
];

const Categories = () => {
  return (
    <div className='min-h-screen bg-white dark:bg-gray-900'>
      <HeroSection
        badgeText='Browse Our Collections'
        title='Shop by'
        highlightText='Category'
        description='Discover products across our carefully curated categories, designed to meet all your shopping needs'
      />

      {/* Categories Grid */}
      <section className='py-12 bg-white dark:bg-gray-900'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
          {/* Search and Filter (Placeholder) */}
          <div className='flex flex-col sm:flex-row justify-between items-center mb-8 gap-4'>
            <div className='relative w-full sm:max-w-md'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Search className='h-5 w-5 text-gray-400' />
              </div>
              <input
                type='text'
                className='block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                placeholder='Search categories...'
              />
            </div>
            <button className='flex items-center justify-center px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full sm:w-auto'>
              <Filter className='h-5 w-5 mr-2' />
              <span>Filters</span>
            </button>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={{
                  ...category,
                  count: category.productCount,
                  showExplore: true,
                }}
                variant='default'
              />
            ))}
          </div>

          {/* CTA Section */}
          <div className='mt-16 text-center'>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
              Can't find what you're looking for?
            </h2>
            <p className='text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto'>
              Browse our complete collection of products across all categories
            </p>
            <Button
              as={Link}
              to='/shop'
              variant='outline'
              className='border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 px-6 py-2.5 rounded-lg transition-colors duration-300 inline-flex items-center'>
              Explore All Products
              <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Categories;
