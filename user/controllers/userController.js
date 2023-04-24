const User = require('../model/User');

// get all rider users
const getRiders = async(req, res) => {
    const riders = await User.find({ 'role.rider': 20 }).exec();

    res.status(200).json(riders);
};

// modify a rider user
const postRider = async(req, res) =>{
    const { 
        riderId,
        username,
        firstname,
        lastname,
        birthDate,
        phone,
        email,
        street,
        town,
        password
    } = req.body;

    if(
        !riderId ||
        !username ||
        !firstname ||
        !lastname ||
        !birthDate ||
        !phone ||
        !street ||
        !email ||
        !town ||
        !password
    ) {
        return res.sendStatus(400);
    }

    const foundRider = await User.findOne({ _id: riderId }).exec();

    if(!foundRider){
        return res.status(500).json({ 'message':'Rider not found' });
    }

    try {
        await User.updateOne(
            { _id: foundRider.id },
            {
                $set: {
                    username: username,
                    firstname: firstname,
                    lastname: lastname,
                    birthDate: birthDate,
                    phone: phone,
                    email: email,
                    address: {
                        street: street,
                        town: town
                    },
                    password: password
                }
            }
        )
        
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 'message': err.message });
    }
};


module.exports = {
    getRiders,
    postRider
}