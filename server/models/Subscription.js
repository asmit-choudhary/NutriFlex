const mongoose = require('mongoose')

const subscriptionSchema = new mongoose.Schema(
    {
        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        plan: {
            type: String,
            enum: ['basic', 'pro', 'elite'],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            default: 'mock_paid',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);