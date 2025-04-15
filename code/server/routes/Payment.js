const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/Sendemail");
const Fees = require("../models/Fees");
const User = require("../models/User");
const Request = require("../models/Request");
const razorpay = require("../utils/RazorPay");
const crypto = require("crypto");
const Payment = require("../models/Payment");

router.post("/create-order", async (req, res) => {
	const { requestId } = req.body;

	// 1. Fetch request with populated skillId and swapperId (user)
	const request = await Request.findById(requestId).populate(
		"skillId swapperId"
	);
	if (!request)
		return res
			.status(404)
			.json({ success: false, message: "Request not found" });

	// 2. Get the swapper user
	const user = await User.findById(request.swapperId);
	const userSkill = user?.skills?.find(
		(skill) => skill.category.toString() === request.skillId._id.toString()
	);
	if (!userSkill)
		return res.status(404).json({ success: false, message: "Skill not found" });

	// 4. Calculate amount
	const amount = userSkill.fees * 100; // Razorpay needs amount in paise

	try {
		// 5. Create Razorpay order
		const options = {
			amount,
			currency: "INR",
			receipt: `receipt_order_${requestId}`,
		};
		const order = await razorpay.orders.create(options);
		// 6. Send response
		res.status(200).json({
			success: true,
			orderId: order.id,
			amount: order.amount,
			currency: order.currency,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ success: false, error: err.message });
	}
});

router.post("/verify-payment", async (req, res) => {
	const {
		razorpay_order_id,
		razorpay_payment_id,
		razorpay_signature,
		requestId,
	} = req.body;
	const generated_signature = crypto
		.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
		.update(`${razorpay_order_id}|${razorpay_payment_id}`)
		.digest("hex");

	if (generated_signature === razorpay_signature) {
		const request = await Request.findById(requestId).populate(
			"skillId swapperId"
		);
		if (!request) return res.status(404).json({ message: "Request not found" });

		const user = await User.findById(request.swapperId);
		const userSkill = user?.skills?.find(
			(skill) => skill.category.toString() === request.skillId._id.toString()
		);
		if (!userSkill) return res.status(400).json({ message: "Skill not found" });
		const actualFee = userSkill.fees;

		// Commission and profit calculations
		const commission = (actualFee * request.skillId.commission) / 100;
		const userProfit = actualFee - commission;

		// Update request status
		request.payment = "Accepted";
		await request.save();

		// Store commission in Fees table
		await Fees.create({
			requestId: requestId,
			commission: commission,
		});

		// Update swapper's profit
		user.profit = (user.profit || 0) + userProfit;
		await user.save();

		// Store payment record
		await Payment.create({
			requestId: request._id,
			amount: actualFee,
			commission,
			userProfit,
			paidTo: user._id,
			paymentId: razorpay_payment_id,
			orderId: razorpay_order_id,
			method: "Razorpay",
			status: "Success",
		});

		const toemail = request.swapperId.email;
		const subject = "Payment Successful";
		const text = ` Dear ${request.swapperId.firstname},\n Your payment for ${request.skillId.name} has been received.\n\n 
		Kindly complete your fixed schedule and update your requests in your profile to avoid profit deduction\n
		`;

		await sendEmail(toemail, subject, text);

		res.status(200).json({ message: "Payment verified and recorded." });
	} else {
		res.status(400).send("Invalid signature");
	}
});

module.exports = router;
