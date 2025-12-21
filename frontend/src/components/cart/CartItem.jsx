import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../lib/utils';
import { cn } from '../../lib/utils';

const CartItem = ({
  item,
  variant = 'default',
  updateQuantity,
  removeFromCart,
}) => {
  const { _id, name, price, quantity, thumbnail, stock } = item;

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (stock?.qty || 10)) {
      updateQuantity(_id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeFromCart(_id);
  };

  const isCompact = variant === 'compact';

  return (
    <div
      className={cn('flex', {
        'items-start': isCompact,
        'items-center': !isCompact,
      })}>
      <div className='flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700'>
        <img
          src={thumbnail}
          alt={name}
          className='h-full w-full object-cover object-center'
        />
      </div>

      <div className='ml-4 flex-1'>
        <div className='flex justify-between text-base font-medium text-gray-900 dark:text-white'>
          <h3 className={cn({ 'text-sm': isCompact })}>{name}</h3>
          <p className='ml-4'>{formatCurrency(price * quantity)}</p>
        </div>

        {!isCompact && (
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            {formatCurrency(price)} each
          </p>
        )}

        <div className='flex items-center mt-2'>
          <div className='flex items-center border border-gray-300 dark:border-gray-600 rounded-md'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => handleQuantityChange(quantity - 1)}
              className='h-8 w-8 p-0'
              disabled={quantity <= 1}>
              -
            </Button>
            <span className='w-8 text-center text-sm'>{quantity}</span>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => handleQuantityChange(quantity + 1)}
              className='h-8 w-8 p-0'
              disabled={quantity >= (stock?.qty || 10)}>
              +
            </Button>
          </div>

          <Button
            variant='ghost'
            size='sm'
            onClick={handleRemove}
            className='ml-2 text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300'>
            <X className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;

// import React from 'react';
// import { X, Plus, Minus } from 'lucide-react';
// import { Button } from '../ui/Button';
// import { useCart } from '../../contexts/CartContext';
// import { formatCurrency } from '../../lib/utils';

// const CartItem = ({ item, onUpdateQuantity, onRemove, className, ...props }) => {
//   const { updateQuantity, removeFromCart } = useCart();

//   const handleQuantityChange = (newQuantity) => {
//     if (newQuantity >= 1 && newQuantity <= 10) {
//       updateQuantity(item.id, newQuantity);
//       onUpdateQuantity?.(item.id, newQuantity);
//     }
//   };

//   const handleRemove = () => {
//     removeFromCart(item.id);
//     onRemove?.(item.id);
//   };

//   return (
//     <div
//       className={cn(
//         'flex items-center py-4 border-b border-gray-200 dark:border-gray-700',
//         className
//       )}
//       {...props}
//     >
//       <div className="flex-shrink-0 h-24 w-24 overflow-hidden rounded-md">
//         <img
//           src={item.images?.[0] || ''}
//           alt={item.name}
//           className="h-full w-full object-cover object-center"
//         />
//       </div>

//       <div className="ml-4 flex-1">
//         <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
//           <h3>{item.name}</h3>
//           <p className="ml-4">{formatCurrency(item.price * item.quantity)}</p>
//         </div>
//         {item.size && (
//           <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//             Size: {item.size}
//           </p>
//         )}
//         <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//           {formatCurrency(item.price)} each
//         </p>

//         <div className="mt-2 flex items-center">
//           <div className="flex items-center border border-gray-300 rounded-md">
//             <button
//               type="button"
//               onClick={() => handleQuantityChange(item.quantity - 1)}
//               className="px-2 py-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-md"
//               aria-label="Decrease quantity"
//             >
//               <Minus className="h-4 w-4" />
//             </button>
//             <span className="w-8 text-center">{item.quantity}</span>
//             <button
//               type="button"
//               onClick={() => handleQuantityChange(item.quantity + 1)}
//               className="px-2 py-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-md"
//               aria-label="Increase quantity"
//             >
//               <Plus className="h-4 w-4" />
//             </button>
//           </div>

//           <button
//             type="button"
//             onClick={handleRemove}
//             className="ml-4 text-sm font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
//           >
//             Remove
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartItem;
