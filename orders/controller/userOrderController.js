const Order = require('../model/Order');
const orderStates = require('../orderStates');

// get all non-delivered orders from a user
const getOrdersUser = async(req, res) => {
    const { userId } = req.body;

    if(!userId){
        return res.sendStatus(400);
    }

    const userOrders = await Order.find({ userId: userId, state: { $ne: orderStates.delivered }}).exec();

    res.json(userOrders);
}

const putOrder = async(req,res) => {
    const {
        plates,
        shippingAddress,
        arrivalTime,
        restaurantName,
        userId
    } = req.body;

    // check attributes
    if(
        !plates ||
        !shippingAddress ||
        !arrivalTime ||
        !restaurantName ||
        !userId
    ){
        return res.sendStatus(400);
    }

    if (!Array.isArray(plates)) {
        return res.status(400).send({ error: "Plates must be a list" });
    }

    for (const plate of plates) {
        if (!plate.name || !plate.quantity || !plate.price || !plate.id) {
            return res.status(400).send({ error: "Each plate must have an id, name, quantity, and price" });
        }
    }

    if(!shippingAddress.street || !shippingAddress.town){
        return res.status(400).send({ error: "Shipping address is incomplete (needs: street and town)" });
    }

    // check duplicates (1 order per user in a restaurant)
    const duplicate = await Order.findOne({ userId: userId, restaurantName: restaurantName}).exec();

    if(duplicate){
        return res.status(409).json({error:'Only one order per restaurant is allowed'});
    }
    try {
        const result = await Order.create({
            plates,
            shippingAddress,
            arrivalTime,
            restaurantName,
            userId
        });
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({error:error})
    }
}
module.exports = {
    getOrdersUser,
    putOrder
}