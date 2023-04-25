const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MongoDB = require('bson');

const restaurantSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    foodType: { // Italian, Japanese, hamburguers, pizza...
        type: String,
        required: true
    },
    typology: { // Fast-food, gourmet, buffet...
        type: String,
        required: true
    },
    reviewStars: { // 3.5, 4.5
        type: String,
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
    picture: { // path?
        type: String,
        required: false
    },
    // price: { // is computed
    //     type: String,
    //     required: true
    // }
    menu: [
        {
            plateName: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            price: {
                type: MongoDB.Decimal128,
                required: true
            },
            type: { // entrante, principal, bebida...
                type: String,
                required: true
            }
        }
    ]
});

module.exports = mongoose.model('Restaurant', restaurantSchema)