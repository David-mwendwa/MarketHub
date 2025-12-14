import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ShoppingCart, Star, Heart } from 'lucide-react';

const RecommendedProducts = () => {
  // Mock data - replace with actual API call
  const recommendedProducts = [
    {
      id: 1,
      name: 'Wireless Earbuds',
      price: 79.99,
      rating: 4.5,
      image: 'https://via.placeholder.com/100',
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 199.99,
      rating: 4.2,
      image: 'https://via.placeholder.com/100',
    },
    {
      id: 3,
      name: 'Bluetooth Speaker',
      price: 59.99,
      rating: 4.7,
      image: 'https://via.placeholder.com/100',
    },
  ];

  return (
    <Card className='p-6'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-lg font-medium'>Recommended For You</h3>
        <Button variant='ghost' size='sm'>
          View All <span className='ml-1'>→</span>
        </Button>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {recommendedProducts.map((product) => (
          <div
            key={product.id}
            className='border rounded-lg p-4 hover:shadow-md transition-shadow'>
            <div className='aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden'>
              <img
                src={product.image}
                alt={product.name}
                className='w-full h-full object-cover'
              />
            </div>
            <h4 className='font-medium'>{product.name}</h4>
            <div className='flex items-center mt-1 mb-2'>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className='text-sm text-gray-500 ml-2'>
                {product.rating}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='font-bold'>${product.price.toFixed(2)}</span>
              <div className='flex space-x-2'>
                <Button variant='outline' size='sm' className='p-2'>
                  <Heart className='h-4 w-4' />
                </Button>
                <Button size='sm' className='flex items-center'>
                  <ShoppingCart className='h-4 w-4 mr-1' />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecommendedProducts;
