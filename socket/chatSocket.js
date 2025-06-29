const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("💬 Chat user connected:", socket.id);

    socket.on("joinChat", ({ orderId }) => {
      socket.join(orderId);
      console.log(`Joined chat room: ${orderId}`);
    });

    socket.on("sendMessage", ({ orderId, sender, message }) => {
      io.to(orderId).emit("receiveMessage", {
        sender,
        message,
        time: new Date()
      });
    });

    socket.on("disconnect", () => {
      console.log("💬 Chat user disconnected:", socket.id);
    });
  });
};

module.exports = chatSocket;
