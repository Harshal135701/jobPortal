const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["candidate", "recruiter"],
        default: "candidate"
    },
    occupation: {
        type: String,
        default: ""
    },
    experience: {
        type: Number,
        default: 0
    }

}, { timestamps: true })

module.exports = mongoose.model("user", userSchema)