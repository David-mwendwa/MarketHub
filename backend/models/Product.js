import mongoose from 'mongoose';
const { Schema } = mongoose;

/*
 * PRODUCTION NOTES:
 * - Use a currency conversion API for live exchange rates
 * - Implement rate caching to reduce API calls
 * - Handle rate updates and edge cases (e.g., API failures)
 * - Consider using a service like Fixer, ExchangeRate-API, or Open Exchange Rates
 */

// Currency constants
const CURRENCIES = {
  KSH: 'KSH', // Kenyan Shilling
  TZS: 'TZS', // Tanzanian Shilling
  UGX: 'UGX', // Ugandan Shilling
  USD: 'USD', // US Dollar
};

// Sub-schemas
const variationSchema = new Schema(
  {
    name: { type: String, required: [true, 'Variation name is required'] },
    values: [
      {
        type: String,
        validate: {
          validator: function (v) {
            return v && v.length > 0;
          },
          message: 'At least one variation value is required',
        },
      },
    ],
    price: {
      amount: {
        type: Number,
        min: [0, 'Price cannot be negative'],
        validate: {
          validator: Number.isFinite,
          message: 'Price must be a valid number',
        },
      },
      currency: {
        type: String,
        enum: {
          values: Object.values(CURRENCIES),
          message: 'Invalid currency. Must be one of: KSH, TZS, UGX, USD',
        },
        default: 'USD',
      },
    },
    stock: {
      type: Number,
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    sku: {
      type: String,
      trim: true,
      uppercase: true,
    },
    barcode: String,
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    images: [
      {
        url: String,
        isMain: Boolean,
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const imageSchema = new Schema(
  {
    url: {
      type: String,
      required: [true, 'Image URL is required'],
      validate: {
        validator: function (v) {
          return /^(https?:\/\/).+/.test(v);
        },
        message: 'Please provide a valid image URL',
      },
    },
    isMain: {
      type: Boolean,
      default: false,
    },
    altText: {
      type: String,
      trim: true,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    caption: String,
  },
  { _id: false }
);

const videoSchema = new Schema(
  {
    url: {
      type: String,
      required: [true, 'Video URL is required'],
    },
    type: {
      type: String,
      enum: ['youtube', 'vimeo', 'direct'],
      required: true,
    },
    thumbnail: String,
    title: String,
    description: String,
    duration: Number,
    isMain: { type: Boolean, default: false },
  },
  { _id: false }
);

const customFieldSchema = new Schema(
  {
    key: {
      type: String,
      required: [true, 'Field key is required'],
      trim: true,
    },
    value: {
      type: String,
      required: [true, 'Field value is required'],
    },
  },
  { _id: false }
);

const downloadSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Download name is required'],
    },
    file: {
      type: String,
      required: [true, 'File URL is required'],
    },
    fileId: String,
    downloadCount: { type: Number, default: 0 },
    expires: Date,
  },
  { _id: false }
);

const attributeValueSchema = new Schema(
  {
    name: String,
    value: Schema.Types.Mixed,
    meta: Schema.Types.Mixed,
  },
  { _id: false }
);

const productAttributeSchema = new Schema(
  {
    attribute: {
      type: Schema.Types.ObjectId,
      ref: 'Attribute',
      required: true,
    },
    values: [attributeValueSchema],
    isVisible: { type: Boolean, default: true },
    isVariation: { type: Boolean, default: false },
  },
  { _id: false }
);

const warrantySchema = new Schema(
  {
    type: {
      type: String,
      enum: ['manufacturer', 'seller', 'extended', 'none'],
      default: 'manufacturer',
    },
    period: {
      type: Number,
      min: [0, 'Warranty period cannot be negative'],
    },
    periodUnit: {
      type: String,
      enum: ['day', 'week', 'month', 'year'],
      default: 'month',
    },
    policy: String,
    contactInfo: {
      email: String,
      phone: String,
      address: String,
    },
  },
  { _id: false }
);

// Main Product Schema
const productSchema = new Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [500, 'Short description cannot exceed 500 characters'],
    },

    // Categorization
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    subcategories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    brand: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    type: {
      type: String,
      enum: ['simple', 'variable', 'grouped', 'external'],
      default: 'simple',
    },

    // Pricing
    price: {
      amount: {
        type: Number,
        required: [
          function () {
            return this.type !== 'variable';
          },
          'Price is required for non-variable products',
        ],
        min: [0, 'Price cannot be negative'],
        validate: {
          validator: Number.isFinite,
          message: 'Price must be a valid number',
        },
      },
      currency: {
        type: String,
        enum: {
          values: Object.values(CURRENCIES),
          message: 'Invalid currency. Must be one of: KSH, TZS, UGX, USD',
        },
        default: 'USD',
      },
    },
    compareAtPrice: {
      amount: {
        type: Number,
        validate: {
          validator: function (v) {
            if (v === undefined || v === null) return true;
            return v > this.price.amount;
          },
          message: 'Compare at price must be greater than the regular price',
        },
      },
      currency: {
        type: String,
        enum: Object.values(CURRENCIES),
        default: 'USD',
      },
    },
    costPerItem: {
      type: Number,
      min: [0, 'Cost cannot be negative'],
    },
    profit: {
      type: Number,
      min: [0, 'Profit cannot be negative'],
    },
    margin: {
      type: Number,
      min: [0, 'Margin cannot be negative'],
      max: [100, 'Margin cannot exceed 100%'],
    },
    // Tax Settings
    taxStatus: {
      type: String,
      enum: ['taxable', 'shipping_only', 'none'],
      default: 'taxable',
    },
    taxClass: {
      type: String,
      enum: ['standard', 'reduced', 'zero'],
      default: 'standard',
      required: [
        function () {
          return this.taxStatus !== 'none';
        },
        'Tax class is required when tax status is not "none"',
      ],
    },

    // Inventory
    sku: {
      type: String,
      trim: true,
      uppercase: true,
      sparse: true,
    },
    barcode: {
      type: String,
      trim: true,
    },
    trackQuantity: {
      type: Boolean,
      default: true,
    },
    quantity: {
      type: Number,
      min: [0, 'Quantity cannot be negative'],
      default: 0,
      required: [
        function () {
          return this.trackQuantity && !this.hasVariations;
        },
        'Quantity is required when tracking inventory for simple products',
      ],
    },
    allowBackorder: {
      type: Boolean,
      default: false,
    },
    stockStatus: {
      type: String,
      enum: ['in_stock', 'out_of_stock', 'on_backorder'],
      default: 'in_stock',
    },
    lowStockThreshold: {
      type: Number,
      min: [0, 'Threshold cannot be negative'],
      default: 2,
    },

    // Shipping
    isPhysical: {
      type: Boolean,
      default: true,
    },
    shippingClass: {
      type: String,
      enum: ['standard', 'fragile', 'oversized', 'digital'],
      default: 'standard',
      required: [
        function () {
          return this.isPhysical;
        },
        'Shipping class is required for physical products',
      ],
    },
    availableShippingMethods: [
      {
        type: String,
        enum: ['standard', 'express', 'overnight'],
        validate: {
          validator: function (v) {
            return v.length > 0 || !this.isPhysical;
          },
          message:
            'At least one shipping method is required for physical products',
        },
      },
    ],
    weight: {
      type: Number,
      min: [0, 'Weight cannot be negative'],
      required: [
        function () {
          return this.isPhysical;
        },
        'Weight is required for physical products',
      ],
    },
    weightUnit: {
      type: String,
      enum: ['g', 'kg', 'lb', 'oz'],
      default: 'g',
    },
    dimensions: {
      length: {
        type: Number,
        min: [0, 'Length cannot be negative'],
      },
      width: {
        type: Number,
        min: [0, 'Width cannot be negative'],
      },
      height: {
        type: Number,
        min: [0, 'Height cannot be negative'],
      },
      unit: {
        type: String,
        enum: ['cm', 'in'],
        default: 'cm',
      },
    },
    shippingClass: {
      type: String,
      enum: {
        values: ['standard', 'fragile', 'oversized', 'digital'],
        message: 'Invalid shipping class',
      },
      default: 'standard',
      required: [
        function () {
          return this.isPhysical;
        },
        'Shipping class is required for physical products',
      ],
    },
    availableShippingMethods: [
      {
        type: String,
        enum: {
          values: ['standard', 'express', 'overnight'],
          message: 'Invalid shipping method',
        },
      },
    ],
    requiresShipping: {
      type: Boolean,
      default: true,
    },
    shippingMethods: [
      {
        type: String,
        enum: ['standard', 'express', 'overnight', 'pickup'],
      },
    ],

    // Media
    images: {
      type: [imageSchema],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: 'At least one image is required',
      },
    },
    videos: [videoSchema],

    // Variations
    hasVariations: {
      type: Boolean,
      default: false,
    },
    variations: [variationSchema],
    defaultVariation: {
      type: Schema.Types.ObjectId,
      ref: 'variationSchema',
    },

    // Attributes
    attributes: [productAttributeSchema],

    // SEO
    seo: {
      metaTitle: {
        type: String,
        trim: true,
        maxlength: [60, 'Meta title cannot exceed 60 characters'],
      },
      metaDescription: {
        type: String,
        trim: true,
        maxlength: [160, 'Meta description cannot exceed 160 characters'],
      },
      metaKeywords: [
        {
          type: String,
          trim: true,
          lowercase: true,
        },
      ],
      slug: {
        type: String,
        unique: true,
        sparse: true,
        lowercase: true,
        trim: true,
      },
      canonicalUrl: String,
      ogImage: String,
    },

    // Advanced
    purchaseNote: {
      type: String,
      trim: true,
      maxlength: [500, 'Purchase note cannot exceed 500 characters'],
    },
    enableReviews: {
      type: Boolean,
      default: true,
    },
    isDownloadable: {
      type: Boolean,
      default: false,
    },
    downloadLimit: {
      type: Number,
      min: [0, 'Download limit cannot be negative'],
      default: 0, // 0 means unlimited
    },
    downloadExpiry: {
      type: Number,
      min: [0, 'Download expiry cannot be negative'],
      default: 0, // 0 means never expires
    },
    downloads: [downloadSchema],

    // Product Relationships
    relatedProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        validate: {
          validator: function (v) {
            return !v.includes(this._id);
          },
          message: 'A product cannot be related to itself',
        },
      },
    ],
    crossSellProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    upSellProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    frequentlyBoughtTogether: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],

    // Custom Fields
    customFields: [customFieldSchema],

    // Warranty
    warranty: warrantySchema,

    // System
    status: {
      type: String,
      enum: ['draft', 'pending_review', 'active', 'inactive', 'archived'],
      default: 'draft',
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller is required'],
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: Date,

    // Analytics
    viewCount: {
      type: Number,
      default: 0,
    },
    purchaseCount: {
      type: Number,
      default: 0,
    },
    wishlistCount: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5'],
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    publishedAt: Date,
    deletedAt: Date,

    // Soft delete flag
    isDeleted: {
      type: Boolean,
      default: false,
    },

    // Versioning
    __v: {
      type: Number,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
productSchema.index({
  name: 'text',
  description: 'text',
  'seo.metaKeywords': 'text',
});
productSchema.index({ category: 1, status: 1 });
productSchema.index({ seller: 1, status: 1 });
productSchema.index({ sku: 1 }, { sparse: true });
productSchema.index({ barcode: 1 }, { sparse: true });
productSchema.index({ 'variations.sku': 1 }, { sparse: true });
productSchema.index({ price: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ viewCount: -1 });
productSchema.index({ purchaseCount: -1 });

// Virtuals
productSchema.virtual('url').get(function () {
  return `/products/${this._id}`;
});

productSchema.virtual('isInStock').get(function () {
  if (this.hasVariations) {
    return this.variations.some((v) => v.stock > 0 || this.allowBackorder);
  }
  return this.quantity > 0 || this.allowBackorder;
});

productSchema.virtual('isOnSale').get(function () {
  if (!this.compareAtPrice?.amount) return false;
  // Only compare if currencies match
  if (this.compareAtPrice.currency !== this.price.currency) return false;
  return this.compareAtPrice.amount > this.price.amount;
});

productSchema.virtual('salePercentage').get(function () {
  if (
    !this.compareAtPrice?.amount ||
    this.compareAtPrice.amount <= this.price.amount
  )
    return 0;
  // Only calculate if currencies match
  if (this.compareAtPrice.currency !== this.price.currency) return 0;
  return Math.round(
    ((this.compareAtPrice.amount - this.price.amount) /
      this.compareAtPrice.amount) *
      100
  );
});

// Method to convert price to another currency
productSchema.methods.convertPrice = function (
  targetCurrency,
  amount = this.price.amount,
  sourceCurrency = this.price.currency
) {
  // In a real app, you'd fetch live rates from an API
  const RATES = {
    USD: { KSH: 150, TZS: 2300, UGX: 3700, USD: 1 },
    KSH: { USD: 0.0067, TZS: 15.33, UGX: 24.67, KSH: 1 },
    TZS: { USD: 0.00043, KSH: 0.065, UGX: 1.61, TZS: 1 },
    UGX: { USD: 0.00027, KSH: 0.041, TZS: 0.62, UGX: 1 },
  };

  if (sourceCurrency === targetCurrency) {
    return amount;
  }

  const rate = RATES[sourceCurrency]?.[targetCurrency];
  if (!rate) {
    throw new Error(
      `Conversion rate not available from ${sourceCurrency} to ${targetCurrency}`
    );
  }

  return parseFloat((amount * rate).toFixed(2));
};

// Format price with currency symbol
productSchema.methods.formatPrice = function (
  amount = this.price.amount,
  currency = this.price.currency
) {
  const formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Handle non-standard currency codes
  if (!['USD', 'EUR', 'GBP'].includes(currency)) {
    return `${formatter
      .format(amount)
      .replace(/\D00(?=\D*$)/, '')} ${currency}`;
  }

  return formatter.format(amount);
};

// Document middleware
productSchema.pre('save', async function (next) {
  // Update timestamps
  this.updatedAt = Date.now();

  // Generate slug from name if not provided
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Calculate profit and margin if cost and price are set
  if (this.isModified('price.amount') || this.isModified('costPerItem')) {
    if (this.price?.amount && this.costPerItem) {
      this.profit = this.price.amount - this.costPerItem;
      this.margin = (this.profit / this.price.amount) * 100;
    } else {
      this.profit = undefined;
      this.margin = undefined;
    }
  }

  // Ensure compareAtPrice uses the same currency as price
  if (this.isModified('price.currency') && this.compareAtPrice?.amount) {
    this.compareAtPrice.currency = this.price.currency;
  }

  // Update stock status based on quantity
  if (this.isModified('quantity') || this.isModified('allowBackorder')) {
    if (this.quantity > 0) {
      this.stockStatus = 'in_stock';
    } else if (this.allowBackorder) {
      this.stockStatus = 'on_backorder';
    } else {
      this.stockStatus = 'out_of_stock';
    }
  }

  // If product has variations, ensure hasVariations is true
  if (this.variations && this.variations.length > 0) {
    this.hasVariations = true;
  }

  next();
});

// Query middleware
productSchema.pre(/^find/, function (next) {
  // Only include non-deleted products by default
  if (this.getFilter().isDeleted === undefined) {
    this.find({ isDeleted: { $ne: true } });
  }
  next();
});

// Instance methods
productSchema.methods.incrementViewCount = async function () {
  this.viewCount += 1;
  return this.save();
};

productSchema.methods.incrementPurchaseCount = async function (quantity = 1) {
  this.purchaseCount += quantity;
  if (this.trackQuantity && !this.hasVariations) {
    this.quantity = Math.max(0, this.quantity - quantity);
  }
  return this.save();
};

productSchema.methods.updateAverageRating = async function () {
  const stats = await this.model('Review').aggregate([
    { $match: { product: this._id, status: 'approved' } },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    this.averageRating = Math.round(stats[0].averageRating * 10) / 10;
    this.reviewCount = stats[0].reviewCount;
  } else {
    this.averageRating = 0;
    this.reviewCount = 0;
  }

  return this.save();
};

productSchema.methods.getLowStockVariations = function () {
  if (!this.hasVariations) return [];
  return this.variations.filter(
    (v) =>
      v.stock > 0 && v.stock <= (v.lowStockThreshold || this.lowStockThreshold)
  );
};

// Static methods
productSchema.statics.findByCategory = function (categoryId) {
  return this.find({
    $or: [{ category: categoryId }, { subcategories: categoryId }],
    status: 'active',
    isDeleted: { $ne: true },
  });
};

productSchema.statics.getFeatured = function (limit = 10) {
  return this.find({
    'seo.metaKeywords': 'featured',
    status: 'active',
    isDeleted: { $ne: true },
  }).limit(limit);
};

productSchema.statics.getBestSellers = function (limit = 10) {
  return this.find({
    status: 'active',
    isDeleted: { $ne: true },
  })
    .sort({ purchaseCount: -1 })
    .limit(limit);
};

// Text search index for full-text search
productSchema.index(
  {
    name: 'text',
    description: 'text',
    'seo.metaKeywords': 'text',
    brand: 'text',
    tags: 'text',
  },
  {
    weights: {
      name: 10,
      brand: 5,
      'seo.metaKeywords': 5,
      tags: 2,
      description: 1,
    },
    name: 'product_text_search',
  }
);

// Compound index for common queries
productSchema.index({
  status: 1,
  isDeleted: 1,
  price: 1,
  averageRating: -1,
});

// Export the model
module.exports = mongoose.model('Product', productSchema);

// import mongoose from 'mongoose';

// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Please enter product name'],
//     trim: true,
//     maxlength: [100, 'product name cannot execeed 100 characters'],
//   },
//   price: {
//     type: Number,
//     required: [true, 'Please enter product price'],
//     maxlength: [5, 'product price cannot execeed 5 characters'],
//     default: 0,
//   },
//   description: {
//     type: String,
//     required: [true, 'Please enter product description'],
//   },
//   ratings: {
//     type: Number,
//     default: 0,
//   },
//   images: [
//     {
//       public_id: {
//         type: String,
//         required: true,
//       },
//       url: {
//         type: String,
//         required: true,
//       },
//     },
//   ],
//   category: {
//     type: String,
//     required: [true, 'Please select category for this product'],
//     enum: {
//       values: [
//         'Electronics',
//         'Cameras',
//         'Laptops',
//         'Accessories',
//         'Headphones',
//         'Food',
//         'Books',
//         'Clothes/Shoes',
//         'Sports',
//         'Outdoor',
//         'Home',
//       ],
//       message: 'Please select correct category for the product',
//     },
//   },
//   seller: {
//     type: String,
//     required: [true, 'Please select product seller'],
//   },
//   stock: {
//     type: Number,
//     required: [true, 'Please select product stock'],
//     maxlength: [5, 'Product name cannot execeed 5 characters'],
//     default: 0,
//   },
//   numOfReviews: {
//     type: Number,
//     default: 0,
//   },
//   reviews: [
//     {
//       user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true,
//       },
//       name: {
//         type: String,
//         required: true,
//       },
//       rating: {
//         type: String,
//         required: true,
//       },
//       comment: {
//         type: String,
//         required: true,
//       },
//     },
//   ],
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// export default mongoose.model('Product', productSchema);
