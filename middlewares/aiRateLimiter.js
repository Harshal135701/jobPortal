const rateLimit = require("express-rate-limit")

const aiLimiter = rateLimit({
    windowMs: 60 * 1000,
    // This shows the window timing 
    // In js counting works in milliseconds like 1000 -> 1 sec 
    max: 3,
    // Only allowed limit per window 
    message: {
        success: false,
        message: "Too many AI requests. Please try again after 1 minute."
    },
    standardHeaders: true,
    // It sends the header back to server while response
    legacyHeaders: false,
    // This is old version of headers so that make it false
})

module.exports = { aiLimiter };