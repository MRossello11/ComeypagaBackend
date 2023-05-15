const Restaurant = require('../model/Restaurant');
const { verifyAddress } = require('../../config/verifyAddress');

// get all restaurants
const getRestaurants = async(req,res) => {
    const restaurants = await Restaurant.find(
        { isDeleted: false },
        { menu: { $elemMatch: { isDeleted: false } }, isDeleted: false },
    ).exec();

    if (!restaurants) return res.sendStatus(204);

    res.status(200).json({ "restaurants": restaurants });
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
        console.log("Not valid")
        return res.sendStatus(400);
    }

    const duplicate = await Restaurant.findOne({ name: name, isDeleted: false }).exec();

    if(duplicate) return res.status(409).json({ 'message': "Restaurant already exists" });;

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


        res.status(201).json({ "restaurant": result});;
    } catch(err){
        res.status(500).json({ 'message': "An error occurred creating the restaurant" });
    }
}

const postRestaurant = async(req, res) => {
    const {
        _id,
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
    console.log(req.body);

    if(!_id){
        return res.sendStatus(400);
    }

    const foundRestaurant = await Restaurant.findOne({ _id }).exec();

    if(!foundRestaurant){
        return res.status(500).json({'message':'Restaurant not found'});
    }


    try{
        const street = address.street;
        const town = address.town;

        // update the non-null parameters
        await Restaurant.updateOne(
            { _id: foundRestaurant._id },
            {
                $set: {
                    name: name ? name : foundRestaurant.name,
                    foodType: foodType ? foodType : foundRestaurant.foodType,
                    typology: typology ? typology : foundRestaurant.typology,
                    reviewStars: reviewStars ? reviewStars : foundRestaurant.reviewStars,
                    phone: phone ? phone : foundRestaurant.phone,
                    email: email ? email : foundRestaurant.email,
                    address: {
                        street: street ? street : foundRestaurant.address.street,
                        town: town ? town : foundRestaurant.address.town
                    },
                    picture: picture ? picture : foundRestaurant.picture,
                    menu: menu ? menu : foundRestaurant.menu
                }
            }
        );
        res.status(200).json({ "restaurant": foundRestaurant});;
    } catch(err){
        console.error(err);
        res.status(500).json({ 'message': err.message });
    }

}

const deleteRestaurant = async(req, res) => {
    const _id = req.params.id;

    const foundRestaurant = await Restaurant.findOne({ _id }).exec();

    if(!foundRestaurant){
        return res.status(500).json({'message':'Restaurant not found'});
    }

    try {
        await Restaurant.updateOne(
            { _id: foundRestaurant._id },
            { $set: { isDeleted: true }}
        );
        res.status(200).json({ 'message': "Restaurant deleted" });;
    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': "An error occurred deleting the restaurant" });
    }

}

const getRestaurant = async(req, res) => {
    const _id = req.params.id;

    if(!_id){
        return res.sendStatus(400);
    }

    const foundRestaurant = await Restaurant.findOne({ _id }).exec();

    if(!foundRestaurant){
        return res.status(500).json({'message':'Restaurant not found'});
    }

    return res.status(200).json({ "restaurant": foundRestaurant });
}

module.exports = {
    getRestaurant,
    getRestaurants,
    putRestaurant,
    postRestaurant,
    deleteRestaurant
}