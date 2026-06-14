const notificationSchema = require("../models/notification");

const createNotification = async (io, data) => {

    const notification = await notificationSchema.create({

        senderId: data.senderId,

        receiverId: data.receiverId,

        type: data.type,

        message: data.message,

        jobId: data.jobId,

        chatUserId: data.chatUserId

    });

    io.to(

        data.receiverId.toString()

    ).emit(

        "new_notification",

        notification

    );

}

module.exports = createNotification;