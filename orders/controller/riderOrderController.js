const Order = require('../model/Order');
const orderStates = require('../orderStates');

// get all orders for rider menu (all non-delivered and 
// filtering out the ones not assigned to the rider)
const getOrdersRider = async(req, res) => {
    const { riderId } = req.body;
    
    if(!riderId){
        return res.sendStatus(400);
    }

    // get all non-delivered orders assigned to a rider
    const riderOrders = await Order.find({ riderId: riderId, state: { number: { $ne: orderStates.deliveredNumber } } }).exec();

    // get all orders in progress (without a rider)
    const allOrders = await Order.find({ state: orderStates.inProgress });

    res.json({riderOrders, allOrders});
}

// changes order state 
const postOrderState = async(req, res) => {
    const { 
        orderId,
        newState
    } = req.body;

    if(!orderId || !newState){
        return res.sendStatus(400);
    }

    const order = await Order.findOne({ _id: orderId }).exec();

    if(!order){
        return res.status(500).json({'message':'Order not found'});
    }

    if(newState <= order.state.number){
        return res.status(400).json({'message':'Order status is not valid'})
    }

    const result = await Order.updateOne(
        { _id: order.id},
        { $set: { state: { number: newState, description: orderStates.orderStatesList[newState] }}}
    );

    res.status(200).json(result);
}

module.exports = {
    getOrdersRider
}