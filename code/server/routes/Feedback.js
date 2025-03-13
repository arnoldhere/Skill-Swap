const express = require('express');
const Feedback = require('../models/Feedback'); // Import Feedback model
const router = express.Router();
const verifytoken = require('../middleware/Authmiddleware')

router.post('/Add',verifytoken ,async (req, res) => {
    try {
        const { fullname, email, feedbacktext } = req.body;

        // Validate input
        if (!fullname || !email || !feedbacktext) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Create feedback
        const newFeedback = new Feedback({ fullname, email, feedbacktext });
        await newFeedback.save();

        res.status(201).json({ message: 'Feedback submitted successfully', data: newFeedback });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/All', async (req, res) => {
    try {
        const feedbacks = await Feedback.find(); // Get latest feedbacks first
        res.status(201).json(feedbacks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/Update/:id', async (req, res) => {
    try {
        const { fullname, email, feedbacktext } = req.body;

        const updatedFeedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { fullname, email, feedbacktext },
            { new: true, runValidators: true }
        );

        if (!updatedFeedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }

        res.status(201).json({ message: 'Feedback updated successfully', data: updatedFeedback });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/Delete/:id', async (req, res) => {
    try {
        const deletedFeedback = await Feedback.findByIdAndDelete(req.params.id);
        if (!deletedFeedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }

        res.status(201).json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;