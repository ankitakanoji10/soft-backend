const JWT  = require('jsonwebtoken');
const User = require('../models/User');

const requireSignIn = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.user = decode;
        next();
        
    } catch (error) {
        console.log(error);
        
    }

    
}
module.exports = { requireSignIn };