const express = require('express');
const router = express.Router();
const {
    createBooking,
    getMyBookings,
    getPractitionerBookings,
    updateBookingStatus, 
} = require('../controllers/bookingController');
const { protect, requireRole } = require('../middleware/authMiddleware');

router.post('/', protect, requireRole('member'), createBooking);
router.get('/me', protect, requireRole('member'), getMyBookings);
router.get('/practitioner', protect, requireRole('practitioner'), getPractitionerBookings);
router.patch('/:id', protect, requireRole('practitioner'), updateBookingStatus);

module.exports = router;