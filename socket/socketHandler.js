const message = require("../models/messages")
const notificationService = require("../services/notificationService")

module.exports = (io) => {
    io.on("connection", (socket) => {
        socket.on("join_room", (roomId) => {
            socket.join(roomId);
        })

        socket.on("join_notification_room", (userId) => {
            socket.join(userId.toString())
        })

        socket.on("send_message", async (data) => {
            let newMessage = await message.create({
                senderId: data.senderId,
                receiverId: data.receiverId,
                message: data.message,
                roomId: data.roomId,
                jobId: data.jobId
            })
            newMessage = await newMessage.populate("senderId");

            await notificationService(io, {
                senderId: data.senderId,

                receiverId: data.receiverId,

                type: "MESSAGE",

                message: "You received a new message",

                jobId: data.jobId,

                chatUserId: data.senderId
            });

            io.to(data.roomId).emit("received_message", newMessage);
        })
    })
}

