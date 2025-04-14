const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const sendEmail = require("../../utils/Sendemail");
const Request = require("../../models/Request");

router.get("/browse-by-category/:id", async (req, res) => {
	try {
		const baseUrl = `${req.protocol}://${req.get(
			"host"
		)}/uploads/profilephotos/`;
		const id = req.params.id;
		console.log(id);
		const users = await User.find({
			skills: {
				$elemMatch: { category: id },
			},
		})
			.populate("skills.category") // to get category name
			.select("-password"); //  exclude sensitive fields;

		if (!users) return res.status(404).json({ message: "users not found...." });

		const usersWithPhoto = users.map((user) => ({
			...user._doc,
			profilephoto: user.profilephoto ? `${baseUrl}${user.profilephoto}` : null,
		}));

		console.log(users);
		return res.status(200).json({ users: usersWithPhoto });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal server error.." });
	}
});

router.post("/book/:uid/:swapperId", async (req, res) => {
	try {
		const { skillId, date, time, message } = req.body.data;
		const requesterId = req.params.uid;
		const swapperId = req.params.swapperId;
		console.log(req.body.data);

		// Prevent requester booking with self
		if (requesterId === swapperId) {
			return res
				.status(400)
				.json({ message: "You can't book your own skill." });
		}
		// 1.  Check if swapper has the skillId in their profile
		const swapper = await User.findById(swapperId);
		if (!swapper) {
			return res.status(404).json({ message: "Swapper not found." });
		}

		const hasSkill = swapper.skills.some(
			(skill) => skill.category.toString() === skillId
		);
		if (!hasSkill) {
			return res
				.status(400)
				.json({ message: "This user does not offer the requested skill." });
		}

		// 2. Prevent duplicate request
		const alreadyRequested = await Request.findOne({
			skillId,
			requesterId,
			swapperId,
		});
		if (alreadyRequested) {
			return res
				.status(400)
				.json({ message: "You have already requested this skill exchange." });
		}

		// 3.  Create new request
		const newRequest = new Request({
			skillId,
			requesterId,
			swapperId,
			message,
			date,
			time,
			status: "Pending",
		});

		await newRequest.save();

		const toEmail = swapper.email;
		const subject = "New Exchage Request | SkillSwap";
		const requester = await User.findById(requesterId);
		if (message != null) {
			const body = `Dear user, \n You have new skill exchange request from ${requester.firstname} ${requester.lastname}.\n \n Login to our system for further proccess. \n\n Here's the message by the user : \n 
			${message}`;
			await sendEmail(toEmail, subject, body);
		} else {
			const body = `Dear user, \n You have new skill exchange request from ${requester.firstname} ${requester.lastname}.\n \n Login to our system for further proccess. `;
			await sendEmail(toEmail, subject, body);
		}

		return res
			.status(200)
			.json({ message: "Skill exchange request sent successfully." });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error.." });
	}
});
module.exports = router;
