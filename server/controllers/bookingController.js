const Booking = require('../models/Booking');
const User = require('../models/User');

// POST /api/bookings (member create a booking)
const createBooking = async (req, res) => {
    try{
        const { practitioner, date, timeSlot, notes } = req.body;

        const practitionerUser = await User.findOne({ _id: practitioner, role: 'practitioner', });
        if(!practitionerUser){
            return res.status(400).json({ message: 'Invalid Practitioner'});
        }

        const booking = await Booking.create({
            member: req.user._id,  // taken from the logged-in user, never trusted from req.body
            practitioner,
            date,
            timeSlot,
            notes,
        });

        res.status(200).json(booking);
    } catch (error){
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