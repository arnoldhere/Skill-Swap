const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Import User model
const bcrypt = require("bcryptjs"); // For password hashing
const jwt = require("jsonwebtoken");
const passport = require("passport");
const upload = require("../middleware/Uploadmiddleware");
require("dotenv").config();
const sendEmail = require("../utils/Sendemail");
const crypto = require("crypto");

router.post("/Signup", upload, async (req, res) => {
	const { firstname, lastname, email, password, phone } = req.body;

	try {
		// Check if the user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(209).json({ message: "Email already exists" });
		}

		// Hash the password
		const salt = await bcrypt.genSalt(10); //gensalt() is a function in the bcrypt library that generates a salt for password hashing.  A salt is a random string added to a password before hashing to make it more secure. It prevents attackers from using precomputed hash attacks (rainbow tables) to crack passwords.
		const hashedPassword = await bcrypt.hash(password, salt);

		// Determine profile photo URL
		const profilephoto = req.file ? `/uploads/Profiles/${req.file.filename}` : ""; // Store file path or empty string

		// Create a new user
		const newUser = new User({
			firstname,
			lastname,
			email,
			password: hashedPassword,
			phone,
			profilephoto,
		});

		// Save the user to the database
		await newUser.save();

		// Respond with success
		res.status(201).json({ message: "User registered successfully" });
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ message: "Server error" });
	}
});

router.post("/Login", async (req, res) => {
	const { email, password } = req.body;

	try {
		// Check if user exists
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: "Invalid email" });
		}

		if (user.modeoflogin == "manual") {
			// Compare password
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return res.status(401).json({ message: "Invalid password" });
			}

			// Generate JWT token
			const token = jwt.sign(
				{
					firstname: user.firstname,
					lastname: user.lastname,
					email: user.email,
				},
				process.env.JWT_SECRET,
				{ expiresIn: "1h" } // Token expires in 1 hour
			);

			console.log("ROLE = " + user.role);

			res.status(201).json({
				message: "Login successful",
				role: user.role,
				token: token,
				id: user._id,
				firstname: user.firstname,
				lastname: user.lastname,
			});
		} else {
			res.status(400).json({ message: "Kindly continue login with google" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Server error" });
	}
});

// Google Login Route
router.get(
	"/Google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
		state: true,
	})
);

// Google Callback Route
router.get(
	"/Google/Callback",
	passport.authenticate("google", {
		successRedirect: "/Auth/Google/Success",
		failureRedirect: "/Auth/Google/Failure",
	})
);

// Success Route
router.get("/Google/Success", (req, res) => {
	if (!req.user) {
		return res.status(400).json({ error: "No user found" });
	}
	// Generate JWT token
	const token = jwt.sign(
		{
			firstname: req.user.firstname,
			lastname: req.user.lastname,
			email: req.user.email,
		},
		process.env.JWT_SECRET,
		{ expiresIn: "1h" } // Token expires in 1 hour
	);
	const firstname = req.user.firstname;
	const lastname = req.user.lastname;
	const id = req.user._id;
	const role = req.user.role;

	res.redirect(
		`http://localhost:4200/auth/Auth/Google/Success?token=${token}&firstname=${firstname}&lastname=${lastname}&role=${role}&id=${id}`
	);
});

// Failure Route
router.get("/Google/Failure", (req, res) => {
	res.status(401).json({ message: "Google authentication failed" });
});

router.post("/Forget-password", async (req, res) => {
	try {
		const { email } = req.body;
		console.log(email);
		if (!email) {
			return res.status(404).json({ error: "Email is required" });
		}

		const user = await User.findOne({ email: email });

		if (!user) {
			return res.status(404).json({ message: "Email not found" });
		}

		const currentTime = Date.now();

		// Check if OTP already exists and is still valid
		if (user.otp && user.otpExpiresAt > currentTime) {
			const remainingTime = Math.ceil((user.otpExpiresAt - currentTime) / 1000); // Convert ms to seconds
			return res.status(429).json({
				message: `OTP already sent. Please check your email. Try again in ${remainingTime} seconds.`,
			});
		}

		// Generate 6-digit OTP
		const otp = crypto.randomInt(100000, 999999);
		console.log(otp);

		user.otp = otp;
		user.otpExpiresAt = Date.now() + 5 * 60 * 1000;

		// Save OTP to database
		await user.save();

		// Email details
		const toEmail = email;
		const subject = "Password Reset OTP";
		const message = `Dear User,\n\nYour OTP for password reset is: ${otp}. It expires in 5 minutes.`;

		// Send OTP via email
		await sendEmail(toEmail, subject, message);

		res.status(201).json({ message: "OTP sent to email successfully" });
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
});

router.post("/Verify-otp", async (req, res) => {
	try {
		const { email, otp } = req.body;

		if (!email || !otp) {
			return res.status(400).json({ message: "Email and OTP are required" });
		}

		// Find the user
		const user = await User.findOne({ email: email });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Check if OTP matches and is not expired
		if (user.otp !== otp) {
			return res.status(400).json({ message: " OTP is invalid" });
		}
		if (user.otpExpiresAt < Date.now()) {
			return res.status(400).json({ message: "otp is expired" });
		}

		// Clear OTP after successful verification
		user.otp = null;
		user.otpExpiresAt = null;
		await user.save();

		res.status(201).json({
			message: "OTP verified successfully. Proceed to reset password.",
		});
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
});

router.post("/Change-password", async (req, res) => {
	try {
		const { email, newPassword } = req.body;

		if (!email || !newPassword) {
			return res
				.status(400)
				.json({ message: "Email and new password are required" });
		}

		// Find the user
		const user = await User.findOne({ email: email });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Hash the new password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(newPassword, salt);

		// Update the password in the database
		user.password = hashedPassword;
		await user.save();

		res.status(200).json({ message: "Password changed successfully." });
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
});

module.exports = router;
