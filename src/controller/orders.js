const Order = require('../models/order');
const { pagination, isObjectId } = require('../utils/utils');

// GET '/orders'
const getOrders = async (req, res, next) => {
  try {
    const options = {
      populate: 'products.product',
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 10,
    };
    const orders = await Order.paginate({}, options);

    const url = `${req.protocol}://${req.get('host') + req.path}`;
    const links = pagination(orders, url, options.page, options.limit, orders.totalPages);

    res.links(links);
    return res.status(200).json(orders.docs);
  } catch (err) {
    next(err);
  }
};

// GET '/orders/:orderId'
const getOneOrder = async (req, res, next) => {
  try {
    if (!isObjectId(req.params.orderId)) return next(404);

    const order = await Order.findOne({ _id: req.params.orderId }).populate('products.product');

    if (!order) return next(404);
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

// POST '/orders' - LEER MÁS *********

const newOrder = async (req, res, next) => {
  const {
    userId,
    client,
    products,
  } = req.body;
  try {
    if (!products || products.length === 0) return next(400);

    const newOrder = new Order({
      userId,
      client,
      products: products.map((product) => ({
        qty: product.qty,
        product: product.productId,
      })),
    });

    // Band.findOne({ name: 'Motley Crue' }).populate('members.$*');
    const order = await newOrder.save(newOrder);
    const orderUpdate = await Order.findOne({ _id: order._id }).populate('products.product');

    return res.status(200).json(orderUpdate);
  } catch (err) {
    next(400);
  }
};

// PUT '/orders/:orderId'

const updateOrder = async (req, res, next) => {
  const { orderId } = req.params;

  const {
    status,
  } = req.body;

  try {
    if (!isObjectId(orderId)) return next(404);
    if (Object.keys(req.body).length === 0) return next(400);

    const statusOrder = [
      'pending',
      'canceled',
      'delivering',
      'delivered',
      'preparing',
    ];
    if (status && !statusOrder.includes(status)) return next(400);

    const orderUpdated = await Order.findOneAndUpdate(
      { _id: orderId },
      { $set: req.body },
      { new: true, useFindAndModify: false },
    ); // .select('-__v');
    return res.status(200).json(orderUpdated);
  } catch (err) {
    next(404);
  }
};

// DELETE '/orders/:orderId'

const deleteOneOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    if (!isObjectId(orderId)) return next(404);
    const findOrder = await Order.findOne({ _id: orderId });
    await Order.findByIdAndDelete({ _id: orderId });
    return res.status(200).send(findOrder);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOrders,
  newOrder,
  updateOrder,
  getOneOrder,
  deleteOneOrder,
};
