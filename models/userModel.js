const mongoose = require('mongoose');

const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    admin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    deletedAt: { type: Date, default: null },
    history: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Weather'
    }],
    archiveHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Archive'
    }],
    countryHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country'
    }],

}, { collection: 'users' })

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;