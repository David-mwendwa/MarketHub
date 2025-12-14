// Product status constants
export const PRODUCT_STATUSES = {
  ACTIVE: 'active',
  PENDING: 'pending',
  DRAFT: 'draft',
  SUSPENDED: 'suspended',
  OUT_OF_STOCK: 'out_of_stock',
  LOW_STOCK: 'low_stock',
  ARCHIVED: 'archived',
};

// Status configuration for UI
export const STATUS_CONFIG = {
  [PRODUCT_STATUSES.ACTIVE]: {
    label: 'Active',
    variant: 'success',
  },
  [PRODUCT_STATUSES.PENDING]: {
    label: 'Pending',
    variant: 'warning',
  },
  [PRODUCT_STATUSES.DRAFT]: {
    label: 'Draft',
    variant: 'outline',
  },
  [PRODUCT_STATUSES.SUSPENDED]: {
    label: 'Suspended',
    variant: 'destructive',
  },
  [PRODUCT_STATUSES.OUT_OF_STOCK]: {
    label: 'Out of Stock',
    variant: 'destructive',
  },
  [PRODUCT_STATUSES.LOW_STOCK]: {
    label: 'Low Stock',
    variant: 'warning',
  },
  [PRODUCT_STATUSES.ARCHIVED]: {
    label: 'Archived',
    variant: 'secondary',
  },
};

// Mock products data
export const MOCK_PRODUCTS = [
  // Active Products
  {
    id: 'prod_1',
    name: 'Wireless Headphones',
    sku: 'WH-1000XM4',
    price: 349.99,
    stock: 45,
    status: 'active',
    isFeatured: true,
    category: 'Electronics',
    seller: 'TechGadgets Inc',
    sellerId: 'seller_1',
    createdAt: '2023-10-15T10:30:00Z',
    updatedAt: '2023-11-20T14:45:00Z',
  },
  {
    id: 'prod_2',
    name: 'Smartphone Pro 13',
    sku: 'SP-13-PRO',
    price: 999.99,
    stock: 32,
    status: 'active',
    isFeatured: true,
    category: 'Electronics',
    seller: 'TechGadgets Inc',
    sellerId: 'seller_1',
    createdAt: '2023-11-10T09:15:00Z',
    updatedAt: '2023-12-01T16:20:00Z',
  },
  // Pending Products
  {
    id: 'prod_3',
    name: 'Wireless Earbuds Pro',
    sku: 'WEB-PRO-2023',
    price: 199.99,
    stock: 0,
    status: 'pending',
    isFeatured: false,
    category: 'Audio',
    seller: 'SoundMasters',
    sellerId: 'seller_2',
    createdAt: '2023-12-01T14:30:00Z',
    updatedAt: '2023-12-05T11:10:00Z',
  },
  // Draft Products
  {
    id: 'prod_4',
    name: 'Mechanical Keyboard V2',
    sku: 'MK-RGB-002',
    price: 159.99,
    stock: 0,
    status: 'draft',
    isFeatured: false,
    category: 'Accessories',
    seller: 'KeyTech',
    sellerId: 'seller_3',
    createdAt: '2023-12-05T08:45:00Z',
    updatedAt: '2023-12-07T10:20:00Z',
  },
  // Suspended Products
  {
    id: 'prod_5',
    name: 'Gaming Mouse X',
    sku: 'GM-X-01',
    price: 89.99,
    stock: 0,
    status: 'suspended',
    isFeatured: false,
    category: 'Gaming',
    seller: 'GameGear',
    sellerId: 'seller_4',
    createdAt: '2023-10-01T10:20:00Z',
    updatedAt: '2023-12-02T15:30:00Z',
  },
  // Out of Stock Products
  {
    id: 'prod_6',
    name: '4K Monitor Pro',
    sku: '4KM-32IN-PRO',
    price: 599.99,
    stock: 0,
    status: 'out_of_stock',
    isFeatured: true,
    category: 'Monitors',
    seller: 'DisplayPro',
    sellerId: 'seller_5',
    createdAt: '2023-11-15T13:10:00Z',
    updatedAt: '2023-12-05T17:25:00Z',
  },
  // Low Stock Products
  {
    id: 'prod_7',
    name: 'Ergonomic Laptop Stand',
    sku: 'LS-ERG-01',
    price: 49.99,
    stock: 3,
    status: 'low_stock',
    isFeatured: true,
    category: 'Accessories',
    seller: 'ErgoTech',
    sellerId: 'seller_6',
    createdAt: '2023-11-20T11:30:00Z',
    updatedAt: '2023-12-06T14:15:00Z',
  },
  // Archived Products
  {
    id: 'prod_8',
    name: 'Old Model Headphones',
    sku: 'WH-900XM3',
    price: 249.99,
    stock: 0,
    status: 'archived',
    isFeatured: false,
    category: 'Audio',
    seller: 'SoundMasters',
    sellerId: 'seller_2',
    createdAt: '2022-05-10T09:30:00Z',
    updatedAt: '2023-11-15T12:45:00Z',
  },
  // More Active Products
  {
    id: 'prod_9',
    name: 'Bluetooth Speaker',
    sku: 'BT-SPK-01',
    price: 129.99,
    stock: 25,
    status: 'active',
    isFeatured: false,
    category: 'Audio',
    seller: 'SoundMasters',
    sellerId: 'seller_2',
    createdAt: '2023-11-25T14:30:00Z',
    updatedAt: '2023-12-05T11:10:00Z',
  },
  // Another Pending Product
  {
    id: 'prod_10',
    name: 'Gaming Keyboard',
    sku: 'GK-MECH-01',
    price: 129.99,
    stock: 0,
    status: 'pending',
    isFeatured: true,
    category: 'Gaming',
    seller: 'GameGear',
    sellerId: 'seller_4',
    createdAt: '2023-12-01T10:20:00Z',
    updatedAt: '2023-12-07T15:45:00Z',
  },
];

