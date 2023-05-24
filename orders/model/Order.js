const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MongoDB = require('bson');
const orderStates = require('../orderStates').orderStates;

const orderSchema = new Schema({
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
        type: Number,
        default: orderStates.created
    },
    arrivalTime: {
        type: Date,
        required: false,
        default: null
    },
    restaurantId: {
        type: MongoDB.ObjectId,
        required: true
    },
    restaurantName : {
        type: String,
        required: true
    },
    userId: {
        type: MongoDB.ObjectId,
        required: true
    },
    riderId:{ 
        type: MongoDB.ObjectId,
        default: null
    },
    orderLines: [
        {
            plateId: {
                type: MongoDB.ObjectId,
                required: true
            },
            plateName: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: false
            },
            price: {
                type: String,
                required: true
            }
        }
    ]
});

module.exports = mongoose.model('Order', orderSchema)