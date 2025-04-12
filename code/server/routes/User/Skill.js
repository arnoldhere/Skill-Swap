const express = require("express");
const router = express.Router();
const User = require("../../models/User");

router.get("/browse-by-category/:id", async (req, res) => {
	try {
		const baseUrl = `${req.protocol}://${req.get(
			"host"
		)}/uploads/profilephotos/`;
		const id = req.params.id;
		console.log(id)
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

		console.log(users)
		return res.status(200).json({ users: usersWithPhoto });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal server error.." });
	}
});

module.exports = router;
