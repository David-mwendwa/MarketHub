import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input, Select, Checkbox } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { productService } from '../../services/product';
import ProductCard from '../../components/products/ProductCard';
import ErrorBadge from '@/components/ui/ErrorBadge';
import {
  Filter,
  Search,
  X,
  Sliders,
  Star,
  Tag,
  Package,
} from 'lucide-react';
import { debounce } from 'lodash';
// Available categories and price ranges
const categories = [
  { id: 'accessories', name: 'Phones & Accessories' },
  { id: 'computing', name: 'Computing' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'smarthome', name: 'Smart Home' },
  { id: 'smartphones', name: 'Smartphones' },
];

const stockStatusOptions = [
  { id: 'all', name: 'All Stock Status' },
  { id: 'in_stock', name: 'In Stock' },
  { id: 'out_of_stock', name: 'Out of Stock' },
];

const priceRanges = [
  { id: 'all', name: 'All Prices' },
  { id: 'under1000', name: 'Under KSh 1,000' },
  { id: '1000-5000', name: 'KSh 1,000 - 5,000' },
  { id: '5000-10000', name: 'KSh 5,000 - 10,000' },
  { id: '10000-20000', name: 'KSh 10,000 - 20,000' },
  { id: 'over20000', name: 'Over KSh 20,000' },
];

const ratings = [4, 3, 2, 1];

