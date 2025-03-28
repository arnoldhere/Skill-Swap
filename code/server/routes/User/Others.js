const express = require("express");
const router = express.Router();
const City = require("../../models/Cities");
const Feedback = require("../../models/Feedback");

// Get all unique states from cities collection
router.get("/states", async (req, res) => {
	try {
		const states = await City.distinct("state");
		res.status(200).json({ states: states });
	} catch (error) {
		res.status(500).json({ message: "Failed to load states" });
	}
});

// Get all cities for a given state
router.get("/cities/:stateName", async (req, res) => {
	try {
		const cities = await City.find({ state: req.params.stateName }).select(
			"city"
		);
		res.json({ data: cities });
	} catch (error) {
		res.status(500).json({ message: "Failed to load cities" });
	}
});

router.post("/save-feedback/:id", async (req, res) => {
	try {
		console.log("Received Data:", req.body);
		const { subject, message , rating } = req.body;
		if (!subject || !message) {
			return res
				.status(400)
				.json({ message: "Subject and message are required" });
		}

		const save = new Feedback({
			user: req.params.id,
			subject: subject,
			feedback: message,
			rating: rating,
		});
		const result = await save.save();
		if (result) {
			return res
				.status(200)
				.json({ message: "feedback saved succesfully...Thanks for your time" });
		} else
			return res.status(500).json({ message: "Failed to save feedback..." });
	} catch (error) {
		res.status(500).json({ message: "Internal server error..." });
	}
});

module.exports = router;
