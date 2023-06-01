const Order = require('../model/Order');
const orderStates = require('../orderStates').orderStates;
const { ObjectId } = require('mongodb');

// get all available orders (not assigned and in progress orders)
const getOrders = async(req, res) => {
    const orders = await Order.find({ riderId: null, state: orderStates.inProgress }).exec();

    res.status(200).json(orders);
}

// get all orders assigned to a rider (that haven't been delivered)
const getOrdersRider = async(req, res) => {
    const riderId = req.params.riderId;
    
    if(!riderId){
        return res.sendStatus(400);
    }

    // get all non-delivered and non-canceled dorders assigned to a rider
    const riderOrders = await Order.find({ riderId: riderId, state: { $nin: [orderStates.delivered, orderStates.canceled] } }).exec();

    // get all orders in progress (without a rider)
    const allOrders = await Order.find({ state: orderStates.inProgress });

    res.status(200).json({riderOrders, allOrders});
}

// changes order state 
const postOrderState = async(req, res) => {
    const { 
        _id,
        newState,
        riderId
    } = req.body;

    if(!_id || !newState || !riderId){
        return res.sendStatus(400);
    }

    const order = await Order.findOne({ _id }).exec();

    if(!order){
        return res.status(500).json({'message':'Order not found'});
    }

    let orderWithoutRider = false;

    if(order.riderId != riderId){
        orderWithoutRider = false; // has rider
    }

    if (ObjectId.isEmpty(order.riderId)) {
        orderWithoutRider = true; // does not have rider
    }

    if(!orderWithoutRider){
        return res.status(500).json({'message':'Order is already taken'});
    }

    if(newState <= order.state){
        return res.status(400).json({'message':'Order status is not valid'})
    }

    const result = await Order.updateOne(
        { _id: order._id},
        { $set: 
            { 
                state: newState,
                riderId: riderId
            }}
    );

    return res.status(200).json({'message':'Order updated'});
}

module.exports = {
    getOrders,
    getOrdersRider,
    postOrderState
}