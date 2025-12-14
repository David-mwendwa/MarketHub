import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Package, CheckCircle, Clock, XCircle, Truck } from 'lucide-react';

const statusIcons = {
  processing: <Clock className="h-5 w-5 text-yellow-500" />,
  shipped: <Truck className="h-5 w-5 text-blue-500" />,
  delivered: <CheckCircle className="h-5 w-5 text-green-500" />,
  cancelled: <XCircle className="h-5 w-5 text-red-500" />
};

const statusColors = {
  processing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500',
  shipped: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
};

const OrderList = ({ orders = [] }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No orders yet</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          You haven't placed any orders yet.
        </p>
        <div className="mt-6">
          <Link
            to="/shop"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg"
        >
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Order #{order.orderNumber}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <span
              className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}
            >
              {statusIcons[order.status] || <Package className="h-4 w-4 mr-1" />}
              <span className="ml-1 capitalize">{order.status}</span>
            </span>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Order Total</h4>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(order.total)}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Method</h4>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {order.paymentMethod?.cardBrand} ending in {order.paymentMethod?.last4}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Shipping Address</h4>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}
                </p>
              </div>
              <div className="flex items-end">
                <Link
                  to={`/account/orders/${order.id}`}
                  className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  View Order Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;