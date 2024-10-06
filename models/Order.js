const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [{ name: String, price: Number, quantity: Number }],
  deliveryAddress: String,
  totalCost: Number,
  status: { type: String, enum: ['Pending', 'Confirmed', 'In Progress', 'Out for Delivery', 'Delivered'], default: 'Pending' }
});

module.exports = mongoose.model('Order', orderSchema);
