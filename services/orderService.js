const orderModel = require('../models/orderModel');
const addressModel = require('../models/addressModel');
const couponModel = require('../models/couponModel'); // make sure you have this

// const placeOrder = (userId, addressId, coupon_code, callback) => {
//   orderModel.beginTransaction((err) => {
//     if (err) return callback(err);

//     // Fetch cart
//     orderModel.getCartWithProducts(userId, (err, cartItems) => {
//       if (err || !cartItems.length) {
//         return orderModel.rollback(() => callback(err || 'Cart empty'));
//       }

//       // Fetch & validate address
//       addressModel.getAddressById(userId, addressId, (err, addresses) => {
//         if (err || !addresses.length) {
//           return orderModel.rollback(() => callback('Invalid address'));
//         }

//         const shippingAddress = JSON.stringify(addresses[0]);

//         // Calculate total
//         let total = cartItems.reduce(
//           (sum, item) => sum + item.price * item.quantity,
//           0
//         );
//         let discount = 0;

//         // Apply coupon if exists
//         const applyCoupon = () => {
//           if (!coupon_code) return createOrder(total, discount);

//           couponModel.getCouponByCode(coupon_code, (err, coupons) => {
//             if (!err && coupons.length) {
//               const coupon = coupons[0];
//               const now = new Date();
//               if (
//                 coupon.is_active &&
//                 new Date(coupon.valid_from) <= now &&
//                 now <= new Date(coupon.valid_to) &&
//                 total >= coupon.min_order_amount
//               ) {
//                 discount = (total * coupon.discount_percent) / 100;
//                 total -= discount;
//               }
//             }
//             createOrder(total, discount);
//           });
//         };

//         // Create order WITH address snapshot
//         const createOrder = (finalTotal, discount) => {
//           orderModel.createOrder(
//             userId,
//             finalTotal,
//             shippingAddress,
//             coupon_code || null,
//             discount,
//             (err, orderResult) => {
//               if (err) return orderModel.rollback(() => callback(err));

//               const orderId = orderResult.insertId;
//               orderModel.addOrderStatusLog(orderId, 'created');
              
//               let index = 0;

//               const processNextItem = () => {
//                 if (index === cartItems.length) {
//                   return orderModel.clearCart(userId, (err) => {
//                     if (err) return orderModel.rollback(() => callback(err));
//                     return orderModel.commit(() => {
//                       callback(null, { orderId, total: finalTotal, discount });
//                     });
//                   });
//                 }

//                 const item = cartItems[index];

//                 orderModel.addOrderItem(
//                   orderId,
//                   item.product_id,
//                   item.quantity,
//                   item.price,
//                   (err) => {
//                     if (err) return orderModel.rollback(() => callback(err));

//                     orderModel.reduceStock(
//                       item.product_id,
//                       item.quantity,
//                       (err, result) => {
//                         if (err || result.affectedRows === 0) {
//                           return orderModel.rollback(() =>
//                             callback({
//                               message:"Insufficient stock",
//                               productId:[item.product_id]
//                             })
//                           );
//                         }

//                         index++;
//                         processNextItem();
//                       }
//                     );
//                   }
//                 );
//               };

//               processNextItem();
//             }
//           );
//         };

//         applyCoupon();
//       });
//     });
//   });
// };


// fetch cart
const fetchCart = (userId, callback) => {
  orderModel.getCartWithProducts(userId, (err, cartItems) => {
    if (err || !cartItems.length) return callback(err || 'Cart empty');
    callback(null, cartItems);
  });
};

// validateAddress
const validateAddress = (userId, addressId, callback) => {
  addressModel.getAddressById(userId, addressId, (err, addresses) => {
    if (err || !addresses.length) return callback('Invalid address');
    callback(null, JSON.stringify(addresses[0]));
  });
};

// applyCoupon
const applyCoupon = (coupon_code, total, callback) => {
  if (!coupon_code) return callback(null, total, 0);

  couponModel.getCouponByCode(coupon_code, (err, coupons) => {
    let discount = 0;
    if (!err && coupons.length) {
      const coupon = coupons[0];
      const now = new Date();
      if (
        coupon.is_active &&
        new Date(coupon.valid_from) <= now &&
        now <= new Date(coupon.valid_to) &&
        total >= coupon.min_order_amount
      ) {
        discount = (total * coupon.discount_percent) / 100;
        total -= discount;
      }
    }
    callback(null, total, discount);
  });
};

// createOrderAndItems 
const createOrderAndItems = (userId, cartItems, shippingAddress, coupon_code, total, discount, callback) => {
  orderModel.createOrder(userId, total, shippingAddress, coupon_code || null, discount, (err, orderResult) => {
    if (err) return callback(err);
    const orderId = orderResult.insertId;
    orderModel.addOrderStatusLog(orderId, 'created');

    let index = 0;
    const processNextItem = () => {
      if (index === cartItems.length) {
        return orderModel.clearCart(userId, (err) => {
          if (err) return callback(err);
          return callback(null, { orderId, total, discount });
        });
      }

      const item = cartItems[index];

      orderModel.addOrderItem(orderId, item.product_id, item.quantity, item.price, (err) => {
        if (err) return callback(err);

        orderModel.reduceStock(item.product_id, item.quantity, (err, result) => {
          if (err || result.affectedRows === 0) {
            return callback({
              message: "Insufficient stock",
              productId: [item.product_id]
            });
          }

          index++;
          processNextItem();
        });
      });
    };

    processNextItem();
  });
};

// place Order
const placeOrder = (userId, addressId, coupon_code, callback) => {
  orderModel.beginTransaction((err) => {
    if (err) return callback(err);

    fetchCart(userId, (err, cartItems) => {
      if (err) return orderModel.rollback(() => callback(err));

      validateAddress(userId, addressId, (err, shippingAddress) => {
        if (err) return orderModel.rollback(() => callback(err));

        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        applyCoupon(coupon_code, total, (err, finalTotal, discount) => {
          if (err) return orderModel.rollback(() => callback(err));

          createOrderAndItems(userId, cartItems, shippingAddress, coupon_code, finalTotal, discount, (err, result) => {
            if (err) return orderModel.rollback(() => callback(err));
            orderModel.commit(() => callback(null, result));
          });
        });
      });
    });
  });
};




// Get single order by id
const getOrder = (userId, orderId, callback) => {
  orderModel.getOrderWithItems(orderId, userId, callback);
};

// Get all orders of user
const getOrders = (userId, callback) => {
  orderModel.getOrdersByUser(userId, callback);
};

// cancelling orders
const cancelOrder = (userId, orderId, callback) => {
  orderModel.cancelOrder(orderId, userId, (err, result) => {
    if (err) return callback(err);
    if (result.affectedRows === 0) return callback('Order cannot be cancelled');

    orderModel.addOrderStatusLog(orderId, 'cancelled', () => {});
    callback(null, 'Order cancelled');
  });
};

const getOrdersPaginated = (userId, page = 1, limit = 5, callback) => {
  const offset = (page - 1) * limit;
  orderModel.getOrdersByUserPaginated(userId, limit, offset, callback);
};

const getOrderTimeline = (userId, orderId, callback) => {
  orderModel.getOrder(userId, orderId, (err, orders)=>{
    if(err) return callback(err);
    if(!orders || !orders.length) return callback("Order not found or access denied");
    
    orderModel.getOrderTimeline(orderId, callback);
  })
};

module.exports = {
  placeOrder,
  getOrder,
  getOrders,
  cancelOrder,
  getOrdersPaginated,
  getOrderTimeline,
};
