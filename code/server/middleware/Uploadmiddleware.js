const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/User"); // Import User model

// Ensure directories exist
const ensureDirExists = (dir) => {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
};

// Define storage configuration dynamically based on file type
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		let uploadDir = "uploads/";

		if (file.fieldname === "profilephoto") {
			uploadDir += "profilephotos";
		} else if (file.fieldname === "document") {
			uploadDir += "documents";
		} else {
			return cb(new Error("Invalid field name"), false);
		}

		ensureDirExists(uploadDir);
		cb(null, uploadDir);
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

// File filter for images and documents
const fileFilter = (req, file, cb) => {
	const allowedImageTypes = /jpeg|jpg|png/;
	const allowedDocTypes = /pdf|doc|docx/;

	const extname = path.extname(file.originalname).toLowerCase();
	const mimetype = file.mimetype;

	if (
		(file.fieldname === "profilephoto" &&
			allowedImageTypes.test(extname) &&
			allowedImageTypes.test(mimetype)) ||
		(file.fieldname === "document" &&
			allowedDocTypes.test(extname) &&
			allowedDocTypes.test(mimetype))
	) {
		return cb(null, true);
	}

	cb(new Error("Invalid file type"));
};

const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
	fileFilter,
});

// Function to delete the old profile photo

const deleteOldProfilePhoto = async (userId) => {
	try {
		const user = await User.findById(userId);
		if (user && user.profilephoto) {
			const oldFilePath = path.join(
				__dirname,
				"../uploads/profilephotos",
				user.profilephoto
			);

			// Check if file exists
			if (fs.existsSync(oldFilePath)) {
				// Asynchronously delete the file
				await fs.promises.unlink(oldFilePath);
				console.log("Old profile photo deleted successfully.");
			} else {
				console.log("No old profile photo found.");
			}
		}
	} catch (error) {
		console.error("Error deleting old profile photo:", error);
	}
};
module.exports = { upload, deleteOldProfilePhoto };
