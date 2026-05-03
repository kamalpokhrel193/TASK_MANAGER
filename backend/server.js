const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Initialize Database Connection
connectDB();

// Global Middleware
app.use(express.json());
app.use(cors());

// Route Definitions
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Root Health Check Endpoint
app.get('/', (req, res) => res.send('Task Manager API Service Running...'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server successfully started on port ${PORT}`);
});