const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/Sendemail");
const Fees = require("../models/Fees");
const User = require("../models/User");
const Request = require("../models/Request");
const razorpay = require("../utils/RazorPay");
const crypto = require("crypto")
router.post("/create-order", async (req, res) => {
	const { requestId } = req.body;

	// 1. Fetch request with populated skillId and swapperId (user)
	const request = await Request.findById(requestId).populate(
		"skillId swapperId"
	);
	if (!request) {
		return res
			.status(404)
			.json({ success: false, message: "Request not found" });
	}

	// 2. Get the swapper user
	const user = await User.findById(request.swapperId);

	if (!user || !user.skills || user.skills.length === 0) {
		return res
			.status(404)
			.json({ success: false, message: "Swapper's skills not found" });
	}
	// 3. Find the skill that matches request.skillId in user's skills
	const userSkill = user.skills.find(
		(skill) => skill.category.toString() === request.skillId._id.toString()
	);

	if (!userSkill) {
		return res
			.status(404)
			.json({ success: false, message: "Skill not found in user's skills" });
	}

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
		const request = await Request.findById(requestId).populate("skillId");
		request.payment = "Accepted";
		await request.save();

		// Calculate commission
		const commission =
			(request.skillId.fees * request.skillId.commission) / 100;
		const saved = await new Fees({
			requestId: requestId,
			commission: commission,
		});

		const toemail = request.swapperId.email;
		const subject = "Payment Successful";
		const text = `Your payment for ${request.skillId.name} has been received.`;

		await sendEmail(toemail, subject, text);

		res.status(200).json({ message: "Payment verified and recorded." });
	} else {
		res.status(400).send("Invalid signature");
	}
});

module.exports = router;
