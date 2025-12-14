/**
 * ROUTES - URL Path Constants
 *
 * Defines all URL paths used in the application's routing.
 * Used by React Router for navigation and route matching.
 *
 * Structure:
 * - Use UPPER_SNAKE_CASE for constant names
 * - Group related routes under nested objects
 * - Keep paths consistent and centralized here
 */
export const ROUTES = {
  // Public routes
  HOME: '/',
  SHOP: '/shop',
  ABOUT: '/about',
  CONTACT: '/contact',
  SEARCH: '/search',
  CATEGORIES: '/categories',
  PRODUCT: '/product/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Protected routes
  PROFILE: '/profile',
  SETTINGS: '/settings',
  HELP: '/help',

  // Account section routes
  ACCOUNT: {
    BASE: '/account',
    PROFILE: '/account/profile',
    SETTINGS: '/account/settings',
    SECURITY: '/account/security',
  },

  // Dashboard routes
  DASHBOARD: {
    // Admin routes
    ADMIN: '/dashboard/admin',
    ADMIN_USERS: '/dashboard/admin/users',
    ADMIN_PRODUCTS: '/dashboard/admin/products',
    ADMIN_ORDERS: '/dashboard/admin/orders',
    ADMIN_ANALYTICS: '/dashboard/admin/analytics',
    ADMIN_CATEGORIES: '/dashboard/admin/categories',
    ADMIN_ADD_CATEGORY: '/dashboard/admin/categories/new',
    ADMIN_EDIT_CATEGORY: '/dashboard/admin/categories/:id/edit',

    // Seller routes
    SELLER: '/dashboard/seller',
    SELLER_PRODUCTS: '/dashboard/seller/products',
    SELLER_PRODUCT_NEW: '/dashboard/seller/products/new',
    SELLER_PRODUCT_DETAILS: '/dashboard/seller/products/:productId',
    SELLER_ORDERS: '/dashboard/seller/orders',
    SELLER_ORDER_DETAILS: '/dashboard/seller/orders/:orderId',
    SELLER_ANALYTICS: '/dashboard/seller/analytics',

    // Buyer routes
    BUYER: '/dashboard/buyer',
    BUYER_ORDERS: '/dashboard/buyer/orders',
    BUYER_WISHLIST: '/dashboard/buyer/wishlist',
    BUYER_ADDRESSES: '/dashboard/buyer/addresses',
    BUYER_PAYMENTS: '/dashboard/buyer/payments',
  },

  // Profile sub-routes
  PROFILE_ADDRESSES: '/profile/addresses',
  PROFILE_PAYMENT_METHODS: '/profile/payment-methods',

  // Order
  ORDER_CONFIRMATION: '/order/confirmation',

  // Other
  NOT_FOUND: '/404',
  PRIVACY_POLICY: '/privacy',
  TERMS: '/terms',
  DELIVERY_RETURNS: '/delivery-returns',
  FAQ: '/faq',
};

export const NAV_ITEMS = {
  main: [
    { name: 'Home', path: '/', exact: true },
    { name: 'Shop', path: '/shop' },
    { name: 'Categories', path: '/categories' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ],
  auth: [
    { name: 'Login', path: '/login', guestOnly: true },
    { name: 'Register', path: '/register', guestOnly: true },
  ],
};

/**
 * DASHBOARD_LINKS - Navigation Menu Configuration
 *
 * Defines the navigation structure for dashboard menus, organized by user role.
 * Each role has an array of navigation items with:
 * - name: Display text in the navigation
 * - path: URL path (should match ROUTES)
 * - icon: Icon identifier from the icon library (e.g., 'Grid', 'Users')
 *
 * Usage:
 * - Import and use in dashboard layout components
 * - Filter by user role to show appropriate navigation
 */
export const DASHBOARD_LINKS = {
  admin: [
    { name: 'Overview', path: '/dashboard/admin', icon: 'Grid' },
    { name: 'Users', path: '/dashboard/admin/users', icon: 'Users' },
    { name: 'Products', path: '/dashboard/admin/products', icon: 'Package' },
    { name: 'Categories', path: '/dashboard/admin/categories', icon: 'List' },
    { name: 'Orders', path: '/dashboard/admin/orders', icon: 'ShoppingBag' },
    {
      name: 'Analytics',
      path: '/dashboard/admin/analytics',
      icon: 'BarChart2',
    },
  ],
  seller: [
    { name: 'Overview', path: '/dashboard/seller', icon: 'LayoutDashboard' },
    { name: 'Products', path: '/dashboard/seller/products', icon: 'Package' },
    { name: 'Orders', path: '/dashboard/seller/orders', icon: 'ShoppingBag' },
    {
      name: 'Analytics',
      path: '/dashboard/seller/analytics',
      icon: 'BarChart2',
    },
  ],
  buyer: [
    { name: 'Orders', path: '/dashboard/buyer/orders', icon: 'ShoppingBag' },
    { name: 'Wishlist', path: '/dashboard/buyer/wishlist', icon: 'Heart' },
    { name: 'Addresses', path: '/dashboard/buyer/addresses', icon: 'MapPin' },
    {
      name: 'Payment Methods',
      path: '/dashboard/buyer/payments',
      icon: 'CreditCard',
    },
  ],
};

export const USER_MENU_ITEMS = {
  common: [
    {
      name: 'My Profile',
      path: '/profile',
      icon: 'User',
      description: 'View and edit your profile',
    },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: 'Bell',
      description: 'Your alerts and updates',
      badge: true,
    },
  ],
  admin: [
    {
      name: 'Admin Dashboard',
      path: '/dashboard/admin',
      icon: 'Shield',
      description: 'Administrator controls',
      divider: true,
    },
  ],
  seller: [
    {
      name: 'Seller Dashboard',
      path: '/dashboard/seller',
      icon: 'BarChart2',
      description: 'Seller overview',
      divider: true,
    },
  ],
  buyer: [
    {
      name: 'My Orders',
      path: '/dashboard/buyer/orders',
      icon: 'ShoppingBag',
      description: 'Track and manage orders',
      divider: true,
    },
  ],
  bottom: [
    {
      name: 'Settings',
      path: '/settings',
      icon: 'Settings',
      description: 'Account and app settings',
      divider: true,
    },
    {
      name: 'Help & Support',
      path: '/help',
      icon: 'HelpCircle',
      description: 'Get help and support',
    },
    {
      name: 'Sign out',
      path: '/logout',
      icon: 'LogOut',
      danger: true,
    },
  ],
};

export const PROTECTED_ROUTES = {
  admin: ['/dashboard/admin', '/dashboard/admin/*'],
  seller: ['/dashboard/seller', '/dashboard/seller/*'],
  buyer: ['/dashboard/buyer', '/dashboard/buyer/*', '/profile', '/settings'],
};

export const PUBLIC_ROUTES = [
  '/',
  '/shop',
  '/about',
  '/contact',
  '/search',
  '/categories',
  '/product/*',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/privacy',
  '/terms',
  '/delivery-returns',
  '/faq',
];
