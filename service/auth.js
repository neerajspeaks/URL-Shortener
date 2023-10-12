const jwt = require('jsonwebtoken');
const SECRET_KEY = 'vnhidhf9837442394@nvlsd#';

const setUser = ( user) => {
    const payload = {
        _id: user._id,
        email: user.email,
        role: user.role
    };
    return jwt.sign(payload, SECRET_KEY);
};

const getUser = (token) => {
    try {
        if(!token) return null;
    return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        console.log('Invalid token');
        return null;
    }
    
};

module.exports = {setUser, getUser};