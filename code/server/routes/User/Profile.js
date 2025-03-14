const express = require("express");
const router = express.Router();
const User = require("../../models/User");

router.get("/get-current-user/:id", async (req, res) => {
	try {
		const userData = await User.findById(req.params.id);
		console.log(userData.firstname + " " + userData.lastname);
		if (!userData) {
			res.status(404).json({ message: "User not found" });
		}
		res.status(201).json(userData);
	} catch (error) {
		res.status(500).json({ error: "User not found" });
	}
});

// Update user
router.put("/update-current-user/:id", async (req, res) => {
	try {
		const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		res.json(updatedUser);
	} catch (error) {
		res.status(500).json({ error: "Error updating user" });
	}
});

// Update availability
router.post("/update-user-avail-status/:id", async (req, res) => {
	try {
		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{ availabilityStatus: req.body.status },
			{ new: true }
		);
		res.json(updatedUser);
	} catch (error) {
		res.status(500).json({ error: "Error updating availability" });
	}
});

module.exports = router;
