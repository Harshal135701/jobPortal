const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        enum: ["MESSAGE", "APPLICATION_UPDATE"],
        default: "MESSAGE"
    },
    message: {
        type: String,
        required: true
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "job"
    }
}, { timestamps: true })

module.exports = mongoose.model("notification", notificationSchema)