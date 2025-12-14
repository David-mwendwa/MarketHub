import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCart } from '../../contexts/CartContext';
import { formatCurrency } from '../../lib/utils';

const CartDropdown = ({ className, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { itemCount, cartTotal } = useCart();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={cn('relative', className)} ref={dropdownRef} {...props}>
      <button
        type="button"
        onClick={toggleDropdown}
        className="relative p-2 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-white"
        aria-label="Cart"
      >
        <ShoppingCart className="h-6 w-6" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Your Cart
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto p-4">
            {itemCount === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  Your cart is empty
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Start adding some items to your cart
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Mini cart items would go here */}
                <div className="space-y-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
                  </div>
                  <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                    <p>Subtotal</p>
                    <p>{formatCurrency(cartTotal)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {itemCount > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <Button
                onClick={() => {
                  setIsOpen(false);
                  // Navigate to cart page
                }}
                className="w-full"
              >
                View Cart & Checkout
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartDropdown;
