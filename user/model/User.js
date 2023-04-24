const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
        user: { // 10
            type: Number
        },
        rider: { // 20
            type: Number,
        },
        admin: { // 30
            type: Number,
        }
    }
});

module.exports = mongoose.model('User', userSchema)