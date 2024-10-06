const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  available: { type: Boolean, default: true }
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  menu: [menuItemSchema]
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
