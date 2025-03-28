const mongoose = require("mongoose");
const { Schema } = mongoose;

const feedbackSchema = new mongoose.Schema({
	subject: String,
	feedback: String,
	rating: String,
	type: { type: String, enum: ["Feedback", "Rating"], default: "Feedback" },
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	timestamp: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Feedback", feedbackSchema);
