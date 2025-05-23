const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const sendEmail = require("../../utils/Sendemail");
const Request = require("../../models/Request");
const {
	upload,
	deleteOldProfilePhoto,
} = require("../../middleware/UploadMiddleware");
const SkillCategory = require("../../models/SkillCategory");

router.get("/get-current-user/:id", async (req, res) => {
	try {
		const userData = await User.findById(req.params.id).populate(
			"skills.category",
			"name certificate"
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

router.put(
	"/update-skill/:sid/:uid",
	upload.single("document"),
	async (req, res) => {
		try {
			const { sid, uid } = req.params;
			const { category, fees } = req.body;
			const user = await User.findById(uid);
			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			// Find the skill by sid
			const skillIndex = user.skills.findIndex(
				(skill) => skill._id.toString() === sid
			);
			if (skillIndex === -1) {
				return res.status(404).json({ message: "Skill not found" });
			}

			// Update skill fields
			if (category) user.skills[skillIndex].category = category;
			if (fees) user.skills[skillIndex].fees = fees;
			if (req.file) {
				// Optionally delete old certificate file here if needed
				user.skills[skillIndex].certificate = null;
				user.skills[
					skillIndex
				].certificate = `uploads/documents/${req.file.filename}`;
			}

			// Save changes
			await user.save();

			return res.status(200).json({
				message: "Skill updated successfully",
				skill: user.skills[skillIndex],
			});
		} catch (error) {
			console.log(error);
			return res.status(500).json({ message: "Internal server error" });
		}
	}
);

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

		const skillc = await SkillCategory.findById(category);

		// ✅ Push with correct structure
		user.skills.push({
			category,
			certificate,
			fees: skillc.price,
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

router.get("/delete-skill/:skillId/:userId", async (req, res) => {
	try {
		const skillId = req.params.skillId;

		if (!skillId) {
			return res.status(400).json({ message: "Skill ID not provided" });
		}

		// Assuming you're getting the user ID from token or somewhere else (e.g., req.user.id)
		const userId = req.params.userId; // or pass it via query/body if needed

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		// Filter out the skill
		const originalSkillCount = user.skills.length;
		user.skills = user.skills.filter(
			(skill) => skill._id.toString() !== skillId
		);

		if (user.skills.length === originalSkillCount) {
			return res
				.status(404)
				.json({ message: "Skill not found in user's profile" });
		}

		await user.save();
		return res.status(200).json({ message: "Skill deleted successfully" });
	} catch (error) {
		console.log("Delete Skill Error:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
});

router.get("/fetch-skill/:sid/:uid", async (req, res) => {
	try {
		const userId = req.params.uid;
		const skillId = req.params.sid;

		const user = await User.findById(userId).populate("skills.category");

		if (!user) return res.status(404).json({ message: "User not found" });

		const skill = user.skills.find((skill) => skill._id.toString() === skillId);

		if (!skill) return res.status(404).json({ message: "Skill not found" });

		res.status(200).json({ skill });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal server error" });
	}
});

router.get("/get-all-exchange-req/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const results = await Request.find({ requesterId: id })
			.populate("skillId", "name description") // populate skill category
			.populate("swapperId", "firstname lastname email profilephoto"); // populate swapper info

		return res.status(200).json(results);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal server error.." });
	}
});

router.get("/get-booking-exchange-req/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const results = await Request.find({ swapperId: id })
			.populate("skillId", "name description") // populate skill category
			.populate("requesterId", "firstname lastname email profilephoto");

		console.log(results);
		return res.status(200).json(results);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal server error.." });
	}
});

router.delete("/del-exchange-req/:id", async (req, res) => {
	try {
		const rid = req.params.id;

		// Find the request by ID
		const request = await Request.findById(rid);
		if (!request) {
			return res.status(404).json({ message: "Request not found" });
		}

		// Get the swapperId (the user to be notified)
		const swapper = await User.findById(request.swapperId);
		if (!swapper) {
			return res.status(404).json({ message: "Swapper not found" });
		}
		// Delete the request
		await Request.findByIdAndDelete(rid);
		const requester = await User.findById(rid);
		const toemail = swapper.email;
		const subject = "Skill Exchange Request Canceled";
		const text = `Dear ${swapper.firstname},\n\nWe regret to inform you that the skill exchange request has been canceled.\n\n Skill Request Id: ${rid}\t \n Best regards,\nSkillSwap Team`;

		await sendEmail(toemail, subject, text);
		return res.status(200).json({ message: "Request canceled successfully.." });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "internal server error" });
	}
});

router.delete("/del-booking-exchange-req/:id", async (req, res) => {
	try {
		const rid = req.params.id;

		// Find the request by ID
		const request = await Request.findById(rid);
		if (!request) {
			return res.status(404).json({ message: "Request not found" });
		}

		// Get the swapperId (the user to be notified)
		const requester = await User.findById(request.requesterId);
		if (!requester) {
			return res.status(404).json({ message: "Swapper not found" });
		}
		// Delete the request
		await Request.findByIdAndDelete(rid);
		const swapper = await User.findById(rid);
		const toemail = requester.email;
		const subject = "Skill Exchange Request Canceled";
		const text = `Dear ${requester.firstname},\n\nWe regret to inform you that the skill exchange request has been canceled.\n\n Skill Request Id: ${rid}\t skill swapper name: ${swapper.firstname}\n Best regards,\nSkillSwap Team`;

		await sendEmail(toemail, subject, text);
		return res.status(200).json({ message: "Request canceled successfully.." });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "internal server error" });
	}
});

