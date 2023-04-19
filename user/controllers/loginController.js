const User = require('../model/User');

const handleLogin = async(req, res) => {
    // if(req.session.hasOwnProperty("userLogged")){
    //     return res.sendStatus(418);
    // }
    const { username, password } = req.body;

    // username and password are requiered
    if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    // search user
    const foundUser = await User.findOne({ username: username }).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorized 

    // check password
    const matchingPassword = password == foundUser.password;
    if(matchingPassword){
        // set 'user logged' session cookie value
        req.session.userLogged = { username };
        res.status(200).json({ foundUser });
    } else {
        res.status(401).json({ 'message':'Username or password incorrect'});
    }
}

module.exports = { handleLogin };