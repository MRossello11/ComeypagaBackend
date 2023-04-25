const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MongoDB = require('bson');
const orderStates = require('../orderStates').orderStates;

const orderSchema = new Schema({
    plates: [
        {
            id: {
                type: MongoDB.ObjectId,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: false
            },
            price: {
                type: MongoDB.Decimal128,
                required: true
            }
        }
    ],
    shippingAddress: {
        street: {
            type: String,
            required: true
        },
        town: {
            type: String,
            required: true
        }
    },
    state: {
        number: {
            type: Number,
            default: orderStates.inProgressNumber

        },
        description: {
            type: String,
            default: orderStates.inProgress
        }
    },
    arrivalTime: {
        type: Date,
        required: true
    },
    restaurantName: {
        type: String,
        required: true
    },
    riderId:{ 
        type: MongoDB.ObjectId,
        default: null
    },
    userId: {
        type: MongoDB.ObjectId,
        required: true
    }
});

module.exports = mongoose.model('Order', orderSchema)