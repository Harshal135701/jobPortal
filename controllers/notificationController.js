const messages = require("../models/messages");
const Notification = require("../models/notification")

async function notificationForUser(req, res) {
    try {
        const Isnotifications = await Notification.find({ receiverId: req.params.userId }).sort({ createdAt: -1 });
        return res.json(Isnotifications);
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Server error"
        })
    }
}

module.exports={
    notificationForUser
}