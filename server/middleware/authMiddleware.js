const jwt = require('jsonwebtoken');
const User = require('../models/User')

const protect = async (req, res, next) => {
    let token;

    // token are sent as: Authorization: Bearer <token>
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            // split "Bearer sdhfjag..." and take just the token part
            token = req.headers.authorization.split(' ')[1];

            // verify the token was signed with our secret and isn't expired/tampered
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // fetch the user, excluding the password field, attach to req
            req.user = await User.findById(decoded.id).select('-password');

            next(); // move to the actual route handler
        }catch(error){
            res.status(401).json({ messgae: 'Not authorized, token invalid.' });
        }
    } else{
        res.status(401).json({ messgae: 'Not authorized, token invalid.' });
    }
};

// saparate middleware: checks role AFTER protect has already run
const requireRole = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.stauts(403).json({ messgae: 'Access denied for your role.'});
        }
        next();
    };
};

module.exports = { protect, requireRole };
