// src/components/products/ProductDetails.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { Button } from '../ui/Button';
import { useToast } from '../ui/toast';
import { Star, Heart, Share2, ChevronLeft } from 'lucide-react';

const ProductDetails = ({ product }) => {
  const { addToCart, isInCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const toast = useToast();

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart`);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0 && value <= 10) {
      setQuantity(value);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button
        variant="ghost"
        onClick={() => window.history.back()}
        className="mb-6"
        startIcon={<ChevronLeft className="h-4 w-4" />}
      >
        Back to products
      </Button>

      <div className="lg:grid lg:grid-cols-2 lg:gap-8">
        {/* Product images */}
        <div className="space-y-4">
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
            <img
              src={product.images?.[selectedImage] || ''}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images?.map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedImage(index)}
                className={`rounded-md overflow-hidden ${
                  selectedImage === index
                    ? 'ring-2 ring-offset-2 ring-primary-500'
                    : ''
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="h-20 w-full object-cover object-center"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product info */}
        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {product.name}
          </h1>

          <div className="mt-3">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-gray-900 dark:text-white">
              ${product.price.toFixed(2)}
              {product.compareAtPrice > product.price && (
                <span className="ml-2 text-sm text-gray-500 line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </p>
            {product.compareAtPrice > product.price && (
              <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                {Math.round(
                  ((product.compareAtPrice - product.price) /
                    product.compareAtPrice) *
                    100
                )}
                % off
              </span>
            )}
          </div>

          {/* Reviews */}
          <div className="mt-3">
            <div className="flex items-center">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Star
                    key={rating}
                    className={`h-5 w-5 ${
                      rating <= Math.floor(product.rating || 0)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    fill={
                      rating <= Math.floor(product.rating || 0)
                        ? 'currentColor'
                        : 'none'
                    }
                  />
                ))}
              </div>
              <p className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {product.rating?.toFixed(1) || 'No'} reviews
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="space-y-6 text-base text-gray-700 dark:text-gray-300">
              {product.description}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-md"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-12 text-center border-0 bg-transparent focus:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-md"
                >
                  +
                </button>
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={isInCart(product.id)}
                className="flex-1"
              >
                {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
              </Button>
            </div>
          </div>

          <div className="mt-6 flex space-x-4">
            <Button variant="outline" className="flex-1" startIcon={<Heart className="h-5 w-5" />}>
              Wishlist
            </Button>
            <Button variant="outline" className="flex-1" startIcon={<Share2 className="h-5 w-5" />}>
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Product details */}
      <div className="mt-16">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Product details
        </h2>

        <div className="mt-4 space-y-6">
          <p className="text-gray-600 dark:text-gray-300">
            {product.longDescription || product.description}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Features
            </h3>
            <ul className="mt-4 space-y-2">
              {product.features?.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Specifications
            </h3>
            <dl className="mt-4 space-y-2">
              {product.specifications?.map((spec, i) => (
                <div key={i} className="flex justify-between">
                  <dt className="text-sm text-gray-600 dark:text-gray-300">
                    {spec.name}
                  </dt>
                  <dd className="text-sm text-gray-900 dark:text-white">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;