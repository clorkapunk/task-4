const mongoose=require('mongoose').default;
const db = require('../db');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    password:String,
    name:String,
    lastLoginTime: {
        type: Date,
        required: true,
        default: Date.now
    },
    registrationTime: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Blocked', 'Active'],
        required: true,
        default: 'Active'
    }
});

const historySchema = new mongoose.Schema({
    executor: {
        type: String,
        required: true
    },
    victim: {
        type: String,
        required: true
    },
    changedTo: {
        type: String,
        enum: ['Blocked', 'Active', 'Deleted'],
        required: true,
        default: 'Active'
    }
}, { timestamps: {createdAt: true, updatedAt: false} });

const User = mongoose.model('users', userSchema)
const History = mongoose.model('histories', historySchema)

module.exports = {User, History}
