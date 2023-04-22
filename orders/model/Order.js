const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MongoDB = require('bson');
const orderStates = require('../orderStates');

const orderSchema = new Schema({
    plates: [
        {
            price: {
                type: String,
                required: true
            },
            quantity: {
                type: int,
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
        type: String,
        default: orderStates.inProgress
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
        type: objectId,
        required: false
    },
    userId: {
        type: objectId,
        required: true
    }
});

module.exports = mongoose.model('Order', orderSchema)