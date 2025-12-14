import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { ShoppingCart, X, ArrowLeft } from 'lucide-react';
import CartItem from './CartItem';
import { useCart } from '../../contexts/CartContext';
import { formatCurrency } from '../../lib/utils';

const Cart = ({ onClose, className, ...props }) => {
  const { cartItems, cartTotal, itemCount, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose?.();
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    onClose?.();
    navigate('/shop');
  };

  if (itemCount === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)} {...props}>
        <ShoppingCart className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Your cart is empty
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Button onClick={handleContinueShopping}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full', className)} {...props}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 py-4 sm:px-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
        <div className="flow-root">
          <ul className="-my-6 divide-y divide-gray-200 dark:divide-gray-700">
            {cartItems.map((item) => (
              <li key={item.id} className="py-6">
                <CartItem item={item} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-6 sm:px-6">
        <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white mb-4">
          <p>Subtotal</p>
          <p>{formatCurrency(cartTotal)}</p>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Shipping and taxes calculated at checkout.
        </p>
        <div className="space-y-3">
          <Button
            onClick={handleCheckout}
            className="w-full"
          >
            Checkout
          </Button>
          <Button
            onClick={handleContinueShopping}
            variant="outline"
            className="w-full"
            startIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Continue Shopping
          </Button>
        </div>
        <div className="mt-6 flex justify-center text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            or{' '}
            <button
              type="button"
              onClick={clearCart}
              className="font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
            >
              Clear Cart
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
