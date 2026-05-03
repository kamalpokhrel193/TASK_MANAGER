const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTaskStatus } = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Fetch tasks based on user role (Admin: all, Member: assigned)
router.get('/', protect, getTasks);

// Restricted to Admin role only
router.post('/', protect, authorize('Admin'), createTask);

// Update task status by ID
router.patch('/:id', protect, updateTaskStatus);

module.exports = router;