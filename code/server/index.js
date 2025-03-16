require('dotenv').config(); // Load environment variables
const express = require('express');
const app = require('./app');
const Grid = require("gridfs-stream");

const connectDB = require("./config/db")



const port = process.env.PORT ||3000 ;  // Get PORT from .env

app.listen(port,connectDB(), () => {
    console.log(`Server is running on port ${port}`);
});
