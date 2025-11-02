import mongoose from 'mongoose';
import bycrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Passenger', 'Admin'],
        required: true,
    },
    // mobileNumber: {
    //     type: String,
    //     unique: true,
    //     sparse: true,
    // },
    email: {
        type: String,
        unique: true,
        sparse: true,
    },
    password: {
        type: String,
        required: function(){ return this.role === 'Admin'; },
    },
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date,
    },
    refreshToken: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bycrypt.genSalt(10);
    this.password = await bycrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword= async function(enteredPassword) {
    return await bycrypt.compare(enteredPassword, this.password);
};
const User = mongoose.model('User', userSchema);

export default User;