const Order = require('../model/Order');
const orderStates = require('../orderStates');

// get all orders for rider menu 
const getOrders = async(req, res) => {
    
}

// get all orders for rider menu (all non-delivered and 
// filtering out the ones not assigned to the rider)
const getOrdersRider = async(req, res) => {
    const { riderId } = req.body;

    // get all non-delivered orders assigned to a rider
    const riderOrders = await Order.find({ riderId: riderId, state: { $ne: orderStates.delivered } }).exec();

    // get all orders in progress (without a rider)
    const allOrders = await Order.find({ state: orderStates.inProgress });

    res.json({riderOrders, allOrders});
}

// get all non-delivered orders from a user
const getOrdersUser = async(req, res) => {
    const { userId } = req.body;

    const userOrders = await Order.find({ userId: userId, state: { $ne: orderStates.delivered }}).exec();

    res.json(userOrders);
}


module.exports = {
    getOrdersRider,
    getOrdersUser
}