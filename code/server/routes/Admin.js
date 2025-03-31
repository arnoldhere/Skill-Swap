const express = require("express");
const router = express.Router();
const User = require("../models/User");

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

// 🎯 Get Admin Profile
router.get("/get-profile/:id", async (req, res) => {
	try {
		const admin = await User.findById(req.params.id);
		if (!admin) {
			return res.status(404).json({ message: "Admin not found" });
		}
		res.status(200).json(admin);
	} catch (err) {
		res
			.status(500)
			.json({ message: "Error fetching admin profile", error: err.message });
	}
});

router.get("/get-admins/:id", async (req, res) => {
	try {
		// Exclude the logged-in admin using req.user.id (Assuming JWT is used)
		const admins = await User.find({
			role: "admin",
			_id: { $ne: req.user.id }, // 🔥 Exclude logged-in admin
		}).sort({ createdAt: -1 });
		res.status(200).json(admins);
	} catch (err) {
		res
			.status(500)
			.json({ message: "Error fetching admin users", error: err.message });
	}
});

// ✏️ Update Admin Profile
router.put("/update-profile/:id", async (req, res) => {
	try {
		const updatedAdmin = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		res.status(200).json({ updatedAdmin, message: "Updated Admin Profile" });
	} catch (err) {
		res
			.status(500)
			.json({ message: "Error updating profile", error: err.message });
	}
});

module.exports = router;
