const multer = require("multer");
const path = require("path");

// Set storage for profile photos
const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, "uploads/"), // Save in 'uploads/' directory
	filename: (req, file, cb) =>
		cb(null, Date.now() + path.extname(file.originalname)), // Unique filename
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
	const allowedTypes = /jpeg|jpg|png/;
	const extname = allowedTypes.test(
		path.extname(file.originalname).toLowerCase()
	);
	const mimetype = allowedTypes.test(file.mimetype);

	extname && mimetype
		? cb(null, true)
		: cb(new Error("Only JPEG, JPG, and PNG images are allowed"));
};

// Middleware with try-catch for error handling
module.exports = async (req, res, next) => {
	try {
		multer({
			storage,
			limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
			fileFilter,
		}).single("profilephoto")(req, res, (err) => {
			if (err) {
				if (
					err instanceof multer.MulterError &&
					err.code === "LIMIT_FILE_SIZE"
				) {
					return res
						.status(400)
						.json({ message: "File size should be less than 5MB" });
				}
				return res.status(402).json({ message: err.message });
			}
			next();
		});
	} catch (error) {
		res.status(500).json({ message: "Something went wrong with file upload" });
	}
};