router.delete("/accept-booking-req/:id", async (req, res) => {
	try {
		const rid = req.params.id;

		// Find the request by ID
		const request = await Request.findByIdAndUpdate(rid, {
			status: "Accepted",
		});
		if (!request) {
			return res.status(404).json({ message: "Request not found" });
		}

		// Get the swapperId (the user to be notified)
		const requester = await User.findById(request.requesterId);
		console.log(requester);
		if (!requester) {
			return res.status(404).json({ message: "Swapper not found" });
		}
		const swapper = await User.findById(rid);
		const toemail = requester.email;
		const subject = "Skill Exchange Request Canceled";
		const text = `Dear ${requester.firstname},\n\nWe glad to inform you that your booking request has been approved. kindly complete the payment by using our system for further proccess.\n Best regards,\nSkillSwap Team`;

		await sendEmail(toemail, subject, text);
		return res.status(200).json({ message: "Request accepted successfully.." });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "internal server error" });
	}
});

router.post("/confirm-otp", async (req, res) => {
	const { id } = req.body;
	const otp= req.body.data;
	console.log(`${otp} \t ${id}`);

	if (!otp || !id) {
		return res.status(400).json({ message: "OTP and ID are required" });
	}
	const request = await Request.findById(id).populate("requesterId");
	if (!request) return res.status(404).json({ message: "Request not found" });
	const user = await User.findById(request.requesterId);
	if (!user) return res.status(404).json({ message: "User not found" });

	try {
		if (
			user.otp !== otp ||
			!user.otpExpiresAt ||
			user.otpExpiresAt < new Date()
		) {
			return res.status(400).json({ message: "Invalid or expired OTP" });
		}

		// Update request stage
		request.stage = "Completed";
		await request.save();

		// Clear OTP
		user.otp = null;
		user.otpExpiresAt = null;
		await user.save();

		res.status(200).json({ message: "Stage updated successfully!" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
});

router.get("/modify-stage/:id", async (req, res) => {
	try {
		const rid = req.params.id;
		// const request = await Request.findByIdAndUpdate(rid, {
		// 	stage: "Completed",
		// });
		const requester = await Request.findById(rid).populate(
			"requesterId  swapperId _id"
		);
		if (!requester)
			return res.status(404).json({ message: "Requested user not found" });

		const user = await User.findById(requester.requesterId);
		console.log(`${user.firstname}  ${user.lastname}\n`);

		const otp = Math.floor(100000 + Math.random() * 900000).toString();
		const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
		user.otp = otp;
		user.otpExpiresAt = expiresAt;
		await user.save();

		const swapper = await User.findById(requester.swapperId);

		// Email details
		const toEmail = user.email;
		const subject = "Skill Exchanege Confirmation";
		const message = `Dear ${user.firstname}, \n\n If your skill exchange is completed by ${swapper.firstname} ${swapper.lastname} with request Id: ${requester._id}. Kindly provide OTP to them to confirm the completion \nYour OTP for confirmation is: ${otp}. It expires in 10 minutes.`;

		// Send OTP via email
		await sendEmail(toEmail, subject, message);

		return res.status(200).json({ message: "please wait &  confirm OTP " });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal server error" });
	}
});

module.exports = router;
