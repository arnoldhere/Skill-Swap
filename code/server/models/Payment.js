const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
	requestId: { type: mongoose.Schema.Types.ObjectId, ref: "Request" },
	amount: Number,
	commission: Number,
	userProfit: Number,
	paidTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	paymentId: String,
	orderId: String,
	method: String,
	status: String,
	timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);
