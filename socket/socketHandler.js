const message = require("../models/messages")

module.exports = (io) => {
    io.on("connection", (socket) => {
        socket.on("join_room", (roomId) => {
            socket.join(roomId);
        })

        socket.on("send_message", async(data) => {
            let newMessage = await message.create({
                senderId: data.senderId,
                receiverId: data.receiverId,
                message: data.message,
                roomId: data.roomId,
                jobId: data.jobId
            })
            newMessage=await newMessage.populate("senderId");
            io.to(data.roomId).emit("received_message", newMessage);
        })
    })
}

