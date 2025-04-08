const express = require("express");
const router = express.Router();
const Message = require("./../models/Message");

// Send a message
router.post("/send", async (req, res) => {
	const { senderId, receiverId, message } = req.body;
	if (!senderId || !receiverId || !message) {
		return res.status(400).json({ error: "All fields are required" });
	}

	try {
		const newMessage = new Message({ senderId, receiverId, message });
		await newMessage.save();
		res.status(201).json(newMessage);
	} catch (error) {
		res.status(500).json({ error: "Failed to send message" });
	}
});

// Get chat between 2 users
router.get("/chat/:user1/:user2", async (req, res) => {
	const { user1, user2 } = req.params;

	try {
		const messages = await Message.find({
			$or: [
				{ senderId: user1, receiverId: user2 },
				{ senderId: user2, receiverId: user1 },
			],
		}).sort({ timestamp: 1 });

		res.status(200).json(messages);
	} catch (error) {
		res.status(500).json({ error: "Error fetching messages" });
	}
});

module.exports = router;
