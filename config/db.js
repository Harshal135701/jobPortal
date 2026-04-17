const mongoose = require('mongoose')

async function connectDb(req, res) {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("The database is connected")
    }
    catch (err) {
        console.log("The error comes", err.message)
        process.exit(1)
        // Stops the server 
    }
}
module.exports=connectDb