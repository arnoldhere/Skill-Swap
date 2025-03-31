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

// Update Admin Profile Route
router.put("/api/admins/:id", async (req, res) => {
	const adminId = req.params.id;
	const updateData = req.body;

	try {
		const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updateData, {
			new: true,
			runValidators: true,
		});

		if (!updatedAdmin) {
			return res.status(404).json({ message: "Admin not found!" });
		}

		res.json(updatedAdmin);
	} catch (error) {
		console.error("Error updating admin:", error);
		res.status(500).json({ message: "Error updating admin profile." });
	}
});

router.get("/get-admins/:id", async (req, res) => {
	try {
		const admins = await User.find({
			role: "admin",
			_id: { $ne: req.params.id },
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
