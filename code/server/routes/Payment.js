const express = require("express");
const router = express.Router();

router.post("/create-order", async (req, res) => {
	const { amount, currency } = req.body;
	try {
		const options = {
			amount: amount * 100, // in paisa
			currency,
			receipt: `receipt_${Date.now()}`,
		};

		const order = await razorpay.orders.create(options);
		res.status(200).json({ success: true, order });
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
});

module.exports = router;
