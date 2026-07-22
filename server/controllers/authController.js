const User = require('../models/User');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// helper: creates a ssingle token containing the user's id and role
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role }, // playload: what's storing inside the token
        process.env.JWT_SECRET,   // a secret key only server knows, used to sign it
        { expiresIn: '7d' }  // token become invalid after 7 days
    );
};

// POST /api/auth/regsiter
const registerUser = async (req, res) => {
    try{
        const { name, email, password, role } = req.body;

        // 1. check if a user with this email already exist.
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({ message: 'Email already register' });
        }

        // 2. hash the password - never save plain text
        const salt = await bcrypt.genSalt(10);  // "salt" adds randomness so identical password don't produce identical hashes
        const hashedPassword = await bcrypt.hash(password, salt);
        
        //3. create new user with hashed passowrd
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        //4. response with a token so they're immediately logged in after registering 
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user),
        });
    } catch(error){
        res.status(500).json({ message: error.message });
    }
};

// POST /api/auth/login
const loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;

        //1. find user
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // 2. compare the entered password against the stored hash 
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        //3. success -issue a token
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user),
        });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

// GET /api/auth/me
const getMe = async (req, res) => {
    res.json(req.user);  // req.user was already attached by the protect middleware 
};

module.exports = { registerUser, loginUser, getMe };