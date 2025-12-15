import { StatusCodes } from 'http-status-codes';
import Product from '../models/Product.js';
import { NotFoundError } from '../utils/customErrors.js';
import APIFeatures from '../utils/apiFeatures.js';
import { v2 as cloudinary } from 'cloudinary';

export const newProduct = async (req, res) => {
  let images = [];
  if (typeof req.body.images === 'string') {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  let imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: 'products',
    });
    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  req.body.images = imagesLinks;

  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({
    success: true,
    product,
  });
};

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/v1/products
// @access  Public
export const getProducts = async (req, res, next) => {
  // 1) Parse query parameters
  const {
    search,
    categories,
    minPrice,
    maxPrice,
    sort = '-createdAt',
    inStock,
    onSale,
    priceRange,
    rating,
    typeId,
    stockStatus,
    minQty,
    allowBackorder,
    page = 1,
    limit,
  } = req.query;

  // 2) Build the base query
  const query = { isActive: true };
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 0;
  const skip = limitNum > 0 ? (pageNum - 1) * limitNum : 0;

  // 3) Handle search functionality
  if (search && search.trim()) {
    try {
      const searchTerm = search.trim();
      if (searchTerm.length < 2) {
        return res.status(200).json({
          success: true,
          count: 0,
          products: [],
          totalPages: 0,
          currentPage: pageNum,
          message: 'Search term must be at least 2 characters',
        });
      }

      const searchRegex = new RegExp(
        searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'i'
      );

      // Add search conditions to query
      query.$and = [
        ...(query.$and || []),
        {
          $or: [
            { name: { $regex: searchRegex } },
            { description: { $regex: searchRegex } },
            { sku: { $regex: searchRegex } },
            { 'configurableOptions.values.sku': { $regex: searchRegex } },
          ],
        },
      ];
    } catch (error) {
      console.error('Search error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error performing search',
        error:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  // 4) Stock status filter
  if (stockStatus) {
    if (stockStatus === 'in_stock') {
      query.$and = [
        ...(query.$and || []),
        {
          $or: [
            // Simple products in stock
            {
              typeId: 'simple',
              $or: [
                { 'stock.status': 'in_stock' },
                { 'stock.status': 'backorder' },
                {
                  'stock.status': { $exists: false },
                  'stock.qty': { $gt: 0 },
                },
              ],
            },
            // Configurable products with any variant in stock
            {
              typeId: 'configurable',
              'configurableOptions.values': {
                $elemMatch: {
                  inStock: { $exists: true, $not: { $size: 0 } },
                },
              },
            },
          ],
        },
      ];
    } else if (stockStatus === 'out_of_stock') {
      query.$and = [
        ...(query.$and || []),
        {
          $or: [
            // Simple products out of stock
            {
              typeId: 'simple',
              $or: [
                { 'stock.status': 'out_of_stock' },
                {
                  $and: [
                    { 'stock.status': { $ne: 'backorder' } },
                    { 'stock.qty': { $lte: 0 } },
                  ],
                },
              ],
            },
            // Configurable products with no variants in stock
            {
              typeId: 'configurable',
              $or: [
                // No configurable options
                { configurableOptions: { $exists: false } },
                { configurableOptions: { $size: 0 } },
                // Or no variants with inStock values
                {
                  'configurableOptions.values': {
                    $not: {
                      $elemMatch: {
                        inStock: { $exists: true, $not: { $size: 0 } },
                      },
                    },
                  },
                },
              ],
            },
          ],
        },
      ];
    }
  }

  // 5) Categories filter
  if (categories) {
    const categoryList = Array.isArray(categories) ? categories : [categories];
    if (categoryList.length > 0) {
      query.category = { $in: categoryList };
    }
  }

  // 6) Product type filter
  if (typeId) {
    query.typeId = typeId;
  }

  // 7) In Stock filter (legacy)
  if (inStock === 'true') {
    query.$and = [
      ...(query.$and || []),
      {
        $or: [
          { 'stock.status': 'in_stock' },
          { 'stock.quantity': { $gt: 0 } },
          {
            typeId: 'configurable',
            'configurableOptions.values.inStock': { $gt: 0 },
          },
        ],
      },
    ];
  }

  // 8) On Sale filter
  if (onSale === 'true') {
    query.specialPrice = { $exists: true, $ne: null, $gt: 0 };
  }

  // 9) Price range filter
  if (minPrice || maxPrice || (priceRange && priceRange !== 'all')) {
    let priceQuery = {};

    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) priceQuery.$gte = min;
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) priceQuery.$lte = max;
    }

    if (
      Object.keys(priceQuery).length === 0 &&
      priceRange &&
      priceRange !== 'all'
    ) {
      const ranges = {
        under1000: { $lt: 1000 },
        '1000-5000': { $gte: 1000, $lte: 5000 },
        '5000-10000': { $gte: 5000, $lte: 10000 },
        '10000-20000': { $gte: 10000, $lte: 20000 },
        over20000: { $gt: 20000 },
      };
      if (ranges[priceRange]) {
        priceQuery = { ...ranges[priceRange] };
      }
    }

    if (Object.keys(priceQuery).length > 0) {
      const priceConditions = [
        { price: priceQuery },
        {
          $and: [
            { specialPrice: { $exists: true, $ne: null } },
            { specialPrice: priceQuery },
          ],
        },
      ];

      const newQuery = {
        $and: [{ ...query }, { $or: priceConditions }],
      };

      Object.assign(query, newQuery);
    }
  }

  // 10) Rating filter
  if (rating) {
    const ratingNum = parseFloat(rating);
    if (!isNaN(ratingNum)) {
      query.rating = { $gte: ratingNum, $lt: ratingNum + 1 };
    }
  }

  // 11) Minimum quantity filter
  if (minQty) {
    const minQtyNum = parseInt(minQty);
    if (!isNaN(minQtyNum)) {
      query['stock.quantity'] = { $gte: minQtyNum };
    }
  }

  // 12) Allow backorder filter
  if (allowBackorder === 'false') {
    query['stock.allowBackorder'] = false;
  }

  // 13) Execute the query
  try {
    // Default to no limit if not specified
    const limitNum = limit ? parseInt(limit) : 0;
    const skip = page > 1 ? (page - 1) * (limitNum || 0) : 0;

    // Sorting options
    const sortOptions = {
      newest: '-createdAt',
      priceAsc: 'price',
      priceDesc: '-price',
      rating: '-rating.average',
      nameAsc: 'name',
      nameDesc: '-name',
      bestSelling: '-soldCount',
      mostViewed: '-viewCount',
      mostPopular: '-likes',
      topRated: '-rating.average',
    };

    const sortBy = sortOptions[sort] || sort || '-createdAt';

    // Build the query
    let productsQuery = Product.find(query)
      .select(
        'name price specialPrice stock typeId thumbnail category rating configurableOptions'
      )
      .populate('category', 'name slug')
      .populate('vendor', 'name email')
      .sort(sortBy)
      .skip(skip);

    // Only apply limit if it's greater than 0
    if (limitNum > 0) {
      productsQuery = productsQuery.limit(limitNum);
    }

    productsQuery = productsQuery.lean();

    // Execute query
    console.log('Sorting by:', sortBy);

    const [products, total] = await Promise.all([
      productsQuery.exec(),
      Product.countDocuments(query).then((count) => {
        console.log(`Found ${count} products matching the query`);
        return count;
      }),
    ]);
    console.log(`Returning ${products.length} products`);

    // Calculate pagination
    const totalPages = Math.ceil(total / limitNum);

    return res.status(200).json({
      success: true,
      productCount: total,
      resultsPerPage: limitNum,
      totalPages,
      currentPage: pageNum,
      products: products.map((product) => ({
        ...product,
        isInStock:
          product.stock?.status === 'in_stock' ||
          product.stock?.status === 'backorder' ||
          (product.typeId === 'configurable' &&
            product.configurableOptions?.some((opt) =>
              opt.values?.some((v) => v.inStock?.length > 0)
            )),
      })),
    });
  } catch (error) {
    console.error('Error getting products:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// get all products (admin) => /api/v1/admin/products
export const getAdminProducts = async (req, res) => {
  let products = await Product.find({});

  res.status(StatusCodes.OK).json({
    success: true,
    products,
  });
};

export const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  console.log('Looking for product with ID:', productId);
  const product = await Product.findById(productId);
  console.log('Found product:', product);
  if (!product) {
    throw new NotFoundError('product not found');
  }
  res.status(StatusCodes.OK).json({ success: true, product });
};

export const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  let product = await Product.findById(productId);
  if (!product) {
    throw new NotFoundError('product not found');
  }

  let images = [];
  if (typeof req.body.images === 'string') {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting images associated with the product
    for (let i = 0; i < product.images.length; i++) {
      const result = await cloudinary.v2.uploader.destroy(
        product.images[i].public_id
      );

      let imagesLinks = [];

      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: 'products',
        });
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
      req.body.images = imagesLinks;
    }
  }

  product = await Product.findByIdAndUpdate(productId, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(StatusCodes.OK).json({ success: true, product });
};

