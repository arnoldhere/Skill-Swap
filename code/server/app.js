const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/Passport");
require("dotenv").config();
const Authroutes = require("./routes/Auth");
const Feedbackroutes = require("./routes/Feedback");
const path = require("path");
const userRoutes = require("./routes/User/Profile");

// Middleware
app.use(cors());
app.use(express.json()); //instead of bodyparser
app.use(
	session({
		secret: process.env.JWT_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded images
app.use(express.urlencoded({ extended: true })); // Handles form data

//all advance routes
app.use("/Auth", Authroutes);
app.use("/Feedback", Feedbackroutes);
app.use("/user", userRoutes);

// Define a basic route
app.get("/", (req, res) => {
	res.status(200).json({ message: "server is running" });
});
// Handle 404 errors
app.use((req, res) => {
	res.status(404).json({ error: "Router not found" });
});

const mongoose = require("mongoose");
const Grid = require("gridfs-stream");

const conn = mongoose.createConnection(process.env.MONGO_URI);

let gfs;

conn.once("open", () => {
	gfs = Grid(conn.db, mongoose.mongo);
	gfs.collection("uploads"); // Ensure files are stored in "uploads" collection
});

module.exports = app;
