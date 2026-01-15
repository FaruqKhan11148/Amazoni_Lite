// adminOrderController.js
const orderModel = require('../models/orderModel');

exports.updateOrderStatus = (req, res) => {
  const orderId = req.params.id;
  const { status: newStatus } = req.body;

  orderModel.getOrderById(orderId, (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!rows || rows.length === 0)
      return res.status(404).json({ message: 'Order not found' });

    const order = rows[0];

    const currentStatus = order.order_status;
    const paymentStatus = order.payment_status;

    // PAYMENT GATE
    if (
      currentStatus === 'paid' &&
      newStatus === 'shipped' &&
      paymentStatus !== 'success'
    ) {
      return res.status(400). json({
        message: 'Order must be paid before shipping',
      });
    }

    // STATUS FLOW CHECK
    const allowedTransitions = {
      created: ['paid', 'cancelled'],
      paid: ['shipped', 'cancelled'],
      shipped: ['out_for_delivery'],
      out_for_delivery: ['delivered'],
      delivered: [],
      cancelled: [],
    };

    if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
      return res.status(400).json({
        message: `Invalid transition from ${currentStatus} → ${newStatus}`,
      });
    }

    orderModel.updateOrderStatus(orderId, newStatus, (err) => {
      if (err) return res.status(500).json({ message: 'Update failed' });

      //   orderModel.addOrderStatusLog(orderId, newStatus, 'Admin updated status');
      orderModel.addOrderStatusLog(orderId, newStatus, () => {});

      res.json({ message: `Order marked as ${newStatus}` });
    });
  });
};
