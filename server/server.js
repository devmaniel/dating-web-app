require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Import Sequelize models
const { sequelize } = require('./models/index_sequelize');

// Import Socket.IO
const { initializeSocket } = require('./socket');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const routes = require('./routes');

// Root route - Hello World
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Mount all routes
app.use(routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Sync Sequelize models with database
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced successfully');

    // Initialize Socket.IO
    const io = initializeSocket(server);
    
    // Make io instance available to routes
    app.set('io', io);

    server.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log(`🔌 Socket.IO ready for connections`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
