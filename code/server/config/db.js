const mongoose = require('mongoose');
require('dotenv').config();  // Load environment variables

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error(error.message);
        process.exit(1);  // Exit the process with failure (process.exit(1); is used in Node.js to stop the application and exit the process with a specific status code.)
    }
};

module.exports = connectDB;
