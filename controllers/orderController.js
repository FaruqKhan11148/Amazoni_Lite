const orderService = require('../services/orderService');
const orderModel = require('../models/orderModel');

const checkout = (req, res) => {
  const userId = req.user.id;
  const { address_id, coupon_code } = req.body || {};
  const product_id = req.user.product_id;

  if (!address_id) {
    return res.status(400).json({ message: 'Address is required' });
  }

  orderService.placeOrder(userId, address_id, coupon_code, (err, result) => {
    if (err) {
      const failedProducts = err.productId || [];
      return res.status(500).json({
        message: failedProducts.length
          ? `Order failed, Stock exceeded for product(s) : ${failedProducts.join(', ')} `
          : err.message || 'Order Failed',
        error: err,
      });
    }

    if (!result) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    res.json({
      message: 'Order placed successfully',
      orderId: result.orderId,
      total: result.total, // this will now reflect discount
      discount: result.discount || 0,
    });
  });
};

const getOrderById = (req, res) => {
  const userId = req.user.id;
  const orderId = req.params.orderId;

  orderService.getOrder(userId, orderId, (err, order) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (!order.length)
      return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  });
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await orderService.getOrders(userId);

    res.render('pages/myOrders', {
      orders: result.orders,
    });
  } catch (err) {
    console.error(err);
    res.render('pages/myOrders', { orders: [] });
  }
};

const markPaid = (req, res) => {
  const userId = req.user.id;
  const orderId = req.params.orderId;
  const { method, transaction_id } = req.body;

  if (!method || !transaction_id) {
    return res.status(400).json({ message: 'Payment details required' });
  }

  orderModel.markOrderPaid(
    orderId,
    req.user.id,
    method,
    transaction_id,
    false,
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: 'Payment update failed', error: err });

      if (result.affectedRows === 0) {
        // Either already paid or invalid order
        return res
          .status(400)
          .json({ message: 'Order is already paid or cannot be updated' });
      }

      orderModel.addOrderStatusLog(orderId, 'paid', () => {});

      res.json({
        message: 'Payment updated successfully',
        orderId,
        status: 'paid',
      });
    },
  );
};

// Cancel order
const cancelOrder = (req, res) => {
  const userId = req.user.id;
  const orderId = req.params.id;

  orderService.cancelOrder(userId, orderId, (err, msg) => {
    if (err) return res.status(400).json({ message: err });
    res.json({ message: msg });
  });
};

// Order history with pagination
const getMyOrdersPaginated = (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 5 } = req.query;

  orderService.getOrdersPaginated(userId, +page, +limit, (err, orders) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json({ page, limit, orders });
  });
};

// Order timeline
const getOrderTimeline = (req, res) => {
  const userId = req.user.id;
  const orderId = req.params.id;

  orderService.getOrderTimeline(userId, orderId, (err, timeline) => {
    if (err) return res.status(500).json({ message: err });
    res.json(timeline);
  });
};

const payMultipleOrders = async (req, res) => {
  // const { orderIds, method, transaction_id } = req.body;
  let { orderIds, method, transaction_id } = req.body;

  if (typeof orderIds === 'string') {
    orderIds = JSON.parse(orderIds);
  }

  if (!orderIds?.length || !method || !transaction_id) {
    return res.status(400).json({ message: 'Missing data' });
  }

  for (let id of orderIds) {
    await orderModel.markOrderPaid(
      id,
      req.user.id,
      method,
      transaction_id,
      false,
      () => {},
    );

    orderModel.addOrderStatusLog(id, 'paid', () => {});
  }

  res.render('pages/success', {
    message: 'Payment successful for selected orders',
    redirect: '/my-orders',
  });
};

module.exports = {
  checkout,
  getOrderById,
  getMyOrders,
  markPaid,
  cancelOrder,
  getMyOrdersPaginated,
  getOrderTimeline,
  payMultipleOrders,
};
