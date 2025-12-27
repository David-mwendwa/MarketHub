import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/UICard';
import { ROUTES } from '../../../constants/routes';
import { ICONS } from '../../../constants/icons';
// import * as LucideIcons from 'lucide-react';
import {
  Heart,
  ArrowLeft,
  ShoppingBag,
  X,
  Trash2,
} from 'lucide-react';
import { useWishlist } from '../../../contexts/WishListContext';
import { useCart } from '../../../contexts/CartContext';
import { formatCurrency } from '../../../lib/utils';
import { toast } from 'sonner';

// Create a mapping of icon names to their Lucide components
const Icon = ({ name, ...props }) => {
  const LucideIcon = LucideIcons[ICONS[name]] || LucideIcons['HelpCircle'];
  return <LucideIcon {...props} />;
};

const Wishlist = () => {
  const { items: wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [showNoteInput, setShowNoteInput] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Transform wishlist items to match the expected format
  const items = useMemo(() => {
    return wishlistItems.map((item) => {
      // Safely get stock quantity, handling both nested and flat structures
      const stockObj = item.stock || {};
      const stockQty =
        typeof stockObj === 'number' ? stockObj : stockObj.qty || 0;
      const inStock =
        Number(stockQty) > 0 && stockObj.status !== 'out_of_stock';

      return {
        id: item._id,
        productId: item._id,
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice || item.price * 1.1, // Add 10% as original price if not provided
        image: item.image || '/placeholder-product.jpg',
        inStock,
        stockQty, // Store just the quantity number
        stockStatus: stockObj.status || (inStock ? 'in_stock' : 'out_of_stock'),
        rating: item.rating || 4.0, // Default rating if not provided
        reviewCount: item.reviewCount || 0,
        addedDate: item.addedDate || new Date().toISOString().split('T')[0],
        note: item.note || '',
        ...item, // Spread the rest of the item properties
      };
    });
  }, [wishlistItems]);

  // Handle item removal from wishlist
  const handleRemoveFromWishlist = (itemId, e) => {
    e?.stopPropagation();
    removeFromWishlist(itemId);
  };

  // Handle item selection
  const toggleItemSelection = (itemId, e) => {
    // Prevent event propagation to avoid triggering parent click events
    e?.stopPropagation();
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Select all items
  const selectAllItems = (e) => {
    if (e.target.checked) {
      setSelectedItems(items.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Remove items from wishlist
  const removeSelectedItems = (itemIds = selectedItems) => {
    setIsLoading(true);
    // In a real app, this would remove items via API

    // Simulate API call
    setTimeout(() => {
      setItems((prev) => prev.filter((item) => !itemIds.includes(item.id)));
      setSelectedItems((prev) => prev.filter((id) => !itemIds.includes(id)));
      setIsLoading(false);
      // Reset note input if it was open for a removed item
      if (showNoteInput && itemIds.includes(showNoteInput)) {
        setShowNoteInput(null);
      }
    }, 500);
  };

  // Move items to cart
  const handleAddToCart = async (product) => {
    try {
      setIsAddingToCart(true);
      await addToCart({
        _id: product.productId,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: {
          qty: product.stockQty,
          status: product.stockStatus,
        },
        quantity: 1,
      });
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error(error.message || 'Failed to add item to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddSelectedToCart = async () => {
    if (selectedItems.length === 0) return;

    try {
      setIsAddingToCart(true);
      const selectedProducts = items.filter((item) =>
        selectedItems.includes(item.id)
      );

      for (const product of selectedProducts) {
        await handleAddToCart(product);
      }

      // Remove selected items from wishlist after adding to cart
      selectedItems.forEach((id) => removeFromWishlist(id));
      setSelectedItems([]);

      toast.success(`${selectedProducts.length} item(s) added to cart`);
    } catch (error) {
      console.error('Failed to add items to cart:', error);
      toast.error('Failed to add some items to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Toggle note input
  const toggleNoteInput = (itemId, currentNote = '', e) => {
    if (e) e.stopPropagation();
    setShowNoteInput(showNoteInput === itemId ? null : itemId);
    setNoteText(currentNote);
  };

  // Save note
  const saveNote = (itemId) => {
    if (!noteText.trim()) return;

    setIsLoading(true);
    // In a real app, this would save the note via API

    // Simulate API call
    setTimeout(() => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, note: noteText } : item
        )
      );
      setShowNoteInput(null);
      setIsLoading(false);
    }, 300);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Sort items
  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.addedDate) - new Date(a.addedDate);
    } else if (sortBy === 'price-low') {
      return a.price - b.price;
    } else if (sortBy === 'price-high') {
      return b.price - a.price;
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
            My Wishlist
          </h2>
          <p className='text-gray-500 dark:text-gray-400'>
            {items.length} {items.length === 1 ? 'item' : 'items'} in your
            wishlist
          </p>
        </div>
        <div className='mt-4 md:mt-0'>
          <div className='relative'>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className='block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500'
              aria-label='Sort wishlist items'>
              <option value='recent'>Recently Added</option>
              <option value='price-low'>Price: Low to High</option>
              <option value='price-high'>Price: High to Low</option>
              <option value='name'>Name: A to Z</option>
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300'>
              <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className='text-center py-8 px-4 sm:px-6 lg:px-8 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700'>
          <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-3'>
            <Heart className='h-6 w-6 text-gray-400' />
          </div>
          <h3 className='text-base font-medium text-gray-900 dark:text-white mb-1.5'>
            Your wishlist is empty
          </h3>
          <p className='text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto'>
            Save items you love to your wishlist and check back later.
          </p>
          <Button
            asChild
            variant='default'
            size='sm'
            className='inline-flex items-center'>
            <Link to={ROUTES.SHOP}>
              <ArrowLeft className='h-3.5 w-3.5 mr-1.5' />
              Continue Shopping
            </Link>
          </Button>
        </div>
      ) : (
        <>
          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className='rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-900/20'>
              <div className='flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
                <div className='flex items-center'>
                  <span className='font-medium text-blue-800 dark:text-blue-200'>
                    {selectedItems.length}{' '}
                    {selectedItems.length === 1 ? 'item' : 'items'} selected
                  </span>
                  <button
                    type='button'
                    onClick={() => setSelectedItems([])}
                    className='ml-3 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'>
                    Clear selection
                  </button>
                </div>
                <div className='flex flex-wrap items-center gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleAddSelectedToCart}
                    disabled={isLoading || isAddingToCart}
                    className='inline-flex items-center border-blue-200 text-blue-700 hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/30 dark:focus:ring-blue-500 dark:focus:ring-offset-gray-800'>
                    {isLoading ? (
                      <>
                        <svg
                          className='-ml-1 mr-2 h-4 w-4 animate-spin'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'>
                          <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'></circle>
                          <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                        </svg>
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingBag className='h-4 w-4 mr-2' />
                        Add to Cart ({selectedItems.length})
                      </>
                    )}
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => removeSelectedItems(selectedItems)}
                    disabled={isLoading}
                    className='inline-flex items-center border-red-200 text-red-600 hover:bg-red-50 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 dark:focus:ring-red-500 dark:focus:ring-offset-gray-800'>
                    <X className='h-4 w-4' />
                    Remove ({selectedItems.length})
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Wishlist Items */}
          <div className='grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className={`h-full ${selectedItems.includes(item.id) ? 'p-[2px] bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg' : ''}`}>
                <Card
                  className={`h-full flex flex-col group relative transition-all duration-200 hover:shadow-lg dark:border-gray-700 dark:hover:shadow-gray-800/20 ${
                    selectedItems.includes(item.id)
                      ? 'ring-0 border-0'
                      : 'hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={(e) => {
                    // Only trigger selection if clicking on the card but not on interactive elements
                    if (
                      !e.target.closest('a, button, input, [role="button"]')
                    ) {
                      toggleItemSelection(item.id, e);
                    }
                  }}>
                  <button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSelectedItems([item.id]);
                    }}
                    className='absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-500 opacity-0 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:bg-gray-800/80 dark:text-gray-400 dark:hover:bg-red-900/50 dark:hover:text-red-400'
                    aria-label='Remove item'>
                    <X className='h-4 w-4' />
                  </button>

                  <div className='p-4'>
                    <div className='flex items-start'>
                      <div className='mr-3 pt-1.5'>
                        <input
                          type='checkbox'
                          className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800'
                          checked={selectedItems.includes(item.id)}
                          onChange={(e) => toggleItemSelection(item.id, e)}
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Select ${item.name}`}
                        />
                      </div>

                      <div className='flex-1'>
                        <div className='flex flex-col sm:flex-row'>
                          <Link
                            to={`/product/${item.productId}`}
                            className='group/block h-32 w-full flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 sm:h-24 sm:w-24'
                            onClick={(e) => e.stopPropagation()}>
                            <img
                              src={item.image}
                              alt={item.name}
                              className='h-full w-full object-cover object-center transition-transform duration-200 group-hover/block:scale-105'
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  'https://via.placeholder.com/150?text=No+Image';
                              }}
                              loading='lazy'
                            />
                          </Link>

                          <div className='mt-3 sm:ml-4 sm:mt-0 sm:flex-1'>
                            <div className='flex justify-between'>
                              <h3 className='text-sm font-medium text-gray-900 dark:text-white'>
                                <Link
                                  to={`/product/${item.productId}`}
                                  className='line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400'
                                  onClick={(e) => e.stopPropagation()}>
                                  {item.name}
                                </Link>
                              </h3>
                            </div>

                            {/* Price */}
                            <div className='mt-1 relative'>
                              {item.specialPrice < item.price ||
                              item.originalPrice > item.price ? (
                                <div className='flex flex-wrap items-baseline'>
                                  <span className='text-base font-semibold text-red-600 dark:text-red-400'>
                                    {formatCurrency(
                                      item.specialPrice || item.price
                                    )}
                                  </span>
                                  <span className='ml-2 text-sm text-gray-500 line-through dark:text-gray-400'>
                                    {formatCurrency(
                                      item.originalPrice || item.price
                                    )}
                                  </span>
                                  <span className='ml-2 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-full'>
                                    {Math.round(
                                      (1 -
                                        (item.specialPrice || item.price) /
                                          (item.originalPrice || item.price)) *
                                        100
                                    )}
                                    % OFF
                                  </span>
                                </div>
                              ) : (
                                <div className='flex items-center'>
                                  <span className='text-base font-semibold text-gray-900 dark:text-white'>
                                    {formatCurrency(item.price)}
                                  </span>
                                  <span className='ml-2 text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full'>
                                    0% OFF
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Rating */}
                            <div className='mt-1 flex items-center'>
                              <div className='flex items-center'>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <svg
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= Math.floor(item.rating)
                                        ? 'text-yellow-400'
                                        : 'text-gray-300 dark:text-gray-600'
                                    }`}
                                    fill='currentColor'
                                    viewBox='0 0 20 20'>
                                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                                  </svg>
                                ))}
                                <span className='ml-1 text-xs text-gray-500'>
                                  ({item.reviewCount})
                                </span>
                              </div>
                            </div>
                            <div className='mt-2'>
                              {item.stockStatus === 'pre_order' ? (
                                <span className='inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/80 dark:text-blue-200'>
                                  Available for Pre-order
                                </span>
                              ) : item.inStock ? (
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    item.stockQty <= 10
                                      ? item.stockQty <= 5
                                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/80 dark:text-amber-200 font-semibold'
                                        : 'bg-amber-50 text-amber-700 dark:bg-amber-900/60 dark:text-amber-200'
                                      : 'bg-green-100 text-green-800 dark:bg-green-900/80 dark:text-green-200'
                                  }`}>
                                  {item.stockQty <= 10
                                    ? `Only ${item.stockQty} left!`
                                    : 'In Stock'}
                                </span>
                              ) : (
                                <span className='inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/80 dark:text-red-200'>
                                  Out of Stock
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Note Section */}
                        <div className='mt-4'>
                          {showNoteInput === item.id ? (
                            <div className='space-y-2'>
                              <textarea
                                rows='2'
                                className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white'
                                placeholder='Add a note...'
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                              />
                              <div className='flex justify-end space-x-2'>
                                <Button
                                  variant='outline'
                                  size='sm'
                                  onClick={() => setShowNoteInput(null)}>
                                  Cancel
                                </Button>
                                <Button
                                  size='sm'
                                  onClick={() => saveNote(item.id)}>
                                  Save Note
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className='flex items-center justify-between'>
                              <div className='text-sm text-gray-500'>
                                {item.note ? (
                                  <div className='group relative'>
                                    <span
                                      className='cursor-pointer hover:underline'
                                      onClick={() =>
                                        toggleNoteInput(item.id, item.note)
                                      }>
                                      Note: "{item.note}"
                                    </span>
                                    <button
                                      onClick={() =>
                                        toggleNoteInput(item.id, item.note)
                                      }
                                      className='ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'>
                                      <svg
                                        className='h-3.5 w-3.5 inline-block'
                                        fill='none'
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'>
                                        <path
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                          strokeWidth={2}
                                          d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => toggleNoteInput(item.id, '')}
                                    className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm'>
                                    + Add Note
                                  </button>
                                )}
                              </div>
                              <div className='text-xs text-gray-400'>
                                Added on {formatDate(item.addedDate)}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='mt-auto border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-3 sm:px-6'>
                    <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0'>
                      <Button
                        variant='outline'
                        size='sm'
                        className='w-full sm:w-auto'
                        onClick={() => toggleItemSelection(item.id)}>
                        {selectedItems.includes(item.id)
                          ? 'Deselect'
                          : 'Select'}
                      </Button>
                      <div className='flex space-x-2 w-full sm:w-auto'>
                        <Button
                          variant='outline'
                          size='sm'
                          className='w-1/2 sm:w-auto min-w-[120px]'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item);
                          }}
                          disabled={!item.inStock || isAddingToCart}>
                          {isAddingToCart ? (
                            <>
                              <svg
                                className='animate-spin -ml-1 mr-2 h-4 w-4'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'>
                                <circle
                                  className='opacity-25'
                                  cx='12'
                                  cy='12'
                                  r='10'
                                  stroke='currentColor'
                                  strokeWidth='4'></circle>
                                <path
                                  className='opacity-75'
                                  fill='currentColor'
                                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                              </svg>
                              Adding...
                            </>
                          ) : item.inStock ? (
                            'Add to Cart'
                          ) : (
                            'Out of Stock'
                          )}
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                          onClick={(e) =>
                            handleRemoveFromWishlist(item._id, e)
                          }>
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {/* Empty state when all items are removed */}
          {items.length === 0 && (
            <div className='text-center py-8 px-4 sm:px-6 lg:px-8 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700'>
              <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-3'>
                <Heart className='h-6 w-6 text-gray-400' />
              </div>
              <h3 className='text-base font-medium text-gray-900 dark:text-white mb-1.5'>
                Your wishlist is empty
              </h3>
              <p className='text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto'>
                The items you removed are no longer in your wishlist.
              </p>
              <Button
                asChild
                variant='default'
                size='sm'
                className='inline-flex items-center'>
                <Link to={ROUTES.SHOP}>
                  <ArrowLeft className='h-3.5 w-3.5 mr-1.5' />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Wishlist;
