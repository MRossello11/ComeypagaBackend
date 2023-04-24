const User = require('../model/User');

// get all rider users
const getRiders = async(req, res) => {
    const riders = await User.find({ 'role.rider': 20 }).exec();

    res.status(200).json(riders);
};


module.exports = {
    getRiders
}