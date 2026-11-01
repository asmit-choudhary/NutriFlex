const Booking = require('../models/Booking');
const User = require('../models/User');
const PractitionerProfile = require('../models/PractitionerProfile');

// POST /api/bookings  (member creates a booking)
const createBooking = async (req, res) => {
  try {
    const { practitioner, date, timeSlot, notes } = req.body;

    // 1. the practitioner must be a real user with role "practitioner"
    const practitionerUser = await User.findOne({ _id: practitioner, role: 'practitioner' });
    if (!practitionerUser) {
      return res.status(400).json({ message: 'Invalid practitioner' });
    }

    // 2. the date must be valid and not in the past
    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date' });
    }
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    if (bookingDate < today) {
      return res.status(400).json({ message: 'You cannot book a date in the past' });
    }

    // 3. the practitioner must actually offer this day and time slot
    const profile = await PractitionerProfile.findOne({ user: practitioner });
    if (!profile) {
      return res.status(400).json({ message: 'This practitioner has not set up a profile yet' });
    }
    const dayLabel = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][bookingDate.getUTCDay()];
    const dayAvailability = profile.availability.find((a) => a.day === dayLabel);
    if (!dayAvailability || !dayAvailability.slots.includes(timeSlot)) {
      return res.status(400).json({ message: 'That time slot is not available' });
    }

    // 4. nobody else may already hold this slot (cancelled bookings free it up)
    const alreadyBooked = await Booking.findOne({
      practitioner,
      date: bookingDate,
      timeSlot,
      status: { $ne: 'cancelled' },
    });
    if (alreadyBooked) {
      return res.status(409).json({ message: 'That slot has just been booked. Please pick another.' });
    }

    const booking = await Booking.create({
      member: req.user._id,
      practitioner,
      date: bookingDate,
      timeSlot,
      notes,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/bookings/me (member views their own bookings)
const getMyBookings = async (req, res) => {
    try{
        const bookings = await Booking.find({ member: req.user._id })
        .populate('practitioner', 'name email').sort({ date: 1 }); // soonest first

        res.json(bookings);
    } catch (error){
        res.status(500).json({ message: error.message });
    }
};

// GET /api/bookings/practitioner  (practitioner views bookings made with them)
const getPractitionerBookings = async (req, res) => {
    try{
        const bookings = await Booking.find({ practitioner: req.user._id })
        .populate('member', 'name email').sort({ date: 1 }); 

        res.json(bookings);
    } catch (error){
        res.status(500).json({ message: error.message });
    }
};

// Patch /api/booking/:id (practitioner updates stauts: confirm/ cancel, complete)
const updateBookingStatus = async (req, res) => {
    try{
        const { status } = req.body;

        const booking = await Booking.findById(req.params.id);
        if(!booking){
            res.status(404).json({ message: 'Booking not found' });
        }

        // ownership check — this is the important part. Without this, ANY logged-in
        // practitioner could update ANY booking, not just their own.
        if(booking.practitioner.toString() != req.user._id.toString()){
            return res.status(403).json({ message: 'Not autorized to update this booking.'});
        }

        booking.status = status;
        await booking.save();

        res.json(booking);
    } catch (error){
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createBooking, getMyBookings, getPractitionerBookings, updateBookingStatus };