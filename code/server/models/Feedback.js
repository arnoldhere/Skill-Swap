const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'Full name is required'],
        minlength: [3, 'Full name must be at least 3 characters'],
        maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/\S+@\S+\.\S+/, 'Email is invalid'],
    },
    feedbacktext: {
        type: String,
        required: [true, 'Feedback is required'],
        minlength: [10, 'Feedback must be at least 10 characters'],
        maxlength: [1000, 'Feedback cannot exceed 1000 characters'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
