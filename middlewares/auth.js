const { getUser } = require('../service/auth');

function checkForAuthentication(req, res, next) {
    const tokenCookie = req.cookies?.token;
    req.user = null;
    if (!tokenCookie) {
        return next();
    }
    const token = tokenCookie;
    const user = getUser(token);
    req.user = user;
    return next();
}

//Admin, User, Supervisor roles.
function restrictTo(roles = []) {
    return (req, res, next) => {
        if (!req.user) {
            return res.redirect('/login');
        } else if (!roles.includes(req.user.role)) {
            return res.end("Unauthorised");
        }
        return next();
    }
}

module.exports = { checkForAuthentication, restrictTo };