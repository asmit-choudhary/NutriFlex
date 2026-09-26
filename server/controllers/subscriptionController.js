const Subscription = require('../models/Subscription');

const planPrices = {
    basic: 499,
    pro: 999,
    elite: 1799,
};

// Post /api/subscriptions/mock 
const createMockSubscription = async (req, res) => {
    try{
        const { plan } = req.body;

        if(!planPrices[plan]){
            return res.status(400).json({ message: 'Invalid plan' });
        }

        const subscription = await Subscription.create({
            member: req.user._id,
            plan,
            amount: planPrices[plan],
            status: 'mock_paid',
        });

        res.status(201).json(subscription);
    } catch(error){
        res.status(500).json({ message: error.message });
    }
};

// Get /api/subscriptions/me 
const getMySubscription = async (req, res) => {
    try{
        const subscription = await Subscription.findOne({ member: req.user._id }).sort({ createdAt: -1 });
        res.json(subscription);
    } catch(error){
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createMockSubscription, getMySubscription };