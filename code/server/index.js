require("dotenv").config(); // Load environment variables
const app = require("./app");
const connectDB = require("./config/db");
const port = process.env.PORT || 3000; // Get PORT from .env
const Message = require("./models/Message");
const socketIo = require("socket.io");
const http = require("http");


const users = {}; // Store socket.id by userId
const server = http.createServer(app);
const io = socketIo(server, {
	cors: {
		origin: "*",
	},
});
// Socket.io configuration
io.on("connection", (socket) => {
	console.log("Socket connected:", socket.id);
	socket.on("register", (userId) => {
		users[userId] = socket.id;
		console.log(`User ${userId} registered with socket ID ${socket.id}`);
	});

	socket.on("private message", async ({ senderId, receiverId, message }) => {
		const newMessage = new Message({ senderId, receiverId, message });
		await newMessage.save();

		const receiverSocket = users[receiverId];
		if (receiverSocket) {
			io.to(receiverSocket).emit("private message", newMessage);
		}
	});

	socket.on("disconnect", () => {
		for (const userId in users) {
			if (users[userId] === socket.id) {
				delete users[userId];
				break;
			}
		}
		console.log("Socket disconnected:", socket.id);
	});
});

app.listen(port, connectDB(), () => {
	console.log(`Server is running on port ${port}`);
});
