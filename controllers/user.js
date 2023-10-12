const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');
const { setUser } = require('../service/auth');

const handleUserSignUp = async (req, res) => {
    const { name, email, password } = req.body;
    await User.create({
        name, email, password
    });
    return res.redirect('/');
}

const handleUserLogout = async (req, res) => {
    //res.clearCookie('token');
    res.cookie('token', {expires: Date.now()});
    return res.redirect('/');
};

const handleUserLogin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) {
        console.log('Invalid credentials');
        return res.render("login", {
            error: "Invalid credentials"
        });
    }
    const token = setUser(user);
    res.cookie('token', token);
    return res.redirect('/');
}

module.exports = { handleUserSignUp, handleUserLogin, handleUserLogout };