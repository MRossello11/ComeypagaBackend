const User = require('../model/User');
const crypto = require('crypto');

const handleResetPassword = async(req, res) => {
    const { username, newPassword } = req.body;

    if(!username || !newPassword){
        return res.sendStatus(400);
    }

    const foundUser = await User.findOne({ username: username }).exec();

    if(!foundUser){
        return res.status(500).json({
            'message':'User not found'
        });
    }

    // hash password
    const hash = crypto.createHash('sha256');
    hash.update(newPassword);
    const hashedNewPassword = hash.digest('hex');

    try{
        await User.updateOne(
            { _id: foundUser._id },
            { $set: { "password": hashedNewPassword } }
        );

        res.status(200).json({
            'message':'Password changed'
        });
    } catch(err){
        res.status(500).json({
            'message':'An error occurred changing the password'
        });
    }
}

module.exports = { handleResetPassword }