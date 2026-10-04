const express = require('express');
const router = express.Router();

// In-memory store for demo (can be connected to DB)
const messages = [];

// POST /api/contact - Submit contact form
router.post('/', (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({
            success: false,
            error: 'All fields (name, email, subject, message) are required.'
        });
    }

    const newMessage = {
        id: `MSG_${Date.now()}`,
        name,
        email,
        subject,
        message,
        receivedAt: new Date().toISOString(),
        status: 'unread'
    };

    messages.push(newMessage);
    console.log('📥 New Contact Message Received:', newMessage);

    return res.status(201).json({
        success: true,
        message: 'Thank you! Your message has been received by AAVINYA team.',
        data: newMessage
    });
});

// GET /api/contact - Fetch all messages (Admin view)
router.get('/', (req, res) => {
    res.json({
        success: true,
        count: messages.length,
        messages
    });
});

module.exports = router;
