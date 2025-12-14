import {
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Lock,
  UserCheck,
  UserX,
  Package,
  Truck,
  Check,
  X,
  AlertTriangle,
  ArrowLeftRight,
} from 'lucide-react';

// User Account Status
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  LOCKED: 'locked',
};

export const USER_STATUS_CONFIG = {
  [USER_STATUS.ACTIVE]: {
    label: 'Active',
    icon: <UserCheck className='h-4 w-4' />,
    color: 'green',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    textColor: 'text-green-800 dark:text-green-200',
  },
  [USER_STATUS.INACTIVE]: {
    label: 'Inactive',
    icon: <Clock className='h-4 w-4' />,
    color: 'gray',
    bgColor: 'bg-gray-100 dark:bg-gray-800/50',
    textColor: 'text-gray-800 dark:text-gray-200',
  },
  [USER_STATUS.SUSPENDED]: {
    label: 'Suspended',
    icon: <AlertTriangle className='h-4 w-4' />,
    color: 'yellow',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    textColor: 'text-yellow-800 dark:text-yellow-200',
  },
  [USER_STATUS.LOCKED]: {
    label: 'Locked',
    icon: <Lock className='h-4 w-4' />,
    color: 'red',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    textColor: 'text-red-800 dark:text-red-200',
  },
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

export const ORDER_STATUS_CONFIG = {
  [ORDER_STATUS.PENDING]: {
    label: 'Pending',
    icon: <Clock className='h-4 w-4' />,
    color: 'yellow',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    textColor: 'text-yellow-800 dark:text-yellow-200',
  },
  [ORDER_STATUS.PROCESSING]: {
    label: 'Processing',
    icon: <Package className='h-4 w-4' />,
    color: 'blue',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    textColor: 'text-blue-800 dark:text-blue-200',
  },
  [ORDER_STATUS.SHIPPED]: {
    label: 'Shipped',
    icon: <Truck className='h-4 w-4' />,
    color: 'indigo',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    textColor: 'text-indigo-800 dark:text-indigo-200',
  },
  [ORDER_STATUS.DELIVERED]: {
    label: 'Delivered',
    icon: <CheckCircle className='h-4 w-4' />,
    color: 'green',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    textColor: 'text-green-800 dark:text-green-200',
  },
  [ORDER_STATUS.CANCELLED]: {
    label: 'Cancelled',
    icon: <XCircle className='h-4 w-4' />,
    color: 'red',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    textColor: 'text-red-800 dark:text-red-200',
  },
  [ORDER_STATUS.REFUNDED]: {
    label: 'Refunded',
    icon: <ArrowLeftRight className='h-4 w-4' />,
    color: 'purple',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    textColor: 'text-purple-800 dark:text-purple-200',
  },
};

// Helper function to get status config
export const getStatusConfig = (type, status) => {
  if (type === 'user') {
    return (
      USER_STATUS_CONFIG[status] || {
        label: status,
        icon: <AlertCircle className='h-4 w-4' />,
        color: 'gray',
        bgColor: 'bg-gray-100 dark:bg-gray-800/50',
        textColor: 'text-gray-800 dark:text-gray-200',
      }
    );
  }

  return (
    ORDER_STATUS_CONFIG[status] || {
      label: status,
      icon: <AlertCircle className='h-4 w-4' />,
      color: 'gray',
      bgColor: 'bg-gray-100 dark:bg-gray-800/50',
      textColor: 'text-gray-800 dark:text-gray-200',
    }
  );
};
