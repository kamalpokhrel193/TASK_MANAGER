const express = require('express');
const router = express.Router();
const { register, login, getUsers } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);

// Only for Admins
router.get('/users', protect, authorize('Admin'), getUsers);

module.exports = router;