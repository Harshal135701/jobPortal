const jwt = require("jsonwebtoken");
const userDb=require('../models/user')

async function authMiddleware(req, res, next) {
    try {
        // We can write anything instead of authorization it is just a name coming from postman
        // const authHeader = req.headers.authorization;
        const token = req.cookies.token;
        if (!token) {
            return res.redirect('/login');
        }
        // we are getting value as in key : value form so we just want value that why split
        // const token = authHeader.split(" ")[1];
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        const user=await userDb.findById(decode.userId);
        req.user = user;
        res.locals.user = user;   // IMPORTANT
        // putting jwt info into user 
        next()
    }
    catch (err) {
        return res.redirect('/login');
    }
}

module.exports = { authMiddleware };






