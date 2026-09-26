const express = require('express');
const router = express.Router();
const { createMockSubscription, getMySubscription } = require('../controllers/subscriptionController');
const { protect, requireRole } = require('../middleware/authMiddleware');

router.post('/mock', protect, requireRole('member'), createMockSubscription);
router.get('/me', protect, requireRole('member'), getMySubscription);

module.exports = router;