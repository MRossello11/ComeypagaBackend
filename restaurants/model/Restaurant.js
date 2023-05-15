const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
                type: String,
                required: true
            },
            type: { // starter, main (dish), drink, dessert...
                type: String,
                required: true
            },
            isDeleted: {
                type: Boolean,
                default: false
            }
        }
    ],
    isDeleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Restaurant', restaurantSchema)