/**
 * Get the status configuration for a product
 * @param {Object} product - The product object
 * @returns {Object} Status configuration with label and variant
 */
export const getProductStatusConfig = (product) => {
  const status = getProductStatus(product);
  return STATUS_CONFIG[status] || { label: status, variant: 'outline' };
};

/**
 * Determine the stock status based on stock level
 * @param {number} stock - Current stock level
 * @returns {string} Stock status
 */
export const getStockStatus = (stock) => {
  if (stock === 0) return PRODUCT_STATUSES.OUT_OF_STOCK;
  if (stock <= 10) return PRODUCT_STATUSES.LOW_STOCK;
  return PRODUCT_STATUSES.ACTIVE;
};

/**
 * Get the effective status of a product
 * @param {Object} product - The product object
 * @returns {string} The effective status
 */
export const getProductStatus = (product) => {
  if (
    product.status === PRODUCT_STATUSES.ARCHIVED ||
    product.status === PRODUCT_STATUSES.SUSPENDED
  ) {
    return product.status;
  }
  return getStockStatus(product.stock);
};

/**
 * Filter products based on filters
 * @param {Array} products - Array of products to filter
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered products
 */
export const filterProducts = (products, filters = {}) => {
  return products.filter((product) => {
    // Status filter
    if (
      filters.status &&
      filters.status !== 'all' &&
      getProductStatus(product) !== filters.status
    ) {
      return false;
    }

    // Category filter
    if (
      filters.category &&
      filters.category !== 'all' &&
      product.category !== filters.category
    ) {
      return false;
    }

    // Featured filter
    if (filters.featured && !product.isFeatured) {
      return false;
    }

    // Search query
    if (filters.search) {
      const query = filters.search.toLowerCase();
      const matchesName = product.name.toLowerCase().includes(query);
      const matchesSku = product.sku.toLowerCase().includes(query);
      if (!matchesName && !matchesSku) return false;
    }

    // Seller filter (for admin views)
    if (filters.sellerId && product.sellerId !== filters.sellerId) {
      return false;
    }

    return true;
  });
};

/**
 * Sort products based on sort configuration
 * @param {Array} products - Array of products to sort
 * @param {Object} sortConfig - Sort configuration
 * @returns {Array} Sorted products
 */
export const sortProducts = (products, sortConfig) => {
  const { key, direction } = sortConfig;
  if (!key) return [...products];

  return [...products].sort((a, b) => {
    let aValue = a[key];
    let bValue = b[key];

    // Handle nested properties if needed
    if (key === 'status') {
      aValue = getProductStatus(a);
      bValue = getProductStatus(b);
    }

    // Handle different data types
    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();

    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Get unique categories from products
 * @param {Array} products - Array of products
 * @returns {Array} Unique categories
 */
export const getUniqueCategories = (products) => {
  return ['all', ...new Set(products.map((p) => p.category).filter(Boolean))];
};
