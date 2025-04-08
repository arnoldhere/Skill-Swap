const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
	senderId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
	receiverId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
	message: { type: String, required: true },
	timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
