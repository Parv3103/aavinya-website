const express = require('express');
const router = express.Router();

// POST /api/auth/login - Handle admin/core portal login
router.post('/login', (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: 'Email and password are required.'
        });
    }

    // Demo Authentication validation
    if (email.endsWith('@jdcoem.ac.in') || email === 'admin@aavinya.in') {
        return res.json({
            success: true,
            message: 'Authentication successful!',
            user: {
                name: email.split('@')[0].toUpperCase(),
                email,
                role: role || 'admin',
                sessionTenure: '2026-27'
            },
            token: `demo_jwt_token_${Date.now()}`
        });
    }

    return res.status(401).json({
        success: false,
        error: 'Invalid credentials. Use an official @jdcoem.ac.in email address.'
    });
});

module.exports = router;
