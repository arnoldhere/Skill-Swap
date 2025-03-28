const express = require("express");
const router = express.Router();
const User = require("../models/User")

// 🧑‍💼 Get All Users
router.get("/get-users", async (req, res) => {
	try {
		const users = await User.find().sort({ createdAt: -1 });
		res.status(200).json(users);
	} catch (err) {
		res
			.status(500)
			.json({ message: "Error fetching users", error: err.message });
	}
});

module.exports = router;
