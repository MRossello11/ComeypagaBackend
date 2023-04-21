const Restaurant = require('../model/Restaurant');

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
        street,
        town,
        picture,
        menu
    } = req.body;

    if(
        !name ||
        !foodType || 
        !typology || 
        !reviewStars || 
        !phone || 
        !email || 
        !street || 
        !town
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
            address: {
                street,
                town
            },
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

    const foundRestaurant = await Restaurant.findOne({ _id: id });

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
    }

}

module.exports = {
    getRestaurants,
    putRestaurant,
    postRestaurant
}