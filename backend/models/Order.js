import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    // Order Information
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'refunded',
      ],
      default: 'pending',
    },

    // Order Items
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          amount: {
            type: Number,
            required: true,
            min: 0,
          },
          currency: {
            type: String,
            enum: ['KES', 'USD', 'TZS', 'UGX'],
            default: 'KES',
          },
        },
        thumbnail: String,
        sku: String,
        variant: String,
      },
    ],

    // Pricing
    subtotal: {
      amount: Number,
      currency: String,
    },
    shipping: {
      amount: Number,
      currency: String,
      method: String,
      trackingNumber: String,
      carrier: String,
    },
    tax: {
      amount: Number,
      currency: String,
      rate: Number,
    },
    discount: {
      amount: Number,
      currency: String,
      code: String,
    },
    total: {
      amount: Number,
      currency: String,
    },

    // Customer Information
    customer: {
      name: String,
      email: String,
      phone: String,
    },

    // Shipping Information
    shippingAddress: {
      firstName: String,
      lastName: String,
      company: String,
      address1: String,
      address2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      phone: String,
    },

    // Billing Information
    billingAddress: {
      sameAsShipping: {
        type: Boolean,
        default: true,
      },
      firstName: String,
      lastName: String,
      company: String,
      address1: String,
      address2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      phone: String,
    },

    // Payment Information
    payment: {
      method: {
        type: String,
        enum: [
          'credit_card',
          'paypal',
          'mpesa',
          'cash_on_delivery',
          'bank_transfer',
        ],
        required: true,
      },
      status: {
        type: String,
        enum: [
          'pending',
          'authorized',
          'paid',
          'failed',
          'refunded',
          'partially_refunded',
        ],
        default: 'pending',
      },
      transactionId: String,
      paymentDetails: {},
    },

    // Order Metadata
    notes: [
      {
        content: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],

    // Audit Fields
    ipAddress: String,
    userAgent: String,

    // Status History
    statusHistory: [
      {
        status: String,
        changedAt: {
          type: Date,
          default: Date.now,
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        comment: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
orderSchema.index({ orderNumber: 1 }, { unique: true });
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save hook to update status history
orderSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    this.statusHistory = this.statusHistory || [];
    this.statusHistory.push({
      status: this.status,
      changedBy: this.user, // Assuming the current user is stored in the user field
      comment: `Status changed to ${this.status}`,
    });
  }
  next();
});

export default mongoose.model('Order', orderSchema);
