// src/components/products/ProductList.jsx
import React from 'react';
import ProductCard from './ProductCard';
import { cn } from '../../lib/utils';

const ProductList = ({ products, className, ...props }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found.</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6',
        className
      )}
      {...props}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;