const { Server } = require("socket.io");

let io;
const connectedUsers = new Map(); // userId => socketId

const setupSocket = (server) => {
	io = new Server(server, {
		cors: {
			origin: "*", // Use frontend URL in production
			methods: ["GET", "POST"],
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
		socket.on("private-message", (senderId, recieverId, message) => {
			const recieverSocketId = connectedUsers.get(recieverId);

			if (recieverSocketId) {
				socket.to(recieverSocketId).emit("private-message", {
					senderId,
					message,
					time: new Date(),
				});
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