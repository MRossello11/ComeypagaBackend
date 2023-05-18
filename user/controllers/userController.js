const User = require('../model/User');
const roles = require('../../config/roles');

// get all rider users
const getRiders = async(req, res) => {
    const riders = await User.find({ role: roles.RIDER, isDeleted: false }).exec();

    res.status(200).json({ 'riders':riders });
};

// modify a rider user
const postRider = async(req, res) =>{
    const { 
        _id,
        username,
        firstname,
        lastname,
        birthDate,
        phone,
        email,
        address,
        password
    } = req.body;

    if(
        !_id ||
        !username ||
        !firstname ||
        !lastname ||
        !birthDate ||
        !phone ||
        !email ||
        !address ||
        !password
    ) {
        return res.sendStatus(400);
    }

    const foundRider = await User.findOne({ _id }).exec();

    if(!foundRider){
        return res.status(500).json({ 'message':'Rider not found' });
    }

    try {
        await User.updateOne(
            { _id: foundRider._id },
            {
                $set: {
                    username: username,
                    firstname: firstname,
                    lastname: lastname,
                    birthDate: birthDate,
                    phone: phone,
                    email: email,
                    address: address,
                    password: password
                }
            }
        )
        
        res.status(200).json({ 'message':'Rider modified'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ 'message': err.message });
    }
};

const deleteRider = async(req, res) => {
    const _id = req.params.id;

    if(!_id){
        return res.status(400).json({'message':'riderId required'});
    }

    const foundRider = await User.findOne({ _id: _id, role: roles.RIDER}).exec();

    console.log(foundRider);
    if(!foundRider){
        return res.status(500).json({'message':'Rider not found'});
    }

    try {
        await User.updateOne(
            { _id: foundRider._id },
            {
                $set: { isDeleted: true }
            }
        );
        res.status(200).json({ 'message':'Rider deleted'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ 'message': err.message });
    }

};

module.exports = {
    getRiders,
    postRider,
    deleteRider
}