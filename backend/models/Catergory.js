import mongoose from 'mongoose';
const { Schema } = mongoose;
import slugify from 'slugify';

const categorySchema = new Schema(
  {
    // Core Information
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters'],
      unique: true,
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [250, 'Short description cannot exceed 250 characters'],
    },

    // Hierarchy & Structure
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
      index: true,
    },
    ancestors: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: 'Category',
          index: true,
        },
        name: String,
        slug: String,
      },
    ],
    level: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
    path: {
      type: String,
      index: true,
    },

    // Media & Visuals
    icon: {
      type: String,
      trim: true,
      maxlength: [50, 'Icon class cannot exceed 50 characters'],
    },
    image: {
      url: {
        type: String,
        validate: {
          validator: (v) => !v || /^https?:\/\//.test(v),
          message: 'Image URL must be a valid HTTP/HTTPS URL',
        },
      },
      altText: {
        type: String,
        trim: true,
        maxlength: [100, 'Alt text cannot exceed 100 characters'],
      },
    },
    bannerImage: {
      url: {
        type: String,
        validate: {
          validator: (v) => !v || /^https?:\/\//.test(v),
          message: 'Banner URL must be a valid HTTP/HTTPS URL',
        },
      },
      altText: {
        type: String,
        trim: true,
        maxlength: [100, 'Alt text cannot exceed 100 characters'],
      },
    },

    // Display & Navigation
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    showInNav: {
      type: Boolean,
      default: true,
    },
    visibility: {
      type: String,
      enum: ['public', 'private', 'hidden'],
      default: 'public',
      index: true,
    },

    // SEO & Marketing
    metaTitle: {
      type: String,
      trim: true,
      maxlength: [100, 'Meta title cannot exceed 100 characters'],
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [300, 'Meta description cannot exceed 300 characters'],
    },
    metaKeywords: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    canonicalUrl: {
      type: String,
      trim: true,
    },
    schemaMarkup: {
      type: Schema.Types.Mixed,
    },

    // Business Rules
    minOrderAmount: {
      type: Number,
      min: 0,
    },
    taxClass: {
      type: String,
      enum: ['standard', 'reduced', 'zero', 'exempt'],
      default: 'standard',
    },

    // Soft delete
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtuals
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
});

categorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
});

categorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true,
});

// Indexes
categorySchema.index(
  {
    name: 'text',
    description: 'text',
    shortDescription: 'text',
    metaKeywords: 'text',
  },
  {
    weights: {
      name: 10,
      metaKeywords: 5,
      description: 2,
      shortDescription: 1,
    },
    name: 'category_search_index',
  }
);

// Hooks
categorySchema.pre('save', async function (next) {
  // Generate slug
  if (this.isModified('name')) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });
  }

  // Update level and path
  if (this.isModified('parent') || this.isNew) {
    if (this.parent) {
      const parentCategory = await this.constructor.findById(this.parent);
      if (parentCategory) {
        this.level = parentCategory.level + 1;
        this.path = parentCategory.path
          ? `${parentCategory.path}/${this.slug}`
          : this.slug;

        this.ancestors = [
          ...(parentCategory.ancestors || []),
          {
            _id: parentCategory._id,
            name: parentCategory.name,
            slug: parentCategory.slug,
          },
        ];
      }
    } else {
      this.level = 0;
      this.path = this.slug;
      this.ancestors = [];
    }
  }
  next();
});

// Update all descendants when parent changes
categorySchema.pre('save', async function (next) {
  if (this.isModified('path') || this.isModified('level')) {
    const children = await this.constructor.find({ parent: this._id });
    for (const child of children) {
      child.path = this.path ? `${this.path}/${child.slug}` : child.slug;
      child.level = this.level + 1;
      await child.save();
    }
  }
  next();
});

// Instance Methods
categorySchema.methods.getBreadcrumbs = function () {
  const breadcrumbs = [...this.ancestors];
  breadcrumbs.push({
    _id: this._id,
    name: this.name,
    slug: this.slug,
  });
  return breadcrumbs;
};

categorySchema.methods.getFullPath = function () {
  return this.path ? `/${this.path}` : `/${this.slug}`;
};

// Static Methods
categorySchema.statics.findBySlug = async function (slugPath) {
  return this.findOne({ slug: slugPath.split('/').pop() });
};

categorySchema.statics.getFeatured = function (limit = 10) {
  return this.find({
    isFeatured: true,
    isActive: true,
    isDeleted: false,
  })
    .sort({ displayOrder: 1, name: 1 })
    .limit(limit);
};

categorySchema.statics.getCategoryTree = async function (options = {}) {
  const { includeInactive = false, maxDepth = 5 } = options;

  const buildTree = async (parentId = null, currentDepth = 0) => {
    if (currentDepth > maxDepth) return [];

    const query = { parent: parentId, isDeleted: false };
    if (!includeInactive) query.isActive = true;

    const categories = await this.find(query)
      .sort({ displayOrder: 1, name: 1 })
      .lean();

    for (const category of categories) {
      category.children = await buildTree(category._id, currentDepth + 1);
    }

    return categories;
  };

  return buildTree();
};

// Export the model
module.exports = mongoose.model('Category', categorySchema);
