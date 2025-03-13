const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		firstname: {
			type: String,
			required: [true, "First name is required"], // Custom error message
			minlength: [3, "First name must be at least 3 characters"],
			maxlength: [50, "First name cannot exceed 50 characters"],
		},
		lastname: {
			type: String,
			required: [true, "Last name is required"],
			minlength: [3, "Last name must be at least 3 characters"],
			maxlength: [50, "Last name cannot exceed 50 characters"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true, // Ensure unique email addresses
			match: [/\S+@\S+\.\S+/, "Email is invalid"],
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: [6, "Password must be at least 6 characters"], // Minimum length for password
		},
		phone: {
			type: String,
			required: [true, "Phone number is required"],
			match: [/^\d{10}$/, "Phone number must be 10 digits"],
		},
		modeoflogin: {
			type: String,
			enum: ["manual", "google"], // Allowed values
			required: true,
			default: "manual",
		},
		profilephoto: {
			type: String, // URL of the uploaded profile picture
		},
		otp: {
			type: String,
		}, // Store OTP here
		otpExpiresAt: {
			type: Date,
		}, // OTP expiry time
		role: { type: String, enum: ["user", "admin"], default: "user" },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
