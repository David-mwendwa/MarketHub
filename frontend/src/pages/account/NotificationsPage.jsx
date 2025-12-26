import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import {
  Bell,
  Mail,
  AlertCircle,
  Check,
  Trash2,
  X,
  ShoppingBag,
  Tag,
  Shield,
  MessageSquare,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ROUTES } from '../../constants/routes';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Order Shipped',
      message: 'Your order #12345 has been shipped and is on its way to you.',
      type: 'order',
      referenceId: '12345',
      icon: <ShoppingBag className='h-5 w-5 text-blue-600' />,
      read: false,
      date: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    },
    {
      id: 2,
      title: 'New Message',
      message: 'You have a new message from the seller about your order.',
      type: 'message',
      referenceId: 'convo-123',
      icon: <MessageSquare className='h-5 w-5 text-green-600' />,
      read: false,
      date: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    },
    {
      id: 3,
      title: 'Special Offer',
      message: 'New deals available! Get 20% off on selected items.',
      type: 'promotion',
      referenceId: 'promo-456',
      icon: <Tag className='h-5 w-5 text-yellow-600' />,
      read: true,
      date: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    },
    {
      id: 4,
      title: 'Security Alert',
      message: 'New login detected from a new device.',
      type: 'security',
      referenceId: 'login-attempt-789',
      icon: <Shield className='h-5 w-5 text-red-600' />,
      read: true,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
  ]);

  const handleNotificationClick = (notification) => {
    // Mark as read
    setNotifications(
      notifications.map((n) =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );

    // Handle click based on notification type
    const notificationMessages = {
      order: 'Order details will be available soon!',
      message: 'Messaging feature coming soon!',
      security: 'Security settings will be available soon!',
      promotion: 'Viewing promotion details',
    };

    const message =
      notificationMessages[notification.type] || 'Notification clicked';

    toast(
      <div className='flex flex-col gap-1'>
        <div className='font-semibold text-white'>ℹ️ {notification.title}</div>
        <p className='text-sm text-gray-300'>{message}</p>
      </div>,
      {
        style: {
          borderRadius: '0.75rem',
          background: '#111827',
          color: '#fff',
          border: '1px solid #374151',
          padding: '1rem',
          maxWidth: '380px',
        },
        duration: 3000,
      }
    );
  };

  const markAsRead = (id, e) => {
    e.stopPropagation(); // Prevent triggering the parent click
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
    toast(
      <div className='flex flex-col gap-1'>
        <div className='font-semibold text-white'>✓ All Read</div>
        <p className='text-sm text-gray-300'>
          All notifications have been marked as read.
        </p>
      </div>,
      {
        style: {
          borderRadius: '0.75rem',
          background: '#111827',
          color: '#fff',
          border: '1px solid #374151',
          padding: '1rem',
          maxWidth: '380px',
        },
        duration: 3000,
      }
    );
  };

  const deleteNotification = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
    toast(
      <div className='flex flex-col gap-1'>
        <div className='font-semibold text-white'>🗑️ Notification Deleted</div>
        <p className='text-sm text-gray-300'>
          The notification has been removed.
        </p>
      </div>,
      {
        style: {
          borderRadius: '0.75rem',
          background: '#111827',
          color: '#fff',
          border: '1px solid #374151',
          padding: '1rem',
          maxWidth: '380px',
        },
        duration: 3000,
      }
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast(
      <div className='flex flex-col gap-1'>
        <div className='font-semibold text-white'>✖️ All Cleared</div>
        <p className='text-sm text-gray-300'>
          All notifications have been cleared.
        </p>
      </div>,
      {
        style: {
          borderRadius: '0.75rem',
          background: '#111827',
          color: '#fff',
          border: '1px solid #374151',
          padding: '1rem',
          maxWidth: '380px',
        },
        duration: 3000,
      }
    );
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Notifications
          </h1>
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            Your recent notifications and alerts
          </p>
        </div>
        {notifications.length > 0 && (
          <div className='flex space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={markAllAsRead}
              disabled={notifications.every((n) => n.read)}>
              <Check className='h-4 w-4 mr-2' />
              Mark all as read
            </Button>
            <Button variant='outline' size='sm' onClick={clearAllNotifications}>
              <Trash2 className='h-4 w-4 mr-2' />
              Clear all
            </Button>
          </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className='text-center py-12'>
          <Bell className='h-12 w-12 mx-auto text-gray-400' />
          <h3 className='mt-2 text-lg font-medium text-gray-900 dark:text-white'>
            No notifications
          </h3>
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            You don't have any notifications yet.
          </p>
        </div>
      ) : (
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'>
          <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''} cursor-pointer transition-colors duration-150`}
                onClick={() => handleNotificationClick(notification)}>
                <div className='flex items-start'>
                  <div className='flex-shrink-0 pt-0.5'>
                    <div className='p-2 rounded-full bg-gray-100 dark:bg-gray-700'>
                      {notification.icon}
                    </div>
                  </div>
                  <div className='ml-3 flex-1 min-w-0'>
                    <div className='flex justify-between'>
                      <p className='text-sm font-medium text-gray-900 dark:text-white'>
                        {notification.title}
                        {!notification.read && (
                          <span className='ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'>
                            New
                          </span>
                        )}
                      </p>
                      <div className='flex space-x-2'>
                        {!notification.read && (
                          <button
                            onClick={(e) => markAsRead(notification.id, e)}
                            className='text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
                            title='Mark as read'>
                            <Check className='h-4 w-4' />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className='text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400'
                          title='Delete'>
                          <X className='h-4 w-4' />
                        </button>
                      </div>
                    </div>
                    <p className='mt-1 text-sm text-gray-600 dark:text-gray-300'>
                      {notification.message}
                    </p>
                    <div className='mt-1 flex justify-between items-center'>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>
                        {formatDistanceToNow(notification.date, {
                          addSuffix: true,
                        })}
                      </p>
                      <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'>
                        {notification.type.charAt(0).toUpperCase() +
                          notification.type.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
