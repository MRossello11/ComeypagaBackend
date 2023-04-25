const User = require('../model/User');

const handleRegistry = async(req, res) => {
    const { 
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

    const duplicate = await User.findOne({ username: username }).exec();
    if(duplicate) return res.sendStatus(409);

    // if no duplicate found, create user
    try {
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
            role: {
                user: 10
            },
            password
        });

        console.log(result);

        res.status(201).json({ 'success': `New user ${username} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}
module.exports = { handleRegistry }