const sortOptions = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'bestselling', label: 'Best Selling' },
];
const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 12,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  // Initialize filters from URL or use defaults
  const getInitialFilters = () => {
    const params = Object.fromEntries(searchParams.entries());
    return {
      search: params.search || '',
      categories: params.categories ? params.categories.split(',') : [],
      minPrice: params.minPrice ? parseInt(params.minPrice) : 0,
      maxPrice: params.maxPrice ? parseInt(params.maxPrice) : 100000,
      sort: params.sort || 'newest',
      inStock: params.inStock === 'true',
      onSale: params.onSale === 'true',
      priceRange: params.priceRange || 'all',
      rating: params.rating || '',
      typeId: params.typeId || '',
      stockStatus: params.stockStatus || '',
      allowBackorder: params.allowBackorder !== 'false', // Default to true
    };
  };
  const [filters, setFilters] = useState(getInitialFilters());
  // Update URL when filters change
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();

    // Handle categories separately to maintain array format
    if (filters.categories && filters.categories.length > 0) {
      filters.categories.forEach((cat) => {
        params.append('categories[]', cat);
      });
    }

    // Handle other filters
    Object.entries(filters).forEach(([key, value]) => {
      // Skip categories as they're handled above
      if (key === 'categories') return;

      // Skip falsy values except for boolean false
      if (!value && value !== false) return;

      if (Array.isArray(value)) {
        if (value.length > 0) {
          // For arrays (except categories), join with comma
          params.set(key, value.join(','));
        }
      } else if (typeof value === 'boolean') {
        // Only include true values
        if (value) {
          params.set(key, 'true');
        }
      } else if (key === 'search') {
        // Only include non-empty search terms
        const trimmedSearch = value.trim();
        if (trimmedSearch) {
          params.set(key, trimmedSearch);
        }
      } else {
        // Handle all other values
        params.set(key, value);
      }
    });

    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;

    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }));

    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch products when filters or pagination changes
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Build query params
      // Build the params object with URLSearchParams to handle arrays correctly
      const params = new URLSearchParams();

      // Add pagination
      params.append('page', pagination.page);
      params.append('limit', pagination.limit);

      // Handle categories array - append each category separately
      if (filters.categories && filters.categories.length > 0) {
        filters.categories.forEach((cat) => {
          params.append('categories[]', cat);
        });
      }

      // Add search parameter if it exists
      if (filters.search && filters.search.trim()) {
        params.append('search', filters.search.trim());
      }

      // Add other filters
      console.log('Processing filters:', JSON.stringify(filters, null, 2));

      Object.entries(filters).forEach(([key, value]) => {
        // Skip these keys as they're handled separately
        if (
          ['categories', 'page', 'limit', 'search', 'priceRange'].includes(key)
        ) {
          console.log(`Skipping ${key} as it's handled separately`);
          return;
        }

        if (value !== '' && value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            if (value.length > 0) {
              console.log(`Adding array value for ${key}:`, value);
              value.forEach((v) => params.append(key, v));
            }
          } else if (typeof value === 'boolean') {
            console.log(`Adding boolean value for ${key}:`, value);
            if (value) params.set(key, 'true');
          } else {
            // For minPrice and maxPrice, ensure they're numbers
            if (key === 'minPrice' || key === 'maxPrice') {
              const numValue = Number(value);
              if (!isNaN(numValue)) {
                console.log(`Setting ${key} to:`, numValue);
                params.set(key, numValue.toString());
              } else {
                console.warn(`Invalid number value for ${key}:`, value);
              }
            } else {
              console.log(`Setting ${key} to:`, value);
              params.set(key, value);
            }
          }
        }
      });
      // Handle price range - convert to minPrice and maxPrice parameters
      console.log('Current priceRange:', filters.priceRange);

      if (filters.priceRange && filters.priceRange !== 'all') {
        console.log('Processing price range:', filters.priceRange);
        const range = priceRanges.find((r) => r.id === filters.priceRange);

        if (range) {
          console.log('Found range:', range);

          if (range.id === 'under1000') {
            console.log('Setting price range: under 1000');
            params.set('minPrice', '0');
            params.set('maxPrice', '1000');
          } else if (range.id === '1000-5000') {
            console.log('Setting price range: 1000-5000');
            params.set('minPrice', '1000');
            params.set('maxPrice', '5000');
          } else if (range.id === '5000-10000') {
            console.log('Setting price range: 5000-10000');
            params.set('minPrice', '5000');
            params.set('maxPrice', '10000');
          } else if (range.id === '10000-20000') {
            console.log('Setting price range: 10000-20000');
            params.set('minPrice', '10000');
            params.set('maxPrice', '20000');
          } else if (range.id === 'over20000') {
            console.log('Setting price range: over 20000');
            params.set('minPrice', '20000');
            params.delete('maxPrice');
            console.log('Removed maxPrice for over20000 range');
          }

          console.log(
            'Price params after range selection:',
            Array.from(params.entries()).filter(([key]) =>
              ['minPrice', 'maxPrice', 'priceRange'].includes(key)
            )
          );
        } else {
          console.warn('No matching range found for:', filters.priceRange);
        }
      } else if (filters.priceRange === 'all') {
        console.log('Clearing all price filters');
        params.delete('minPrice');
        params.delete('maxPrice');
        console.log(
          'Price params after clear:',
          Array.from(params.entries()).filter(([key]) =>
            ['minPrice', 'maxPrice', 'priceRange'].includes(key)
          )
        );
      }
      // Log the final URL and params being sent
      const queryString = params.toString();
      console.log('Final API Request URL:', `/api/v1/products?${queryString}`);
      console.log('Final params object:', Object.fromEntries(params.entries()));

      // Log the price-related params separately for clarity
      const priceParams = {};
      if (params.has('minPrice')) priceParams.minPrice = params.get('minPrice');
      if (params.has('maxPrice')) priceParams.maxPrice = params.get('maxPrice');
      if (filters.priceRange) priceParams.priceRange = filters.priceRange;
      console.log('Price-related params:', priceParams);

      // Make the API request
      console.log('Sending request to API...');
      const response = await productService.getProducts(params);

      // Log the response
      console.log('API Response Status:', response.status);
      console.log('API Response Data:', {
        productCount: response.productCount,
        totalPages: response.totalPages,
        productsCount: response.products?.length || 0,
        firstProduct: response.products?.[0]
          ? {
              id: response.products[0]._id,
              name: response.products[0].name,
              price: response.products[0].price,
              specialPrice: response.products[0].specialPrice,
            }
          : 'No products',
      });
      setProducts(response.products || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.totalPages || 1,
        totalItems: response.productCount || 0,
      }));
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);
  // Update URL when filters change
  useEffect(() => {
    console.log('Filters updated:', JSON.stringify(filters, null, 2));
    updateURL();
  }, [filters, updateURL]);
  // Fetch products when component mounts or filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  // Debounced search handler
  const handleSearch = useCallback(
    debounce((value) => {
      setFilters((prev) => ({ ...prev, search: value, page: 1 }));
    }, 300),
    []
  );
  const handleCategoryChange = (categoryId) => {
    setFilters((prev) => {
      // If the clicked category is already selected, clear the selection
      // Otherwise, select only the clicked category
      const newCategories = prev.categories.includes(categoryId)
        ? [] // Clear selection if clicking the same category
        : [categoryId]; // Select only the new category
      return {
        ...prev,
        categories: newCategories,
        page: 1, // Reset to first page when changing categories
      };
    });
  };
  const handlePriceRangeChange = (e) => {
    const rangeId = e.target.value;
    setFilters((prev) => {
      const updates = { priceRange: rangeId, page: 1 };

      // Clear min/max prices when selecting 'all'
      if (rangeId === 'all') {
        updates.minPrice = '';
        updates.maxPrice = '';
      } else {
        // Set min/max based on the selected range
        const range = priceRanges.find((r) => r.id === rangeId);
        if (range) {
          if (range.id === 'under1000') {
            updates.minPrice = '0';
            updates.maxPrice = '1000';
          } else if (range.id === '1000-5000') {
            updates.minPrice = '1000';
            updates.maxPrice = '5000';
          } else if (range.id === '5000-10000') {
            updates.minPrice = '5000';
            updates.maxPrice = '10000';
          } else if (range.id === '10000-20000') {
            updates.minPrice = '10000';
            updates.maxPrice = '20000';
          } else if (range.id === 'over20000') {
            updates.minPrice = '20000';
            updates.maxPrice = '';
          }
        }
      }

      return { ...prev, ...updates };
    });
  };
  const handlePriceInputChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;

    setFilters((prev) => {
      const updates = {
        [name]: numValue,
        priceRange: 'all', // Reset price range when manually setting prices
        page: 1,
      };

      // Ensure minPrice is never greater than maxPrice and vice versa
      if (name === 'minPrice' && numValue >= (prev.maxPrice || 100000)) {
        updates.maxPrice = Math.min(numValue + 1000, 100000);
      } else if (name === 'maxPrice' && numValue <= (prev.minPrice || 0)) {
        updates.minPrice = Math.max(0, numValue - 1000);
      }

      return { ...prev, ...updates };
    });
  };
  const handleSortChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      sort: e.target.value,
      page: 1,
    }));
  };
  const clearFilters = () => {
    setFilters({
      search: '',
      categories: [],
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
      inStock: false,
      onSale: false,
      priceRange: 'all',
      rating: '',
      typeId: '',
      stockStatus: '',
      allowBackorder: true,
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };
  // Calculate active filter count for the badge
  const activeFilterCount = [
    filters.search ? 1 : 0,
    filters.categories.length,
    filters.minPrice || filters.maxPrice ? 1 : 0,
    filters.inStock ? 1 : 0,
    filters.onSale ? 1 : 0,
    filters.rating ? 1 : 0,
    filters.sort !== 'newest' ? 1 : 0,
    filters.typeId ? 1 : 0,
    filters.stockStatus ? 1 : 0,
    filters.allowBackorder === false ? 1 : 0,
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
                    <div className='space-y-2.5 max-h-60 overflow-y-auto pr-2'>
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

                  {/* Stock & Deals Section */}
                  <div className='space-y-4'>
                    <div className='bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-xl p-4 shadow-sm'>
                      <h3 className='text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center'>
                        <Package className='h-4 w-4 text-primary-500 mr-2' />
                        <span>Availability</span>
                      </h3>
                      <div className='space-y-2.5 max-h-60 overflow-y-auto pr-2'>
                        {stockStatusOptions.map((status) => {
                          const isActive =
                            filters.stockStatus === status.id ||
                            (status.id === 'all' && !filters.stockStatus);
                          return (
                            <div
                              key={status.id}
                              className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
                                isActive
                                  ? 'bg-primary-50 dark:bg-primary-900/20'
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                              }`}>
                              <Checkbox
                                id={`status-${status.id}`}
                                checked={isActive}
                                onChange={() => {
                                  setFilters((prev) => ({
                                    ...prev,
                                    stockStatus:
                                      status.id === 'all' ? '' : status.id,
                                    page: 1,
                                  }));
                                }}
                                className='h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-primary-500 dark:checked:border-primary-500'
                              />
                              <label
                                htmlFor={`status-${status.id}`}
                                className={`ml-3 text-sm font-medium cursor-pointer ${
                                  isActive
                                    ? 'text-primary-700 dark:text-primary-400'
                                    : 'text-gray-700 dark:text-gray-300'
                                }`}>
                                {status.name}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className='bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-xl p-4 shadow-sm'>
                    <h3 className='text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center'>
                      <span className='font-bold text-primary-600 dark:text-primary-400 mr-1'>
                        KSh
                      </span>
                      <span className='text-gray-500 dark:text-gray-400'>
                        Price Range
                      </span>
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
                            KSh {filters.minPrice}
                          </span>
                        </div>
                        <input
                          type='range'
                          id='minPrice'
                          name='minPrice'
                          min='0'
                          max={
                            filters.maxPrice
                              ? Math.min(100000, filters.maxPrice - 1)
                              : 100000
                          }
                          value={filters.minPrice || 0}
                          onChange={handlePriceInputChange}
                          step='1000'
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
                            KSh {filters.maxPrice}
                          </span>
                        </div>
                        <input
                          type='range'
                          id='maxPrice'
                          name='maxPrice'
                          min={filters.minPrice ? filters.minPrice + 1 : 1000}
                          max='100000'
                          value={filters.maxPrice || 100000}
                          onChange={handlePriceInputChange}
                          step='1000'
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
                    Show {products.length} Results
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
                    {products.length}
                  </span>{' '}
                  {products.length === 1 ? 'result' : 'results'}
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
                  <Select
                    id='sort'
                    value={filters.sort}
                    onChange={handleSortChange}
                    options={sortOptions}
                    className='w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700/50 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 transition-all duration-200'
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className='flex justify-center items-center h-64'>
                <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
              </div>
            ) : error ? (
              <ErrorBadge message={error} />
            ) : Array.isArray(products) && products.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {products.map((product) => (
                  <ProductCard
                    key={product._id || product.id}
                    product={product}
                  />
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
        {/* Add this after the product grid */}
        {!loading && products.length > 0 && (
          <div className='mt-8 flex flex-col sm:flex-row items-center justify-between gap-4'>
            <div className='text-sm text-gray-600 dark:text-gray-300'>
              Showing{' '}
              <span className='font-medium'>
                {(pagination.page - 1) * pagination.limit + 1}
              </span>{' '}
              to{' '}
              <span className='font-medium'>
                {Math.min(
                  pagination.page * pagination.limit,
                  pagination.totalItems
                )}
              </span>{' '}
              of <span className='font-medium'>{pagination.totalItems}</span>{' '}
              results
            </div>

            <div className='flex items-center space-x-2'>
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  pagination.page === 1
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}>
                Previous
              </button>

              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium ${
                        pagination.page === pageNum
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}>
                      {pageNum}
                    </button>
                  );
                }
              )}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  pagination.page === pagination.totalPages
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}>
                Next
              </button>
            </div>
          </div>
        )}
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
