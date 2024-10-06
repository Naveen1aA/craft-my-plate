const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server);

const userRoutes = require('./routes/user');
const restaurantRoutes = require('./routes/restaurant');
const orderRoutes = require('./routes/order');

app.use('/api', userRoutes);
app.use('/api', restaurantRoutes);
app.use('/api', orderRoutes);

// WebSocket connection for real-time order tracking
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('order-status', (orderId) => {
    // Simulate real-time order status updates
    setTimeout(() => {
      io.emit(`order-${orderId}-status`, 'Confirmed');
    }, 3000);
    setTimeout(() => {
      io.emit(`order-${orderId}-status`, 'Out for Delivery');
    }, 5000);
  });
});


//non-sql database mongodb for database
mongoose.connect("mongodb+srv://naveenmallireddi1919:799788@cluster0.urugw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    server.listen(5000, () => {
      console.log(`Server running on port ${5000}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  });

