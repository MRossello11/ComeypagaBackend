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

const putPlate = async(req, res) => {
    const {
        restaurantId,
        plateName,
        description,
        price,
        type
    } = req.body;

    if(
        !restaurantId || 
        !plateName ||
        !price ||
        !type
    ) {
        return res.sendStatus(400);
    }

    const foundRestaurant = await Restaurant.findOne({ _id: restaurantId }).exec();

    if(!foundRestaurant){
        return res.status(500).json({'message':'Restaurant not found'});
    }

    foundRestaurant.menu.push({
        plateName,
        description,
        price,
        type
    });

    try {
        await Restaurant.updateOne(
            { _id: foundRestaurant.id },
            { $set: { menu: foundRestaurant.menu } }
        )

        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': err.message });
    }

}


module.exports = {
    getMenu,
    putPlate
}