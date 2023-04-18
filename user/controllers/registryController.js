const User = require('../model/User');

const createNewUser = async(req, res) => {
    const { 
        username,
        firstname,
        lastname,
        birthDate,
        phone,
        street,
        town,
        password,
        passwordConfirmation
    } = req.body;

    if(
        !username ||
        !firstname ||
        !lastname ||
        !birthDate ||
        !phone ||
        !street ||
        !town ||
        !password ||
        !passwordConfirmation  
    ) {
        return res.sendStatus(400);
    }

    const duplicate = await User.findOne({ username: username }).exec();

    if(duplicate) return res.sendStatus(409);

}