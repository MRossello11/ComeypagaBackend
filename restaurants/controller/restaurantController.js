const Restaurant = require('../model/Restaurant');

// get all restaurants
const getRestaurants = async(req,res) => {
    const restaurants = await Restaurant.find().exec();

    if(!restaurants) return res.sendStatus(204);

    res.status(200).json(restaurants);
}

// create new restaurant
const postRestaurant = async(req, res) => {
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

module.exports = {
    getRestaurants,
    postRestaurant
}