const Order = require('../model/Order');
const orderStates = require('../orderStates').orderStates;
const { verifyAddress } = require('../../config/verifyAddress');

// get all non-delivered orders from a user
const getOrdersUser = async(req, res) => {
    const { userId } = req.body;

    if(!userId){
        return res.sendStatus(400);
    }

    const userOrders = await Order.find({ userId: userId, state: { $nin: [orderStates.delivered, orderStates.canceled] }}).exec();

    res.status(200).json({'orders':userOrders});
}

// create or modify order
const postOrder = async(req, res) => {
    const {
        _id,
        shippingAddress,
        state,
        arrivalTime,
        restaurantId,
        restaurantName,
        userId,
        orderLines
    } = req.body;
    console.log("Post order");

    if(_id){
        // order already exists, update
        const foundOrder = await Order.findOne({ _id }).exec();

        if(!foundOrder){
            return res.status(500).json({'message':"Order not found"})
        }

        // only orders in progress can be modified
        if (foundOrder.state > orderStates.inProgress) {
            return res.status(500).json({ 'message': 'Order is not in preparation, cannot modify' });
        }

        const order = await Order.findOneAndUpdate(
            { _id },
            { $set: { orderLines }},
            { new: true}
        ).exec();

        return res.status(200).json({ 'order': order });
    } else {
        // check attributes
        if (
            !verifyAddress(shippingAddress) ||
            !restaurantId ||
            !restaurantName ||
            !userId
        ) {
            console.log(req.body);
            return res.status(400).json({'message':'Invalid request'});
        }

        // check order lines?
        if (!Array.isArray(orderLines)) {
            return res.status(400).json({ 'message': "Orderlines must be a list" });
        }
        for (const orderLine of orderLines) {
            if (!orderLine.plateName || !orderLine.quantity || !orderLine.price || !orderLine.plateId) {
                return res.status(400).json({ 'message': "Each plate must have an id, name, quantity, and price" });
            }
        }

        console.log("Verified");
        // check duplicates (1 order per user in a restaurant)
        const duplicate = await Order.findOne({ userId, restaurantId }).exec();

        if (duplicate) {
            return res.status(409).json({ 'message': 'Only one order per restaurant is allowed' });
        }

        // create order
        const order = await Order.create({
            shippingAddress,
            state,
            arrivalTime,
            restaurantId,
            restaurantName,
            userId,
            orderLines,
        });

        return res.status(201).json({'order':order})
    }

}

// delete order
const deleteOrder = async(req,res) => {
    const _id = req.params.id;

    // check attributes
    if(!_id){
        return res.sendStatus(400);
    }

    // get order
    const order = await Order.findOne({ _id }).exec();

    if(!order){
        return res.status(500).json({'message':'Order not found'});
    }

    // only orders in progress can be modified
    if(order.state > orderStates.orderStates.inProgressNumber){
        return res.status(500).json({'message':'Order is not in preparation, cannot modify'});
    }

    try {
        // cancel order    
        await Order.updateOne(
            { _id: order._id },
            { $set: { state: orderStates.canceled }}
        );

        res.sendStatus(200);
    } catch (error) {
        res.send(500).json({'message':'An error occurred'})
    }
}

module.exports = {
    getOrdersUser,
    postOrder,
    deleteOrder
}