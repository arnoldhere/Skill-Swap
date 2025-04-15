const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
	skillId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "SkillCategory",
		required: true,
	},
	swapperId: { // user who got the request
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	requesterId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	message: { type: String },
	date: { type: Date },
	time: String,
	status: {
		type: String,
		enum: ["Pending", "Accepted", "Rejected"],
		default: "Pending",
	},
	payment:{
		type: String,
		enum: ["Pending", "Accepted", "Rejected"],
		default: "Pending",
	},
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Request", requestSchema);