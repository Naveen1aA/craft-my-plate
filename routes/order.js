const express = require('express');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Place an order
router.post('/orders', authMiddleware, async (req, res) => {
  const { restaurantId, items, deliveryAddress } = req.body;
  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

  const totalCost = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = new Order({
    user: req.user.userId,
    restaurant: restaurantId,
    items,
    deliveryAddress,
    totalCost
  });

  try {
    await order.save();
    res.status(201).json({ message: 'Order placed successfully', orderId: order._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get order status
router.get('/orders/:orderId', authMiddleware, async (req, res) => {
  const order = await Order.findById(req.params.orderId).populate('restaurant');

  if (!order) return res.status(404).json({ message: 'Order not found' });

  res.json(order);
});

module.exports = router;
