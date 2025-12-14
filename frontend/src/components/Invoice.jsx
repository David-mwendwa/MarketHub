import React, { forwardRef, useImperativeHandle } from 'react';
import { format } from 'date-fns';

const Invoice = forwardRef(({ order, statusConfig }, ref) => {
  // Expose the component's DOM node via the ref
  useImperativeHandle(ref, () => ({
    // This makes the component compatible with react-to-print
    getPrintableContent: () => document.getElementById('invoice-print-content'),
  }));

  // If no order is provided, don't render anything
  if (!order) return null;
  const statusInfo = statusConfig[order.status] || statusConfig.processing;
  const currentDate = format(new Date(), 'MMMM d, yyyy');
  const orderDate = order.date
    ? format(new Date(order.date), 'MMMM d, yyyy')
    : currentDate;

  return (
    <div
      id='invoice-print-content'
      className='p-8 max-w-4xl mx-auto bg-white text-gray-800'>
      {/* Header */}
      <div className='flex justify-between items-start mb-8'>
        <div>
          <h1 className='text-2xl font-bold'>INVOICE</h1>
          <p className='text-gray-600'>Order #{order.id}</p>
        </div>
        <div className='text-right'>
          <p className='text-lg font-semibold'>Your Store Name</p>
          <p className='text-sm text-gray-600'>123 Store Street</p>
          <p className='text-sm text-gray-600'>City, State 12345</p>
          <p className='text-sm text-gray-600'>store@example.com</p>
        </div>
      </div>

      {/* Order Info */}
      <div className='grid grid-cols-2 gap-8 mb-8'>
        <div>
          <h2 className='text-lg font-semibold mb-2'>Bill To:</h2>
          <p className='font-medium'>{order.customer}</p>
          <p className='text-gray-700'>{order.email}</p>
          <p className='text-gray-700'>{order.phone}</p>
          <div className='mt-2'>
            <p className='text-gray-700'>{order.shippingAddress?.street}</p>
            <p className='text-gray-700'>
              {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
              {order.shippingAddress?.zip}
            </p>
            <p className='text-gray-700'>{order.shippingAddress?.country}</p>
          </div>
        </div>
        <div className='text-right'>
          <div className='mb-4'>
            <p className='font-medium'>Invoice Date:</p>
            <p className='text-gray-700'>{currentDate}</p>
          </div>
          <div className='mb-4'>
            <p className='font-medium'>Order Date:</p>
            <p className='text-gray-700'>{orderDate}</p>
          </div>
          <div>
            <p className='font-medium'>Status:</p>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.text}`}>
              {statusInfo.icon}
              <span className='ml-1'>{statusInfo.label}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className='mb-8'>
        <h2 className='text-lg font-semibold mb-4'>Order Items</h2>
        <div className='border rounded-lg overflow-hidden'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Item
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Price
                </th>
                <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Qty
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Total
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {order.items?.map((item) => (
                <tr key={item.id}>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-gray-900'>
                          {item.name}
                        </div>
                        <div className='text-sm text-gray-500'>
                          SKU: {item.sku || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500'>
                    ${item.price.toFixed(2)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500'>
                    {item.quantity}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Summary */}
      <div className='flex justify-end'>
        <div className='w-64'>
          <div className='flex justify-between py-2'>
            <span className='text-gray-600'>Subtotal:</span>
            <span>${order.subtotal?.toFixed(2) || '0.00'}</span>
          </div>
          <div className='flex justify-between py-2'>
            <span className='text-gray-600'>Shipping:</span>
            <span>${order.shippingCost?.toFixed(2) || '0.00'}</span>
          </div>
          <div className='flex justify-between py-2'>
            <span className='text-gray-600'>Tax:</span>
            <span>${order.tax?.toFixed(2) || '0.00'}</span>
          </div>
          <div className='border-t border-gray-200 my-2'></div>
          <div className='flex justify-between py-2 text-lg font-bold'>
            <span>Total:</span>
            <span>${order.total?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500'>
        <p>Thank you for your business!</p>
        <p className='mt-1'>
          If you have any questions about this invoice, please contact
        </p>
        <p>support@yourstore.com or call (123) 456-7890</p>
      </div>
    </div>
  );
});

Invoice.displayName = 'Invoice';

export default Invoice;
