const Restaurant = require('../model/Restaurant');
const { verifyAddress } = require('../../config/verifyAddress');

// get all restaurants
const getRestaurants = async(req,res) => {
    const restaurants = await Restaurant.find().exec();

    if(!restaurants) return res.sendStatus(204);

    res.status(200).json(restaurants);
}

// create new restaurant
const putRestaurant = async(req, res) => {
    const {
        name,
        foodType,
        typology,
        reviewStars,
        phone,
        email,
        address,
        picture,
        menu
    } = req.body;

    // verify fields
    if(
        !name ||
        !foodType || 
        !typology || 
        !reviewStars || 
        !phone || 
        !email ||
        !verifyAddress(address)
    ){
        return res.sendStatus(400);
    }

    const duplicate = await Restaurant.findOne({ name: name }).exec();

    if(duplicate) return res.sendStatus(409);

    // if no duplicate found, create restaurant
    try{
        let restaurantMenu;
        if(!menu){
            restaurantMenu = [];
        } else {
            restaurantMenu = menu
        }
        let restaurantPicture;
        if(!picture){
            restaurantPicture = "";
        } else {
            restaurantPicture = picture
        }

        const result = await Restaurant.create({
            name,
            foodType,
            typology,
            reviewStars,
            phone,
            email,
            address,
            restaurantPicture,
            restaurantMenu
        });

        console.log(result);

        res.status(201).json({ 'success': `New restaurant ${name} created!` });
    } catch(err){
        res.status(500).json({ 'message': err.message });
    }
}

const postRestaurant = async(req, res) => {
    const {
        id,
        name,
        foodType,
        typology,
        reviewStars,
        phone,
        email,
        street,
        town,
        picture,
        menu
    } = req.body;

    if(!id){
        return res.sendStatus(400);
    }

    const foundRestaurant = await Restaurant.findOne({ _id: id }).exec();

    if(!foundRestaurant){
        return res.status(500).json({'message':'Restaurant not found'});
    }

    try{
        await Restaurant.updateOne(
            { _id: foundRestaurant.id },
            {
                $set: {
                    name: name ? name : foundRestaurant.name,
                    foodType: foodType ? foodType : foundRestaurant.foodType,
                    typology: typology ? typology : foundRestaurant.typology,
                    reviewStars: reviewStars ? reviewStars : foundRestaurant.reviewStars,
                    phone: phone ? phone : foundRestaurant.phone,
                    email: email ? email : foundRestaurant.email,
                    address: {
                        street: street ? street : foundRestaurant.street,
                        town: town ? town : foundRestaurant.town
                    },
                    picture: picture ? picture : foundRestaurant.picture,
                    menu: menu ? menu : foundRestaurant.menu
                }
            }
        );
        res.sendStatus(200);
    } catch(err){
        console.error(err);
        res.status(500).json({ 'message': err.message });
    }

}

const deleteRestaurant = async(req, res) => {
    const { id } = req.body;

    const foundRestaurant = await Restaurant.findOne({ _id: id }).exec();

    if(!foundRestaurant){
        return res.status(500).json({'message':'Restaurant not found'});
    }

    try {
        await Restaurant.deleteOne(
            { _id: foundRestaurant.id }
        );
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': err.message });
    }

}

module.exports = {
    getRestaurants,
    putRestaurant,
    postRestaurant,
    deleteRestaurant
}