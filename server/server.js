const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Import API routes
const contactRoutes = require('./routes/contact');
const eventsRoutes = require('./routes/events');
const membersRoutes = require('./routes/members');
const authRoutes = require('./routes/auth');

// Mount routes
app.use('/api/contact', contactRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        system: 'AAVINYA Backend API Service',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// 404 Route handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start Server
app.listen(PORT, () => {
    console.log(`================================================`);
    console.log(`🚀 AAVINYA API Server running on port ${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`================================================`);
});
