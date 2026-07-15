const Product = require('../models/Product');

// @desc    Get all products with search, filter, pagination
// @route   GET /api/products
const getProducts = async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {};
  const category = req.query.category ? { category: req.query.category } : {};
  const minPrice = req.query.minPrice ? { price: { $gte: Number(req.query.minPrice) } } : {};
  const maxPrice = req.query.maxPrice ? { price: { $lte: Number(req.query.maxPrice) } } : {};
  const featured = req.query.featured ? { isFeatured: true } : {};

  const filter = { ...keyword, ...category, ...minPrice, ...maxPrice, ...featured };

  let sort = {};
  if (req.query.sort === 'price_asc') sort = { price: 1 };
  else if (req.query.sort === 'price_desc') sort = { price: -1 };
  else if (req.query.sort === 'rating') sort = { rating: -1 };
  else if (req.query.sort === 'newest') sort = { createdAt: -1 };

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter).sort(sort).limit(pageSize).skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
};

// @desc    Get single product
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) res.json(product);
  else res.status(404).json({ message: 'Product not found' });
};

// @desc    Create product (admin)
// @route   POST /api/products
const createProduct = async (req, res) => {
  const product = new Product({
    name: req.body.name || 'Sample Product',
    description: req.body.description || 'Sample description',
    price: req.body.price || 0,
    originalPrice: req.body.originalPrice || 0,
    image: req.body.image || 'https://picsum.photos/400/400',
    images: req.body.images || [],
    category: req.body.category || 'Electronics',
    brand: req.body.brand || 'Generic',
    stock: req.body.stock || 10,
    isFeatured: req.body.isFeatured || false,
    tags: req.body.tags || [],
  });
  const created = await product.save();
  res.status(201).json(created);
};

// @desc    Update product (admin)
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    Object.assign(product, req.body);
    const updated = await product.save();
    res.json(updated);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Delete product (admin)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Create product review
// @route   POST /api/products/:id/reviews
const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) return res.status(400).json({ message: 'Product already reviewed' });

    const review = { user: req.user._id, name: req.user.name, rating: Number(rating), comment };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Get categories
// @route   GET /api/products/categories
const getCategories = async (req, res) => {
  const categories = await Product.distinct('category');
  res.json(categories);
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview, getCategories };
