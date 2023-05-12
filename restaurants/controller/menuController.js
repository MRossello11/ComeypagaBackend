const Restaurant = require('../model/Restaurant');

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

        res.status(200).json({ 'message': `Plate ${plateName} created` });;
    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': "An error occurred creating the plate" });
    }

}

const postPlate = async(req, res) => {
    const {
        restaurantId,
        plateId,
        plateName,
        description,
        price,
        type
    } = req.body;

    if(!restaurantId || !plateId){
        return res.sendStatus(400);
    }

    const foundRestaurant = await Restaurant.findOne({ _id: restaurantId }).exec();


    if(!foundRestaurant){
        return res.status(500).json({'message':'Restaurant not found'});
    }

    const plate = foundRestaurant.menu.find(plate => plate.id === plateId);

    const index = foundRestaurant.menu.indexOf(plate);
    //modify attributes
    if(plateName){
        plate.plateName = plateName;
    }

    if (description) {
        plate.description = description;
    }

    if (price) {
        plate.price = price;
    }

    if (type) {
        plate.type = type;
    }

    foundRestaurant.menu[index] = plate;

    try{
        await Restaurant.updateOne(
            { _id: foundRestaurant.id },
            {
                $set: {
                    menu: foundRestaurant.menu
                }
            }
        )
        res.status(200).json({ 'message': "Plate modified" });;
    } catch(err){
        console.error(err);
        res.status(500).json({ 'message': "An error occurred modifying the plate" });
    }

}

const deletePlate = async(req,res) => {
    const {
        restaurantId,
        plateId
    } = req.body;

    try{
        // soft delete plate
        await Restaurant.findOneAndUpdate(
            { _id: restaurantId, "menu._id": plateId },
            { $set: { "menu.$.isDeleted": true } },
            { new: true }
        ).exec();

        res.sendStatus(200);
    } catch(err){
        console.error(err);
        res.status(500).json({"message":err.message});
    }
}

module.exports = {
    putPlate,
    postPlate,
    deletePlate
}