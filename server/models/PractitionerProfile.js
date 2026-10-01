const mongoose = require('mongoose');

const practitionerProfileScheme = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,  // store just the User's_id, not the full copy
            ref: 'User',  // tells mongoose this ID points to the User model
            required: true,
            unique: true, // one profile per user - a partitioner can't have 2 profile
        },
        specialty: {
            type: String,
            enum: ['yoga', 'strength_training', 'meditation', 'physical_therapy'],
            required: [true, 'Specialty is required'],
        },
        bio: {
            type: String,
            maxlength: 500,
            default: '',
        },
        ratePerSession: {
            type: Number,
            required: [true, 'Rate per session is required'],
            min: 0,
        },
        yearsExperience: {
            type: Number,
            default: 0,
        },
        availability: [
            {
                day: {
                    type: String,
                    enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                },
                slots: [String],
            },
        ],
        isApproved: {
            type: Boolean,
            default: true, //switch back to false once an admin approval flow exists
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('PractitionerProfile', practitionerProfileScheme);