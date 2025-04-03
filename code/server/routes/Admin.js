const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/Sendemail");
const Category = require("../models/SkillCategory");

// 🧑‍💼 Get All Users
router.get("/get-users", async (req, res) => {
	try {
		const users = await User.find({ role: "user" }).sort({ createdAt: -1 });
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

router.post("/add-admin", async (req, res) => {
	const { firstname, lastname, email, phone } = req.body;

	try {
		// Check if admin already exists
		const existingAdmin = await User.findOne({ email });
		if (existingAdmin) {
			return res.status(409).json({ message: "Admin already exists!" });
		}

		const password = await bcrypt.hash("123456", 8);
		const admin = new User({
			firstname: firstname,
			lastname: lastname,
			email: email,
			phone: phone,
			role: "admin",
			password: password,
			modeoflogin: "manual",
		});
		const saved = await admin.save();

		if (saved) {
			// Email details
			const toEmail = email;
			const subject = "Welcome || SkillSwap";
			const message = `Dear User,You are successfully promoted to admin of the SkillSwap system.\n Please be careful about your credentials.\n\n Your default password is : ${password} \n kindly change your password...`;
			// Send OTP via email
			await sendEmail(toEmail, subject, message);

			res.status(201).json({
				message: "Admin added successfully!",
			});
		} else {
			res.status(400).json({ message: "Invalid admin data!" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server Error", error });
	}
});

router.get("/get-skills-category", async (req, res) => {
	try {
		const categories = await Category.find({});
		res.status(200).json(categories);
	} catch (err) {
		res
			.status(500)
			.json({ message: "Error fetching admin users", error: err.message });
	}
});

router.delete("/delete-skills-category/:id", async (req, res) => {
	try {
		const result = await Category.findByIdAndDelete(req.params.id);
		if (result) {
			return res
				.status(200)
				.json({ message: "Category deleted successfully!" });
		} else {
			return res.status(404).json({ message: "Category not found!" });
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Error to delete category...." });
	}
});

router.get("/get-skill-category/:id", async (req, res) => {
	try {
		const category = await Category.findById(req.params.id);
		if (!category) return res.status(404).json({ error: "Category not found" });
		res.json(category);
	} catch (error) {
		res.status(500).json({ error: "Server error" });
	}
});

router.put("/update-skills-category/:id", async (req, res) => {
	try {
		const { name, description } = req.body;

		if (!name || !description) {
			return res
				.status(400)
				.json({ error: "Name and description are required" });
		}

		const updatedCategory = await Category.findByIdAndUpdate(req.params.id, {
			name,
			description,
		});

		if (!updatedCategory)
			return res.status(404).json({ error: "Category not found" });

		res.status(200).json({
			message: "Category updated successfully",
			category: updatedCategory,
		});
	} catch (error) {
		res.status(500).json({ error: "Server error" });
	}
});

router.post("/add-skills-category", async (req, res) => {
	try {
		const data = req.body;
		// console.log(data);

		// 🔎 Check if category already exists
		const exists = await Category.find({ name: data.name });
		if (exists.length > 0) {
			return res.status(409).json({ message: "Category already exists!" });
		}

		// ➕ Create and Save New Category
		const newCategory = await Category.create({
			name: data.name,
			description: data.description,
		});

		if (newCategory) {
			res.status(201).json({
				message: "Category added successfully! 🎉",
				category: newCategory,
			});
		} else {
			res.status(400).json({ message: "Invalid category data! ❗" });
		}
	} catch (err) {
		console.error("Error adding category:", err);
		res.status(500).json({
			message: "Error adding skill category! 🚨",
			error: err.message,
		});
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
