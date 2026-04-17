const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
    try {
        // We can write anything instead of authorization it is just a name coming from postman
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                message: "Token not found"
            })
        }
        // we are getting value as in key : value form so we just want value that why split
        const token = authHeader.split(" ")[1];
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decode;
        // putting jwt info into user 
        next()
    }
    catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}

module.exports = { authMiddleware };