export const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  let product = await Product.findById(productId);
  if (!product) {
    throw new NotFoundError('product not found');
  }

  // Deleting images asociated with the product
  for (let i = 0; i < product.images.length; i++) {
    const result = await cloudinary.v2.uploader.destroy(
      product.images[i].public_id
    );
  }

  await product.remove();
  res.status(200).json({
    success: true,
    message: 'product is deleted',
  });
};

// Create new review => /api/v1/review
export const createProductReview = async (req, res) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (r) => r.user === req.user._id.toString()
  );
  // if reviewed, update the preview review
  // TODO: resolve a bug on this if statement - user shouldn't submit multiple reviews
  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  product.ratings =
    product.reviews.reduce((acc, item) => acc + item.rating, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res
    .status(StatusCodes.CREATED)
    .json({ success: true, msg: 'Review Submitted', review });
};

// Get Product Reviews => /api/v1/reviews
export const getProductReviews = async (req, res) => {
  const product = await Product.findById(req.query.id);
  res.status(StatusCodes.OK).json({ success: true, reviews: product.reviews });
};

// Delete Product Review => /api/v1/reviews
export const deleteReview = async (req, res) => {
  const product = await Product.findById(req.query.productId);

  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString()
  );
  const numOfReviews = reviews.length;
  const ratings =
    product.reviews.reduce((acc, item) => acc + item.rating, 0) /
    product.reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    { reviews, ratings, numOfReviews },
    { new: true, runValidators: true, useFindAndModify: false }
  );
  res.status(StatusCodes.OK).json({ success: true, msg: 'review is deleted' });
};
