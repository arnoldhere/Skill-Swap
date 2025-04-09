const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const {
	upload,
	deleteOldProfilePhoto,
} = require("../../middleware/UploadMiddleware");

router.get("/get-current-user/:id", async (req, res) => {
	try {
		const userData = await User.findById(req.params.id).populate(
			"skills.category",
			"name"
		); // populate name of category
		if (!userData) {
			res.status(404).json({ message: "User not found" });
		}

		if (userData.modeoflogin === "manual") {
			// Send full image URL
			const baseUrl = `${req.protocol}://${req.get(
				"host"
			)}/uploads/profilephotos/`;
			userData.profilephoto = userData.profilephoto
				? `${baseUrl}${userData.profilephoto}`
				: null;
		} else if (userData.modeoflogin === "google") {
			// Send full image URL
			const baseUrl = `${req.protocol}://${req.get(
				"host"
			)}/uploads/profilephotos/`;
			userData.profilephoto = userData.profilephoto
				? `${baseUrl}${userData.profilephoto}`
				: null;
		}

		res.status(201).json(userData);
	} catch (error) {
		res.status(500).json({ error: "User not found" });
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

// Upload and save profile image
router.post(
	"/user-profile-image/:id",
	upload.single("profilephoto"),
	async (req, res) => {
		try {
			const userId = req.params.id;
			if (!req.file) {
				return res.status(400).json({ message: "No file uploaded" });
			}

			// Delete the old profile photo
			await deleteOldProfilePhoto(userId);

			// Update user profile with the new file
			const updatedUser = await User.findByIdAndUpdate(
				userId,
				{ profilephoto: req.file.filename },
				{ new: true }
			);

			res.status(200).json({
				message: "Profile image uploaded successfully",
				profilephoto: updatedUser.profilephoto,
			});
		} catch (error) {
			res.status(500).json({ message: "Server error" });
		}
	}
);

router.post("/update-bio/:id", async (req, res) => {
	try {
		const userData = await User.findById(req.params.id);
		if (!userData) {
			res.status(404).json({ message: "User not found" });
		}
		const updatedUser = await User.findByIdAndUpdate(req.params.id, {
			bio: req.body.bio,
		});
		await updatedUser.save();

		res.status(201).json({ message: "Bio updated successfully", updatedUser });
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
});

router.post("/update-current-user/:id", async (req, res) => {
	try {
		const { house, area, state, city, pincode, ...otherFields } = req.body.user;
		// console.log(house);
		// Prepare updated data with nested location object
		const updatedData = {
			...otherFields,
			location: {
				house: house,
				area: area,
				state: state,
				city: city,
				pincode: pincode,
			},
		};

		// Update the user with new data
		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			updatedData,
			{ new: true, runValidators: true }
		);

		if (!updatedUser) {
			return res.status(404).json({ error: "User not found" });
		}

		res.status(200).json({
			success: true,
			message: "User profile updated successfully",
			data: updatedUser,
		});
	} catch (error) {
		console.error("Error updating user:", error);
		res.status(500).json({
			success: false,
			error: "Failed to update user. Please try again later.",
		});
	}
});

router.post("/add-skills/:id", upload.single("document"), async (req, res) => {
	try {
		const userId = req.params.id;
		const { category } = req.body;

		console.log("Received category:", category);
		console.log("Uploaded file:", req.file);

		if (!category || !req.file) {
			return res.status(400).json({ message: "All fields are required" });
		}

		const certificate = `uploads/documents/${req.file.filename}`;
		console.log("Certificate path to be saved:", certificate);

		if (!certificate) {
			return res.status(400).json({ message: "Certificate path is missing" });
		}

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		if (user.skills.length >= 5) {
			return res.status(400).json({ message: "Maximum of 5 skills allowed." });
		}

		// const alreadyExists = user.skills.some(
		// 	(skill) => skill.category.toString() === category
		// );
		// if (alreadyExists) {
		// 	return res.status(409).json({ message: "Skill already added." });
		// }

		// ✅ Push with correct structure
		user.skills.push({
			category,
			certificate,
			createdAt: new Date(),
		});

		await user.save();

		res.status(200).json({
			message: "✅ Skill added successfully",
			skills: user.skills,
		});
	} catch (error) {
		console.error("❌ Error in addSkill:", error);
		res.status(500).json({ message: "Server error", error });
	}
});

module.exports = router;
