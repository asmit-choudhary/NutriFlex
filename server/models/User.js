const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,  // removes accidental leading/tailing spaces
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,  // MongoDB will reject a second user with the same email
            lowercase: true,  // stores "Asmit@X.com" as "asmit@x.com" so lookups are consistent
            trim: true, 
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6,
            // note: this stores the HASHED password, never the plain text
        },
        role: {
            type: String,
            enum: ['member', 'practitioner'], // only these two values are allowed
            default: 'member',
        },
    },
    {
        timestamps: true,  // automatically adds createdAt and updatedAt fields
    }
);

module.exports = mongoose.model('User', userSchema);