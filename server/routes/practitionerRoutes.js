const express = require('express');
const router = express.Router();
const {
    upsertMyProfile,
    getPractitioners,
    getPractitionersById,
} = require('../controllers/practitionerController');
const { protect, requireRole } = require('../middleware/authMiddleware');

//public routes - no login needed to browse
router.get('/', getPractitioners);
router.get('/:id', getPractitionersById);

// protected - only logged-in practitioners can create/update their own profile 
router.post('/profile', protect, requireRole('practitioner'), upsertMyProfile);

module.exports = router;