const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const {
	upload,
	deleteOldProfilePhoto,
} = require("../../middleware/UploadMiddleware");

router.get("/get-current-user/:id", async (req, res) => {
	try {
		const userData = await User.findById(req.params.id);
		// console.log(userData.firstname + " " + userData.lastname);
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

module.exports = router;
