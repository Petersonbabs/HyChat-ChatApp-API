import mongoose, { Schema, Model, model } from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new Schema({

    fullName: {
        type: String,
        required: [true, 'Please provide an email']
    },

    email: {
        type: String,
        unique: [true, 'This email already exists'],
        required: [true, 'Please provide an email'],
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },

    userName: {
        type: String,
        unique: [true, 'This username already exists'],
        required: [true, 'Please provide an username'],
        min: [3, 'username must be at least 3 characters.']
    },

    phoneNumber: {
        type: Number,
    },

    gender: {
        type: String,
        required: [true, 'Kindly choose a gender'],
        enum: ['male', 'female']
    },

    profilePic: {
        type: String,
        default: ''
    },

    password: {
        type: String,
        required: [true, 'Please provide a password'],
        select: false
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    verificationToken: {
        type: String,
    },

    verificationExpiration: {
        type: Date
    }

}, { timestamps: true })

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
      return next();
    }
    
    try {
      const hashedPassword = await bcrypt.hash(this.password, 12);
      this.password = hashedPassword;
      next();
    } catch (error) {
      next(error);
    }
  });


const user = mongoose.model('user', userSchema)

export default user