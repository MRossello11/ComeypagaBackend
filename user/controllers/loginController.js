const User = require('../model/User');
const crypto = require('crypto');

const handleLogin = async(req, res) => {
    const { username, password } = req.body;

    // username and password are requiered
    if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    // search user
    const foundUser = await User.findOne({ username: username }).exec();
    if (!foundUser) return res.status(401).json({'message':'User or password incorrect'}); // Unauthenticated

    // check password
    const hash = crypto.createHash('sha256');
    hash.update(password);
    const hashedPassword = hash.digest('hex');
    const matchingPassword = hashedPassword == foundUser.password;
    if(matchingPassword){
        // set 'user logged' session cookie value
        req.session.userLogged = username;
        req.session.userRole = foundUser.role;
        res.status(200).json(foundUser);
    } else {
        res.status(401).json({ 'message':'Username or password incorrect'}); // Unauthenticated
    }
}

module.exports = { handleLogin };