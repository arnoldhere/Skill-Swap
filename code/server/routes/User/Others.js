const express = require("express");
const router = express.Router();
const City = require("../../models/Cities");

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

module.exports = router;
