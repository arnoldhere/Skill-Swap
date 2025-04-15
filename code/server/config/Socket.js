const { Server } = require("socket.io");

let io;
const connectedUsers = new Map(); // userId => socketId

const setupSocket = (server) => {
	io = new Server(server, {
		cors: {
			origin: "http://localhost:4200", // Use frontend URL in production
		},
	});

	io.on("connection", (socket) => {
		console.log("new client connected..> ", socket.id);

		//register client with its socket id
		socket.on("register", (userId) => {
			connectedUsers.set(userId, socket.id);
			console.log(`User ${userId} connected as ${socket.id}`);
		});

		//handle message
		socket.on("private-message", ({ senderId, receiverId, message }) => {
			const receiverSocketId = connectedUsers.get(receiverId);

			if (receiverSocketId) {
				socket.to(receiverSocketId).emit("private-message", {
					senderId,
					message,
					time: new Date(),
				});
			}
		});
		// Emit seen acknowledgment
		socket.on("message-seen", ({ senderId, receiverId }) => {
			const senderSocketId = connectedUsers.get(senderId);
			if (senderSocketId) {
				socket.to(senderSocketId).emit("message-seen", { receiverId });
			}
		});
		socket.on("typing", ({ senderId, receiverId }) => {
			const receiverSocketId = connectedUsers.get(receiverId);
			if (receiverSocketId) {
				socket.to(receiverSocketId).emit("typing", { senderId });
			}
		});

		//close the socket
		socket.on("disconnect", () => {
			for (let [userId, sockId] of connectedUsers.entries()) {
				if (sockId === socket.id) {
					connectedUsers.delete(userId);
					break;
				}
			}
			console.log("Client disconnected", socket.id);
		});
	});
};

module.exports = setupSocket;
