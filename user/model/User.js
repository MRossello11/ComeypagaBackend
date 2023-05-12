const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const roles = require('../../config/roles');
const constants = require('../../config/constants').modelConstants;

const userSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    firstname:{
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        street: {
            type: String,
            required: true
        },
        town: {
            type: String,
            required: true
        }
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: roles.USER
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', userSchema)