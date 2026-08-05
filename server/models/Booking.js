const mongoose = require('mongoose');

const bookingScheme = new mongoose.Schema(
    {
        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        practitioner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        date: {
            type: Date,
            required: [true, 'Booking date is required'],
        },
        timeSlot: {
            type: String,
            required: [true, 'Time slot is required'],
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'completed', 'cancelled'],
            default: 'pending',
        },
        notes: {
            type: String,
            default: '',
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model('Booking', bookingScheme);  