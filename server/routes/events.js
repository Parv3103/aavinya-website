const express = require('express');
const router = express.Router();

// Sample Initial Events Data
const events = [
    {
        id: "evt-01",
        title: "AAVINYA First Reinstallation Ceremony",
        category: "Seminar",
        date: "2026-07-15",
        time: "10:00 AM IST",
        venue: "Main Auditorium, JDCOEM",
        description: "Official grand inaugural and first reinstallation ceremony of the AAVINYA AI Forum for the tenure 2026–27.",
        status: "past"
    },
    {
        id: "evt-02",
        title: "NSS Event",
        category: "Seminar",
        date: "2026-08-04",
        time: "11:00 AM IST",
        venue: "Seminar Hall, JDCOEM",
        description: "Special community service and social impact drive organised by the AAVINYA NSS Committee.",
        status: "past"
    },
    {
        id: "evt-03",
        title: "Guest Lecture",
        category: "Talk",
        date: "2026-09-04",
        time: "11:30 AM IST",
        venue: "Auditorium, JDCOEM",
        description: "Interactive guest lecture session by industry professionals on emerging AI technologies and career pathways.",
        status: "past"
    },
    {
        id: "evt-04",
        title: "SkillSpark 2.0",
        category: "Workshop",
        date: "2026-09-07",
        time: "10:00 AM IST",
        venue: "AI Tech Labs, JDCOEM",
        description: "Two-day hands-on technical workshop (7–8 September 2026) focusing on modern AI tools, practical coding, and project development.",
        status: "past"
    },
    {
        id: "evt-05",
        title: "Stock Market Session",
        category: "Talk",
        date: "2026-09-30",
        time: "02:00 PM IST",
        venue: "Seminar Hall, JDCOEM",
        description: "Educational session on stock market fundamentals, financial data analytics, and AI applications in algorithmic trading.",
        status: "past"
    }
];

const registrations = [];

// GET /api/events - List all events
router.get('/', (req, res) => {
    const { category } = req.query;
    let filteredEvents = events;

    if (category && category !== 'all') {
        filteredEvents = events.filter(e => e.category.toLowerCase() === category.toLowerCase());
    }

    res.json({
        success: true,
        count: filteredEvents.length,
        events: filteredEvents
    });
});

// POST /api/events/:id/register - Register for an event
router.post('/:id/register', (req, res) => {
    const eventId = req.params.id;
    const { name, email, year, department, studentId } = req.body;

    const event = events.find(e => e.id === eventId);
    if (!event) {
        return res.status(404).json({ success: false, error: 'Event not found' });
    }

    if (!name || !email || !studentId) {
        return res.status(400).json({ success: false, error: 'Name, email, and Student ID are required' });
    }

    const reg = {
        registrationId: `REG_${Date.now()}`,
        eventId,
        eventTitle: event.title,
        name,
        email,
        year,
        department,
        studentId,
        registeredAt: new Date().toISOString()
    };

    registrations.push(reg);
    console.log(`🎟️ New Event Registration for [${event.title}]:`, reg);

    res.status(201).json({
        success: true,
        message: `Successfully registered for ${event.title}!`,
        data: reg
    });
});

// In-memory gallery storage per event
const eventGalleries = {
    "evt-01": [
        { type: "image", url: "images/AAVINYA_LOGO.jpeg", title: "Orientation Keynote Address", caption: "Admin Body presenting the annual roadmap." },
        { type: "video", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", title: "Orientation Highlights Reel", caption: "Opening ceremony highlights video." }
    ],
    "ev-01": [
        { type: "image", url: "images/AAVINYA_LOGO.jpeg", title: "Orientation Keynote Address", caption: "Admin Body presenting the annual roadmap." },
        { type: "video", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", title: "Orientation Highlights Reel", caption: "Opening ceremony highlights video." }
    ]
};

// GET /api/events/:id/gallery - Fetch event gallery items
router.get('/:id/gallery', (req, res) => {
    const eventId = req.params.id;
    const gallery = eventGalleries[eventId] || [];
    res.json({
        success: true,
        eventId,
        count: gallery.length,
        gallery
    });
});

// POST /api/events/:id/gallery - Upload new photo or video to event gallery
router.post('/:id/gallery', (req, res) => {
    const eventId = req.params.id;
    const { type, url, title, caption } = req.body;

    if (!url || !type) {
        return res.status(400).json({
            success: false,
            error: 'Media URL and type (image or video) are required.'
        });
    }

    if (!eventGalleries[eventId]) {
        eventGalleries[eventId] = [];
    }

    const newItem = {
        id: `MED_${Date.now()}`,
        type: type === 'video' ? 'video' : 'image',
        url,
        title: title || (type === 'video' ? 'Event Video Clip' : 'Event Photo'),
        caption: caption || '',
        uploadedAt: new Date().toISOString()
    };

    eventGalleries[eventId].unshift(newItem);
    console.log(`📸 New Media Uploaded for Event [${eventId}]:`, newItem);

    res.status(201).json({
        success: true,
        message: 'Media uploaded successfully to event gallery!',
        data: newItem,
        gallery: eventGalleries[eventId]
    });
});

module.exports = router;
