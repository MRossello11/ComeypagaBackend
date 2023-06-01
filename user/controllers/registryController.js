const User = require('../model/User');
const { verifyAddress } = require('../../config/verifyAddress');
const roles = require('../../config/roles');
const crypto = require('crypto');

const handleRegistry = async(req, res) => {
    const { 
        username,
        firstname,
        lastname,
        birthDate,
        phone,
        email,
        address,
        password,
        role
    } = req.body;

    // verify fields
    if(
        !username ||
        !firstname ||
        !lastname ||
        !birthDate ||
        !phone ||
        !verifyAddress(address) || 
        !password
    ) {
        return res.sendStatus(400);
    }

    const duplicate = await User.findOne({ username: username, isDeleted: false }).exec();
    if(duplicate) return res.status(409).json({"message":"Username taken"});

    // if no duplicate found, create user
    const street = address.street;
    const town = address.town;

    // set role
    let userRole;
    if(role){
        userRole = role;
    } else {
        userRole = roles.USER;
    }

    try {
        // hash password using sha256
        const hash = crypto.createHash('sha256');
        hash.update(password);
        const hashedPassword = hash.digest('hex');

        // create and store the new user
        const result = await User.create({
            username,
            firstname,
            lastname,
            birthDate,
            phone,
            email,
            address: {
                street,
                town
            },
            role: userRole,
            password: hashedPassword
        });
        console.log(result);

        res.status(201).json({ 'message': `New user ${username} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}
module.exports = { handleRegistry }