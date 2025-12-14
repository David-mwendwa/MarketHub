import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Search } from 'lucide-react';
import ProductCard from '../../components/products/ProductCard';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  // Mock search results - replace with actual API call
  const searchResults = Array(6)
    .fill(0)
    .map((_, i) => ({
      id: i + 1,
      name: `Search Result ${i + 1} for "${query}"`,
      price: 99.99 - i * 5,
      rating: 4.5 - i * 0.5,
      image: `https://via.placeholder.com/300x300?text=Product+${i + 1}`,
      category: ['Electronics', 'Fashion', 'Home'][i % 3],
    }));

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold mb-4'>
          Search Results for "{query}"
        </h1>
        <p className='text-gray-600 dark:text-gray-400'>
          {searchResults.length} results found
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {searchResults.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {searchResults.length === 0 && (
        <div className='text-center py-12'>
          <Search className='mx-auto h-12 w-12 text-gray-400 mb-4' />
          <h2 className='text-xl font-semibold mb-2'>No results found</h2>
          <p className='text-gray-600 dark:text-gray-400'>
            We couldn't find any products matching "{query}"
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
