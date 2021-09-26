const Product = require('../models/product');
const { pagination, isObjectId } = require('../utils/utils');
const { isAdmin } = require('../middleware/auth');

// GET '/products'
const getProducts = async (req, res, next) => {
  try {
    const url = `${req.protocol}://${req.get('host') + req.path}`;
    const options = {
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 10,
    };
    const products = await Product.paginate({}, options);

    const links = pagination(products, url, options.page, options.limit, products.totalPages);

    res.links(links);
    return res.status(200).json(products.docs);
  } catch (err) {
    next(err);
  }
};

// GET '/products/:productId'

const getOneProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!isObjectId(productId)) return next(404);

    const product = await Product.findOne({ _id: productId });
    if (!product) return next(404);
    return res.status(200).json(product);
  } catch (err) {
    return next(err);
  }
};

// POST '/products'

const newProduct = async (req, res, next) => {
  try {
    const { name, price } = req.body;

    if (Object.entries(req.body).length === 0) return next(400);

    const newProduct = new Product(req.body);
    const productSaved = await newProduct.save(newProduct);
    const product = await Product.findOne({ _id: productSaved._id });
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

// PUT '/products/:productId'

const updateProduct = async (req, res, next) => {
  const {
    price,
  } = req.body;
  try {
    if (!isAdmin(req)) return next(403);
    if (typeof (price) !== 'number') return next(400);

    const productUpdate = await Product.findOneAndUpdate(
      { _id: req.params.productId },
      { $set: req.body },
      { new: true, useFindAndModify: false },
    ); // .select('-__v');
    res.status(200).json(productUpdate);
  } catch (err) {
    next(404);
  }
};

// DELETE '/products/:productId'

const deleteOneProduct = async (req, res, next) => {
  try {
    if (!isAdmin(req)) return next(403);

    const productDeleted = await Product.findOne({ _id: req.params.productId });
    await Product.findByIdAndDelete({ _id: req.params.productId });
    if (productDeleted) {
      res.status(200).json(productDeleted);
    }
    res.status(400).json({ message: 'Producto a eliminar no existe' });
  } catch (err) {
    next(404);
  }
};

module.exports = {
  getProducts,
  newProduct,
  updateProduct,
  getOneProduct,
  deleteOneProduct,
};
