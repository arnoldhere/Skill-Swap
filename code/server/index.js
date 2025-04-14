require("dotenv").config(); // Load environment variables
const connectDB = require("./config/db");
const express = require("express");
const port = process.env.PORT || 3000; // Get PORT from .env
const app = require("./app");
const http=require("http")
const setupSocket = require("./config/Socket");


const server = http.createServer(app); // ⬅ Create HTTP server manually
setupSocket(server); // ⬅ Pass server to setupSocket



app.listen(port, connectDB(), () => {
	console.log(`Server is running on port ${port}`);
});