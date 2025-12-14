import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input, Select, Checkbox } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import ProductCard from '../../components/products/ProductCard';
import {
  Filter,
  Search,
  X,
  Sliders,
  Star,
  Tag,
  DollarSign,
} from 'lucide-react';
import { debounce } from 'lodash';

// Available categories and price ranges
const categories = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'home', name: 'Home & Garden' },
  { id: 'beauty', name: 'Beauty' },
  { id: 'sports', name: 'Sports & Outdoors' },
  { id: 'books', name: 'Books' },
];

const priceRanges = [
  { id: 'all', name: 'All Prices' },
  { id: 'under25', name: 'Under $25', min: 0, max: 25 },
  { id: '25to50', name: '$25 to $50', min: 25, max: 50 },
  { id: '50to100', name: '$50 to $100', min: 50, max: 100 },
  { id: 'over100', name: 'Over $100', min: 100, max: Infinity },
];

const ratings = [4, 3, 2, 1];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    categories: searchParams.get('categories')?.split(',') || [],
    priceRange: searchParams.get('priceRange') || 'all',
    minPrice: searchParams.get('minPrice') || 0,
    maxPrice: searchParams.get('maxPrice') || 1000,
    rating: searchParams.get('rating') || 0,
    sort: searchParams.get('sort') || 'featured',
  });
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Realistic product data
  const productNames = [
    // Electronics
    'Wireless Noise-Canceling Headphones',
    '4K Ultra HD Smart TV 55"',
    'Bluetooth Portable Speaker',
    'Gaming Laptop Pro',
    'Smartphone 13 Pro Max',
    'Smart Watch Series 7',
    'Wireless Earbuds Pro',
    'DSLR Camera Kit',
    // Fashion
    'Slim Fit Dress Shirt',
    'Classic Denim Jeans',
    'Leather Crossbody Bag',
    'Running Sneakers',
    'Wool Blend Coat',
    'Silk Scarf',
    // Home & Garden
    'Ceramic Plant Pot Set',
    'Memory Foam Mattress',
    'Stainless Steel Cookware Set',
    'Robot Vacuum Cleaner',
    // Beauty
    'Vitamin C Serum',
    'Hydrating Face Cream',
    'Makeup Brush Set',
    'Coconut Hair Mask',
    // Sports & Outdoors
    'Yoga Mat',
    'Mountain Bike',
    'Camping Tent 4-Person',
  ];

  // Mock products data - replace with API call
  const products = Array(24)
    .fill()
    .map((_, i) => {
      const name = productNames[i % productNames.length];
      const category =
        categories[Math.floor(Math.random() * categories.length)].id;
      const price = Math.floor(Math.random() * 900) + 100; // $10-$1000
      const originalPrice = Math.round(price * (1 + Math.random() * 0.5)); // 0-50% more than price
      const isOnSale = Math.random() > 0.7;

      return {
        id: i + 1,
        name: name,
        price: isOnSale ? price : originalPrice,
        originalPrice: isOnSale ? originalPrice : price,
        rating: Math.floor(Math.random() * 2) + 3, // 3-5 stars
        reviewCount: Math.floor(Math.random() * 100) + 1,
        // Using placeholder images from Picsum Photos with more relevant image IDs
        image: `https://picsum.photos/seed/${name.replace(/\s+/g, '-').toLowerCase()}-${i}/300/300`,
        category: category,
        isNew: Math.random() > 0.7,
        isOnSale: isOnSale,
      };
    });

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('q', filters.search);
    if (filters.categories.length)
      params.set('categories', filters.categories.join(','));
    if (filters.priceRange !== 'all')
      params.set('priceRange', filters.priceRange);
    if (filters.minPrice > 0) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice < 1000) params.set('maxPrice', filters.maxPrice);
    if (filters.rating > 0) params.set('rating', filters.rating);
    if (filters.sort !== 'featured') params.set('sort', filters.sort);

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Debounced search handler
  const handleSearch = useCallback(
    debounce((value) => {
      setFilters((prev) => ({ ...prev, search: value }));
    }, 300),
    []
  );

  const handleCategoryChange = (categoryId) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const handlePriceRangeChange = (e) => {
    const range = priceRanges.find((r) => r.id === e.target.value);
    setFilters((prev) => ({
      ...prev,
      priceRange: e.target.value,
      minPrice: range?.min || 0,
      maxPrice: range?.max || 1000,
    }));
  };

  const handlePriceInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: parseInt(value, 10),
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      categories: [],
      priceRange: 'all',
      minPrice: 0,
      maxPrice: 1000,
      rating: 0,
      sort: 'featured',
    });
  };

  const filteredProducts = products
    .filter((product) => {
      // Search filter
      if (
        filters.search &&
        !product.name.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      // Category filter
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(product.category)
      ) {
        return false;
      }
      // Price range filter
      if (
        product.price < filters.minPrice ||
        product.price > filters.maxPrice
      ) {
        return false;
      }
      // Rating filter
      if (filters.rating > 0 && product.rating < filters.rating) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (filters.sort) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.id - a.id;
        default:
          return 0;
      }
    });

  const activeFilterCount = [
    filters.search ? 1 : 0,
    filters.categories.length,
    filters.priceRange !== 'all' ? 1 : 0,
    filters.minPrice > 0 || filters.maxPrice < 1000 ? 1 : 0,
    filters.rating > 0 ? 1 : 0,
    filters.sort !== 'featured' ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800'>
      <div className='container mx-auto px-4 sm:px-6 py-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Mobile filter dialog trigger */}
          <div className='lg:hidden mb-4'>
            <Button
              type='button'
              variant='outline'
              className='w-full flex items-center justify-center py-2.5 px-4 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-gray-800/50 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md'
              onClick={() => setIsMobileFiltersOpen(true)}>
              <Filter className='mr-2 h-4 w-4' />
              <span className='font-medium'>Filters</span>
              {activeFilterCount > 0 && (
                <span className='ml-2 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-xs font-semibold bg-primary-500 text-white'>
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>

          {/* Filters Sidebar */}
          <div
            className={`${
              isMobileFiltersOpen
                ? 'fixed inset-0 z-50 overflow-y-auto'
                : 'hidden'
            } lg:block lg:relative lg:inset-auto lg:overflow-visible`}>
            {/* Mobile overlay */}
            {isMobileFiltersOpen && (
              <div
                className='fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden'
                onClick={() => setIsMobileFiltersOpen(false)}
              />
            )}

            <div className='relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl lg:shadow-md border border-gray-100 dark:border-gray-700/50 overflow-hidden lg:sticky lg:top-4'>
              {/* Mobile header */}
              <div className='lg:hidden flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700'>
                <h2 className='text-xl font-semibold flex items-center text-gray-900 dark:text-white'>
                  <Sliders className='h-5 w-5 mr-2 text-primary-500' />
                  Filters
                </h2>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className='p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'>
                  <X className='h-5 w-5' />
                </button>
              </div>

              <div className='p-5 lg:p-6 max-h-[80vh] lg:max-h-[calc(100vh-2rem)] overflow-y-auto'>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
                    Filter Products
                  </h2>
                  <button
                    onClick={clearFilters}
                    className='text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200'>
                    Clear all
                  </button>
                </div>

                <div className='space-y-8'>
                  {/* Search */}
                  <div className='bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 p-4 rounded-xl'>
                    <h3 className='text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center'>
                      <Search className='h-4 w-4 mr-2 text-primary-500' />
                      Search Products
                    </h3>
                    <div className='relative'>
                      <Input
                        type='text'
                        placeholder='Type to search...'
                        className='pl-10 pr-4 py-2.5 w-full bg-white dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 transition-all duration-200'
                        defaultValue={filters.search}
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <Search className='h-4 w-4 text-gray-400' />
                      </div>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className='bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-xl p-4 shadow-sm'>
                    <h3 className='text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center'>
                      <Tag className='h-4 w-4 mr-2 text-primary-500' />
                      Categories
                    </h3>
                    <div className='space-y-2.5'>
                      {categories.map((category) => {
                        const isActive = filters.categories.includes(
                          category.id
                        );
                        return (
                          <div
                            key={category.id}
                            className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
                              isActive
                                ? 'bg-primary-50 dark:bg-primary-900/20'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }`}>
                            <Checkbox
                              id={`category-${category.id}`}
                              checked={isActive}
                              onChange={() => handleCategoryChange(category.id)}
                              className='h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-primary-500 dark:checked:border-primary-500'
                            />
                            <label
                              htmlFor={`category-${category.id}`}
                              className={`ml-3 text-sm font-medium cursor-pointer ${
                                isActive
                                  ? 'text-primary-700 dark:text-primary-400'
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}>
                              {category.name}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className='bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-xl p-4 shadow-sm'>
                    <h3 className='text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center'>
                      <DollarSign className='h-4 w-4 mr-2 text-primary-500' />
                      Price Range
                    </h3>

                    <div className='mb-5'>
                      <Select
                        value={filters.priceRange}
                        onChange={handlePriceRangeChange}
                        options={priceRanges.map((range) => ({
                          value: range.id,
                          label: range.name,
                        }))}
                        className='w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700/50 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 transition-all duration-200'
                      />
                    </div>

                    <div className='space-y-6'>
                      <div>
                        <div className='flex justify-between items-center mb-2'>
                          <label
                            htmlFor='minPrice'
                            className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                            Min Price
                          </label>
                          <span className='text-sm font-medium bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full'>
                            ${filters.minPrice}
                          </span>
                        </div>
                        <input
                          type='range'
                          id='minPrice'
                          name='minPrice'
                          min='0'
                          max={filters.maxPrice - 1}
                          value={filters.minPrice}
                          onChange={handlePriceInputChange}
                          className='w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500 [&::-webkit-slider-thumb]:hover:bg-primary-600 [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-200 [&::-webkit-slider-thumb]:shadow-md'
                        />
                      </div>

                      <div>
                        <div className='flex justify-between items-center mb-2'>
                          <label
                            htmlFor='maxPrice'
                            className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                            Max Price
                          </label>
                          <span className='text-sm font-medium bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full'>
                            ${filters.maxPrice}
                          </span>
                        </div>
                        <input
                          type='range'
                          id='maxPrice'
                          name='maxPrice'
                          min={filters.minPrice + 1}
                          max='1000'
                          value={filters.maxPrice}
                          onChange={handlePriceInputChange}
                          className='w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500 [&::-webkit-slider-thumb]:hover:bg-primary-600 [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-200 [&::-webkit-slider-thumb]:shadow-md'
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className='bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-xl p-4 shadow-sm'>
                    <h3 className='text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center'>
                      <Star className='h-4 w-4 mr-2 text-primary-500 fill-primary-500' />
                      Customer Reviews
                    </h3>
                    <div className='space-y-3'>
                      {ratings.map((rating) => {
                        const isActive = filters.rating === rating;
                        return (
                          <div
                            key={rating}
                            className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
                              isActive
                                ? 'bg-amber-50 dark:bg-amber-900/20'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }`}>
                            <Checkbox
                              id={`rating-${rating}`}
                              checked={isActive}
                              onChange={() =>
                                setFilters((prev) => ({
                                  ...prev,
                                  rating: prev.rating === rating ? 0 : rating,
                                }))
                              }
                              className='h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-400 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-amber-500 dark:checked:border-amber-500'
                            />
                            <div className='ml-3 flex items-center'>
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 transition-colors ${
                                    i < rating
                                      ? 'text-amber-400'
                                      : 'text-gray-300 dark:text-gray-600'
                                  }`}
                                  fill={i < rating ? 'currentColor' : 'none'}
                                />
                              ))}
                              <span
                                className={`ml-2 text-sm font-medium ${
                                  isActive
                                    ? 'text-amber-700 dark:text-amber-400'
                                    : 'text-gray-600 dark:text-gray-400'
                                }`}>
                                & Up
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Mobile Apply Button */}
                <div className='lg:hidden mt-6 pt-4 border-t border-gray-100 dark:border-gray-700'>
                  <Button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className='w-full py-3 text-base font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200'>
                    Show {filteredProducts.length} Results
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className='flex-1'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4'>
              <div className='flex items-center flex-wrap gap-2'>
                <p className='text-sm text-gray-600 dark:text-gray-300'>
                  Showing{' '}
                  <span className='font-semibold text-gray-900 dark:text-white'>
                    {filteredProducts.length}
                  </span>{' '}
                  {filteredProducts.length === 1 ? 'result' : 'results'}
                </p>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className='ml-2 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200 group'>
                    <X className='h-3.5 w-3.5 mr-1 group-hover:scale-110 transition-transform' />
                    Clear all filters
                  </button>
                )}
              </div>
              <div className='w-full sm:w-56'>
                <div className='relative'>
                  <label htmlFor='sort' className='sr-only'>
                    Sort by
                  </label>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-4 w-4 text-gray-400'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4'
                      />
                    </svg>
                  </div>
                  <Select
                    id='sort'
                    value={filters.sort}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, sort: e.target.value }))
                    }
                    options={[
                      { value: 'featured', label: 'Featured' },
                      { value: 'newest', label: 'Newest' },
                      { value: 'price-low', label: 'Price: Low to High' },
                      { value: 'price-high', label: 'Price: High to Low' },
                      { value: 'rating', label: 'Top Rated' },
                    ]}
                    className='pl-10 py-2.5 text-sm border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 transition-all duration-200'
                  />
                </div>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className='text-center py-16 bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50'>
                <div className='mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400 mb-4'>
                  <Search className='h-8 w-8' />
                </div>
                <h3 className='mt-2 text-lg font-medium text-gray-900 dark:text-white'>
                  No products found
                </h3>
                <p className='mt-1 text-gray-500 dark:text-gray-400'>
                  Try adjusting your search or filter to find what you're
                  looking for.
                </p>
                <div className='mt-6'>
                  <Button
                    variant='outline'
                    onClick={clearFilters}
                    className='inline-flex items-center'>
                    <X className='h-4 w-4 mr-2' />
                    Clear all filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter dialog overlay */}
      {isMobileFiltersOpen && (
        <div className='fixed inset-0 z-40 flex lg:hidden'>
          <div
            className='fixed inset-0 bg-black bg-opacity-25'
            onClick={() => setIsMobileFiltersOpen(false)}></div>
          <div className='relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white dark:bg-gray-800 py-4 pb-12 shadow-xl'>
            <div className='flex items-center justify-between px-4'>
              <h2 className='text-lg font-medium text-gray-900 dark:text-white'>
                Filters
              </h2>
              <button
                type='button'
                className='-mr-2 flex h-10 w-10 items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                onClick={() => setIsMobileFiltersOpen(false)}>
                <X className='h-6 w-6' />
              </button>
            </div>
            <div className='mt-4 border-t border-gray-200 dark:border-gray-700'>
              <div className='px-4 py-6'>
                {/* Mobile filters content */}
                <div className='space-y-6'>
                  {/* Search */}
                  <div>
                    <h3 className='text-sm font-medium text-gray-900 dark:text-white mb-2'>
                      Search
                    </h3>
                    <div className='relative'>
                      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <Search className='h-5 w-5 text-gray-400' />
                      </div>
                      <Input
                        type='text'
                        placeholder='Search products...'
                        className='pl-10 w-full'
                        defaultValue={filters.search}
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <h3 className='text-sm font-medium text-gray-900 dark:text-white mb-3'>
                      Categories
                    </h3>
                    <div className='space-y-2'>
                      {categories.map((category) => (
                        <div key={category.id} className='flex items-center'>
                          <Checkbox
                            id={`mobile-category-${category.id}`}
                            checked={filters.categories.includes(category.id)}
                            onChange={() => handleCategoryChange(category.id)}
                            className='h-4 w-4 rounded text-primary-600 focus:ring-primary-500'
                          />
                          <label
                            htmlFor={`mobile-category-${category.id}`}
                            className='ml-3 text-sm text-gray-700 dark:text-gray-300'>
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h3 className='text-sm font-medium text-gray-900 dark:text-white mb-3'>
                      Price Range
                    </h3>
                    <Select
                      value={filters.priceRange}
                      onChange={handlePriceRangeChange}
                      options={priceRanges.map((range) => ({
                        value: range.id,
                        label: range.name,
                      }))}
                      className='mb-4'
                    />
                    <div className='space-y-4'>
                      <div>
                        <label
                          htmlFor='mobile-minPrice'
                          className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                          Min Price: ${filters.minPrice}
                        </label>
                        <input
                          type='range'
                          id='mobile-minPrice'
                          name='minPrice'
                          min='0'
                          max={filters.maxPrice - 1}
                          value={filters.minPrice}
                          onChange={handlePriceInputChange}
                          className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700'
                        />
                      </div>
                      <div>
                        <label
                          htmlFor='mobile-maxPrice'
                          className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                          Max Price: ${filters.maxPrice}
                        </label>
                        <input
                          type='range'
                          id='mobile-maxPrice'
                          name='maxPrice'
                          min={filters.minPrice + 1}
                          max='1000'
                          value={filters.maxPrice}
                          onChange={handlePriceInputChange}
                          className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700'
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <h3 className='text-sm font-medium text-gray-900 dark:text-white mb-3'>
                      Customer Review
                    </h3>
                    <div className='space-y-2'>
                      {ratings.map((rating) => (
                        <div key={rating} className='flex items-center'>
                          <Checkbox
                            id={`mobile-rating-${rating}`}
                            checked={filters.rating === rating}
                            onChange={() =>
                              setFilters((prev) => ({
                                ...prev,
                                rating: prev.rating === rating ? 0 : rating,
                              }))
                            }
                            className='h-4 w-4 rounded text-primary-600 focus:ring-primary-500'
                          />
                          <div className='ml-3 flex items-center'>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < rating
                                    ? 'text-yellow-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                                fill={i < rating ? 'currentColor' : 'none'}
                              />
                            ))}
                            <span className='ml-1 text-xs text-gray-500'>
                              & Up
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='border-t border-gray-200 dark:border-gray-700 px-4 py-6'>
              <Button
                onClick={() => {
                  clearFilters();
                  setIsMobileFiltersOpen(false);
                }}
                variant='outline'
                className='w-full'>
                Clear all
              </Button>
              <Button
                onClick={() => setIsMobileFiltersOpen(false)}
                className='mt-3 w-full'>
                Apply filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
