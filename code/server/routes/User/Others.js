const express = require("express");
const router = express.Router();
const City = require("../../models/Cities");
const Feedback = require("../../models/Feedback");
const User = require("../../models/User");
const SkillCategory = require("../../models/SkillCategory");

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
		const { subject, message, rating } = req.body;
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

router.get("/get-feedbacks-rating", async (req, res) => {
	try {
		const goodFeedbacks = await Feedback.find({ rating: { $gt: 0 } })
			.populate("user", "firstname lastname") // Populate user's name
			.sort({ timestamp: -1 }) // Sort by latest
			.limit(8);
		// console.log(goodFeedbacks);
		res.status(200).json(goodFeedbacks);
	} catch (err) {
		res
			.status(500)
			.json({ message: "Error fetching feedbacks", error: err.message });
	}
});

// Get all skill categories
router.get("/get-skills-category", async (req, res) => {
	try {
		const categories = await SkillCategory.find();
		res.status(200).json({categories});
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "Failed to fetch categories" });
	}
});

router.get("/get-all-users", async (req, res) => {
	try {
		const users = await User.find({ role: "user" }).populate(
			"skills.category",
			"name"
		);
		const baseUrl = `${req.protocol}://${req.get(
			"host"
		)}/uploads/profilephotos/`;

		const usersWithFullPhoto = users.map((user) => {
			return {
				...user._doc,
				profilephoto: user.profilephoto
					? `${baseUrl}${user.profilephoto}`
					: null,
			};
		});

		res.status(200).json(usersWithFullPhoto);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "Failed to fetch users" });
	}
});

router.get("/get-user/:id", async (req, res) => {
	try {
		const id = req.params.id;

		const user = await User.findById(id).populate("skills.category"); // <-- Populate category inside skills

		if (!user) {
			return res.status(404).json({ message: "User not found..." });
		}

		const baseUrl = `${req.protocol}://${req.get(
			"host"
		)}/uploads/profilephotos/`;
		const userWithFullPhoto = {
			...user._doc,
			profilephoto: user.profilephoto ? `${baseUrl}${user.profilephoto}` : null,
		};

		return res.status(200).json({ user: userWithFullPhoto });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error..." });
	}
});

module.exports = router;
