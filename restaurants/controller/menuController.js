const Restaurant = require('../model/Restaurant');

const getMenu = async(req, res) => {
    const {
        restaurantId
    } = req.body;

    if(!restaurantId){
        return res.status(400).json({'message':'restaurantId is required'});
    }

    const foundRestaurant = await Restaurant.findOne({ _id: restaurantId }).exec();

    if(!foundRestaurant){
        return res.status(500).json({'message':'Restaurant not found'});
    }

    res.status(200).json(foundRestaurant.menu);
}

module.exports = {
    getMenu
}