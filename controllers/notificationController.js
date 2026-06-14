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

async function markNotificationAsRead(req, res) {

    try {

        const notification =
            await Notification.findByIdAndUpdate(

                req.params.notificationId,

                {
                    isRead: true
                },

                {
                    new: true
                }

            );

        if (!notification) {

            return res.status(404).json({

                message: "Notification not found"

            });

        }

        return res.status(200).json({

            success: true,

            message: "Notification marked as read",

            notification

        });

    }

    catch (err) {

        console.log(err);

        return res.status(500).json({

            message: "Server Error"

        });

    }

}

// Marks every unread MESSAGE notification that belongs to a particular
// chat (same job + same chat partner) as read in one go.
// Used when the user opens that chat, so the whole conversation's
// unread count clears instead of just the single clicked notification.
async function markChatNotificationsAsRead(receiverId, jobId, chatUserId) {

    try {

        await Notification.updateMany(
            {
                receiverId,
                jobId,
                chatUserId,
                type: "MESSAGE",
                isRead: false
            },
            {
                $set: { isRead: true }
            }
        );

    }

    catch (err) {

        console.log(err);

    }

}

module.exports={
    notificationForUser,
    markNotificationAsRead,
    markChatNotificationsAsRead
}