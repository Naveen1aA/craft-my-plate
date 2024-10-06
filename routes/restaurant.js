const express = require('express');
const Restaurant = require('../models/Restaurant');
const router = express.Router();

// Create a restaurant
router.post('/restaurants', async (req, res) => {
  const { name, location } = req.body;
  const restaurant = new Restaurant({ name, location, menu: [] });
  try {
    await restaurant.save();
    res.status(201).json({ message: 'Restaurant created successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add a menu item
router.post('/restaurants/:restaurantId/menu', async (req, res) => {
  const { name, description, price, available } = req.body;
  const restaurant = await Restaurant.findById(req.params.restaurantId);

  if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

  restaurant.menu.push({ name, description, price, available });
  await restaurant.save();
  
  res.status(201).json({ message: 'Menu item added successfully' });
});

// Update a menu item
router.put('/restaurants/:restaurantId/menu/:itemId', async (req, res) => {
  const { name, description, price, available } = req.body;
  const restaurant = await Restaurant.findOneAndUpdate(
    { _id: req.params.restaurantId, 'menu._id': req.params.itemId },
    { $set: { 'menu.$': { name, description, price, available } } },
    { new: true }
  );

  res.json({ message: 'Menu item updated successfully' });
});

module.exports = router;
