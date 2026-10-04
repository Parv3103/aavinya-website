/* ==========================================================================
   AAVINYA — AI Forum | Department of Artificial Intelligence
   J D College of Engineering & Management, Nagpur
   Tenure 2026-27
   --------------------------------------------------------------------------
   DATA LAYER
   All site content lives here. The UI in js/main.js is generated from these
   structures, so updating content never requires touching index.html.

   NOTE (backend-ready): every collection below is exported on `window.AAVINYA_DATA`
   and read through `DataService` in main.js. When a backend becomes available,
   only DataService needs to change (fetch('/api/committees') etc.).
   ========================================================================== */

/* -------------------------------------------------------------------------
   SITE CONFIG
   ------------------------------------------------------------------------- */
const SITE_CONFIG = {
  name: "AAVINYA",
  tagline: "Building the Future with Artificial Intelligence",
  motto: "Innovate • Integrate • Inspire",
  department: "Department of Artificial Intelligence",
  college: "J D College of Engineering & Management, Nagpur",
  session: "2026–27",
  logo: "images/AAVINYA_LOGO.jpeg",
  intro:
    "An AI community focused on innovation, research, technical skills, collaboration and real-world problem solving.",
  whoWeAre:
    "AAVINYA is a platform for AI discussions, research, skill development, collaboration and knowledge sharing among AI enthusiasts, researchers and professionals.",
  contact: {
    email: "nishantcod10@gmail.com",
    phone: "+91 8956159150",
    address:
      "Department of Artificial Intelligence, J D College of Engineering & Management, Katol Road, Nagpur, Maharashtra 441501"
  },
  // Placeholder credentials hints for the FRONTEND-ONLY demo login modal.
  authNote:
    "Demo interface only — no real authentication is performed in the browser."
};

/* -------------------------------------------------------------------------
   STATISTICS (animated counters)
   ------------------------------------------------------------------------- */
const STATS = [
  { value: 120, suffix: "+", label: "Students", icon: "fa-solid fa-users" },
  { value: 5, suffix: "+", label: "Events", icon: "fa-solid fa-calendar-check" },
  { value: 20, suffix: "+", label: "Projects", icon: "fa-solid fa-diagram-project" },
  { value: 8, suffix: "+", label: "Awards", icon: "fa-solid fa-trophy" }
];

/* -------------------------------------------------------------------------
   VISION & MISSION
   ------------------------------------------------------------------------- */
const VISION = {
  title: "Vision",
  icon: "fa-solid fa-eye",
  text:
    "To become a platform for AI discussions, research, and skill development. We aspire to inspire the next generation of AI leaders to drive meaningful AI advancements, contribute to the responsible and ethical deployment of AI technologies for the betterment of society."
};

const MISSION = {
  title: "Mission",
  icon: "fa-solid fa-rocket",
  text:
    "To foster collaboration, innovation, and knowledge sharing among AI enthusiasts, researchers, and professionals. We aim to create a vibrant and inclusive community that empowers individuals to explore the limitless potential of Artificial Intelligence while addressing real-world challenges."
};

/* -------------------------------------------------------------------------
   WHAT WE RUN
   ------------------------------------------------------------------------- */
const WHAT_WE_RUN = [
  {
    title: "Research",
    icon: "fa-solid fa-flask-vial",
    desc:
      "Reading groups and guided research tracks on machine learning, deep learning, computer vision and NLP — from paper to prototype."
  },
  {
    title: "Build Labs",
    icon: "fa-solid fa-code",
    desc:
      "Hands-on lab sessions where teams build and ship real AI projects with mentorship, code reviews and deployment practice."
  },
  {
    title: "Competitions",
    icon: "fa-solid fa-flag-checkered",
    desc:
      "Internal and inter-college hackathons, datathons and coding contests that turn classroom theory into competitive skill."
  },
  {
    title: "Workshops",
    icon: "fa-solid fa-screwdriver-wrench",
    desc:
      "Practical workshops on Python, data science, generative AI, MLOps and the tooling the industry actually uses."
  },
  {
    title: "Talks",
    icon: "fa-solid fa-microphone-lines",
    desc:
      "Expert talks and alumni sessions that connect students with researchers, engineers and founders working in AI."
  },
  {
    title: "Community",
    icon: "fa-solid fa-people-group",
    desc:
      "A peer network for mentorship, study circles, placement preparation and knowledge sharing across all years."
  }
];
/* -------------------------------------------------------------------------
   HEAD OF DEPARTMENT (HOD) — AAVINYA 2026-27
   ------------------------------------------------------------------------- */
const HOD = [
  { name: "Dr. Ashutosh Lanjewar", position: "Head of Department (HOD)", photo: "images/members/ashutosh sir.jpeg", email: "", linkedin: "" }
];

/* -------------------------------------------------------------------------
   FORUM INCHARGE — AAVINYA 2026-27
   (Official record: do not modify names, order or positions.)
   ------------------------------------------------------------------------- */
const FORUM_INCHARGE = [
  { name: "Yogita Maske", position: "Forum Incharge", photo: "images/members/yogita.jpeg", email: "", linkedin: "" }
];
/* -------------------------------------------------------------------------
   OFFICIAL ADMIN BODY — AAVINYA 2026-27
   (Official record: do not modify names, order or positions.)
   ------------------------------------------------------------------------- */
const ADMIN_BODY = [
  { name: "Nishant Bobade", position: "President", photo: "images/members/nishant.jpeg", email: "nishantcod10@gmail.com", linkedin: "" },
  { name: "Nitya Patle", position: "Vice-President", photo: "images/members/nitya.jpeg", email: "", linkedin: "" },
  { name: "Manthan Mamidwar", position: "Treasurer", photo: "images/members/manthan.jpeg", email: "", linkedin: "" },
  { name: "Varad Gosavi", position: "Student Coordinator", photo: "images/members/varad.jpeg", email: "", linkedin: "" },
  { name: "Ayush Mapari", position: "Secretary", photo: "images/members/ayush-mapari.jpeg", email: "", linkedin: "" },
  { name: "Ritu Shillar", position: "Joint Secretary", photo: "images/members/ritu.jpeg", email: "", linkedin: "" },
  { name: "Akshita Sankat", position: "Spokesperson", photo: "images/members/akshita.jpeg", email: "", linkedin: "" }
];

/* -------------------------------------------------------------------------
   OFFICIAL COMMITTEES — AAVINYA 2026-27
   (Official record: hierarchy preserved exactly as issued.)
   ------------------------------------------------------------------------- */
const COMMITTEES = [
  {
    id: "event",
    name: "Event Committee",
    short: "Event",
    icon: "fa-solid fa-calendar-days",
    tag: "Planning & Execution",
    head: { name: "Somesh Paunikar", photo: "images/members/somesh.jpeg", email: "", linkedin: "" },
    coHeads: [
      { name: "Suhani Vaidya", photo: "images/members/suhani.jpeg", email: "", linkedin: "" }
    ],
    members: [
      { name: "Kshitij Kshirsagar", photo: "images/members/kshitij.jpeg", email: "", linkedin: "" },
      { name: "Purtika Chavhan", photo: "images/members/purtika.jpeg", email: "", linkedin: "" },
      { name: "Ayushi Gaherwar", photo: "images/members/ayushi.jpeg", email: "", linkedin: "" },
      { name: "Kartik Shriwas", photo: "images/members/kartik.jpeg", email: "", linkedin: "" },
      { name: "Neha Panchal", photo: "images/members/neha.jpeg", email: "", linkedin: "" }
    ]
  },
  {
    id: "creative",
    name: "Creative Committee",
    short: "Creative",
    icon: "fa-solid fa-palette",
    tag: "Design & Identity",
    head: { name: "Rasika Pachode", photo: "images/members/rasika.jpeg", email: "", linkedin: "" },
    coHeads: [
      { name: "Kanchan Kaware", photo: "images/members/kanchan.jpeg", email: "", linkedin: "" }
    ],
    members: [
      { name: "Richa Nandankar", photo: "images/members/richa.jpeg", email: "", linkedin: "" },
      { name: "Nandini Pampattiwar", photo: "images/members/nandini-pampattiwar.jpeg", email: "", linkedin: "" },
      { name: "Shreyashi Kosarkar", photo: "images/members/shreyashi.jpeg", email: "", linkedin: "" },
      { name: "Nidhi Khadse", photo: "images/members/nidhi.jpeg", email: "", linkedin: "" },
      { name: "Aditya Deshpande", photo: "images/members/aditya-deshpande.jpeg", email: "", linkedin: "" },
      { name: "Piyush Gathibandhe", photo: "images/members/piyush-gathibandhe.jpeg", email: "", linkedin: "" }
    ]
  },
  {
    id: "content",
    name: "Content Committee",
    short: "Content",
    icon: "fa-solid fa-pen-nib",
    tag: "Words & Narrative",
    head: { name: "Avinash Punjare", photo: "images/members/avinash.jpeg", email: "", linkedin: "" },
    coHeads: [
      { name: "Pallavi Lakde", photo: "images/members/pallavi.jpeg", email: "", linkedin: "" }
    ],
    members: [
      { name: "Shweta Hajare", photo: "images/members/shweta.jpeg", email: "", linkedin: "" },
      { name: "Rushikesh Wagh", photo: "images/members/rushikesh.jpeg", email: "", linkedin: "" },
      { name: "Nandini Bhujade", photo: "images/members/nandini-bhujade.jpeg", email: "", linkedin: "" }
    ]
  },
  {
    id: "publicity",
    name: "Publicity Committee",
    short: "Publicity",
    icon: "fa-solid fa-bullhorn",
    tag: "Outreach & Reach",
    head: { name: "Anshul Barbate", photo: "images/members/anshul-barbate.jpeg", email: "", linkedin: "" },
    coHeads: [
      { name: "Shrushti Shende", photo: "images/members/shrushti.jpeg", email: "", linkedin: "" },
      { name: "Anjali Dhande", photo: "images/members/anjali.jpeg", email: "", linkedin: "" }
    ],
    members: [
      { name: "Tanay Nandeshwar", photo: "images/members/tanay.jpeg", email: "", linkedin: "" },
      { name: "Aashu Sakhare", photo: "images/members/aashu.jpeg", email: "", linkedin: "" }
    ]
  },
  {
    id: "digital",
    name: "Digital Committee",
    short: "Digital",
    icon: "fa-solid fa-signal",
    tag: "Social & Media",
    head: { name: "Sujal Tabhane", photo: "images/members/sujal.jpeg", email: "", linkedin: "" },
    coHeads: [
      { name: "Sahil Sirsam", photo: "images/members/sahil.jpeg", email: "", linkedin: "" },
      { name: "Vedant Lute", photo: "images/members/vedant.jpeg", email: "", linkedin: "" }
    ],
    members: [
      { name: "Lalit Devgade", photo: "images/members/lalit.jpeg", email: "", linkedin: "" },
      { name: "Gururaj Sonwane", photo: "images/members/gururaj.jpeg", email: "", linkedin: "" },
      { name: "Shreya Tidke", photo: "images/members/shreya.jpeg", email: "", linkedin: "" }
    ]
  },
  {
    id: "technical",
    name: "Technical Committee",
    short: "Technical",
    icon: "fa-solid fa-microchip",
    tag: "Code & Systems",
    head: { name: "Yash Bawane", photo: "images/members/yash.jpeg", email: "", linkedin: "" },
    coHeads: [
      { name: "Vicky Tokalwad", photo: "images/members/vicky.jpeg", email: "", linkedin: "" },
      { name: "Harish Jadhav", photo: "images/members/harish.jpeg", email: "", linkedin: "" }
    ],
    members: [
      { name: "Bhavesh Thote", photo: "images/members/bhavesh.jpeg", email: "", linkedin: "" },
      { name: "Dinesh Parate", photo: "images/members/dinesh.jpeg", email: "", linkedin: "" },
      { name: "Ayush Gedam", photo: "images/members/ayush-gedam.jpeg", email: "", linkedin: "" }
    ]
  },
  {
    id: "tech-spot",
    name: "Tech-Spot Committee",
    short: "Tech-Spot",
    icon: "fa-solid fa-lightbulb",
    tag: "Tech Culture",
    head: { name: "Parv Bisen", photo: "images/members/parv.jpeg", email: "", linkedin: "" },
    coHeads: [
      { name: "Dhawal Shende", photo: "images/members/dhawal.jpeg", email: "", linkedin: "" },
      { name: "Aryan Kedar", photo: "images/members/aryan.jpeg", email: "", linkedin: "" }
    ],
    members: [
      { name: "Aditya Doye", photo: "images/members/aditya-doye.jpeg", email: "", linkedin: "" },
      { name: "Anshul Nipane", photo: "images/members/anshul-nipane.jpeg", email: "", linkedin: "" },
      { name: "Sameer Bangare", photo: "images/members/sameer.jpeg", email: "", linkedin: "" }
    ]
  },
  {
    id: "startup",
    name: "Startup Committee",
    short: "Startup",
    icon: "fa-solid fa-chart-line",
    tag: "Entrepreneurship",
    head: { name: "Shutali Sakhare", photo: "images/members/shutali.jpeg", email: "", linkedin: "" },
    coHeads: [
      { name: "Navinya Malewar", photo: "images/members/navinya.jpeg", email: "", linkedin: "" }
    ],
    members: [
      { name: "Shantanu Kuhikar", photo: "images/members/shantanu.jpeg", email: "", linkedin: "" },
      { name: "Hitanshu Nimje", photo: "images/members/hitanshu.jpeg", email: "", linkedin: "" }
    ]
  },
  {
    id: "nss",
    name: "NSS Committee",
    short: "NSS",
    icon: "fa-solid fa-hand-holding-heart",
    tag: "Social Service",
    head: { name: "Himanshi Dhekan", photo: "images/members/himanshi.jpeg", email: "", linkedin: "" },
    coHeads: [
      { name: "Palak Sawarkar", photo: "images/members/palak.jpeg", email: "", linkedin: "" }
    ],
    members: [
      { name: "Vidhi Khaparde", photo: "images/members/vidhi.jpeg", email: "", linkedin: "" },
      { name: "Apurva Ingley", photo: "images/members/apurva.jpeg", email: "", linkedin: "" },
      { name: "Parth Ghosare", photo: "images/members/parth-ghosare.jpeg", email: "", linkedin: "" }
    ]
  },
  {
    id: "discipline",
    name: "Discipline Committee",
    short: "Discipline",
    icon: "fa-solid fa-shield-halved",
    tag: "Order & Conduct",
    head: { name: "Janvhi Sonewane", photo: "images/members/janvhi.jpeg", email: "", linkedin: "" },
    coHeads: [
      { name: "Pratiksha Banothe", photo: "images/members/pratiksha.jpeg", email: "", linkedin: "" },
      { name: "Shreenath Pawar", photo: "images/members/shreenath.jpeg", email: "", linkedin: "" }
    ],
    members: [
      { name: "Divya Anjankar", photo: "images/members/divya.jpeg", email: "", linkedin: "" },
      { name: "Praharsh Tabhane", photo: "images/members/praharsh.jpeg", email: "", linkedin: "" },
      { name: "Viraj Motghare", photo: "images/members/viraj.jpeg", email: "", linkedin: "" }
    ]
  },
  {
    id: "sports",
    name: "Sports Committee",
    short: "Sports",
    icon: "fa-solid fa-futbol",
    tag: "Fitness & Games",
    head: { name: "Parth Rakhonde", photo: "images/members/parth-rakhonde.jpeg", email: "", linkedin: "" },
    coHeads: [
      { name: "Piyush Sambare", photo: "images/members/piyush-sambare.jpeg", email: "", linkedin: "" },
      { name: "Nelson Alewar", photo: "images/members/nelson.jpeg", email: "", linkedin: "" }
    ],
    members: [
      { name: "Saumya Shirbate", photo: "images/members/saumya.jpeg", email: "", linkedin: "" },
      { name: "Anush Misal", photo: "images/members/anush.jpeg", email: "", linkedin: "" },
      { name: "Chandan Rathod", photo: "images/members/chandan.jpeg", email: "", linkedin: "" },
      { name: "Jyoti Barkhade", photo: "images/members/jyoti.jpeg", email: "", linkedin: "" }
    ]
  },
  {
    id: "magazine",
    name: "Magazine Committee",
    short: "Magazine",
    icon: "fa-solid fa-book-open",
    tag: "Publication",
    head: { name: "Bhumika Bisen", photo: "images/members/bhumika.jpeg", email: "", linkedin: "" },
    coHeads: [
      { name: "Rutuja Dhote", photo: "images/members/rutuja.jpeg", email: "", linkedin: "" }
    ],
    members: [
      { name: "Sanskruti Motghare", photo: "images/members/sanskruti.jpeg", email: "", linkedin: "" },
      { name: "Ujawal Khade", photo: "images/members/ujawal.jpeg", email: "", linkedin: "" }
    ]
  }
];

/* -------------------------------------------------------------------------
   EVENTS
   status: "upcoming" | "past"
   category: Workshop | Hackathon | Talk | Seminar | Competition
   ------------------------------------------------------------------------- */
const EVENTS = [
  {
    id: "ev-01",
    name: "AAVINYA First Reinstallation Ceremony",
    date: "2026-07-15",
    category: "Seminar",
    status: "past",
    venue: "Main Auditorium, JDCOEM",
    description:
      "Official grand inaugural and first reinstallation ceremony of the AAVINYA AI Forum for the tenure 2026–27.",
    highlight: "Inaugural & Admin Body Installation",
    image: "",
    driveUrl: "https://drive.google.com/drive/folders/14XsBtYfmyRzBkJGjA-zUetnWRbLSYNze",
    gallery: []
  },
  {
    id: "ev-02",
    name: "NSS Event",
    date: "2026-08-04",
    category: "Seminar",
    status: "past",
    venue: "Seminar Hall, JDCOEM",
    description:
      "Special community service and social impact drive organised by the AAVINYA NSS Committee.",
    highlight: "Social Service & Community Outreach",
    image: "",
    driveUrl: "https://drive.google.com/drive/folders/1c77gj7lbaGLDGeFMnO9eqxv8egkjAQ8w",
    gallery: []
  },
  {
    id: "ev-03",
    name: "Guest Lecture",
    date: "2026-09-04",
    category: "Talk",
    status: "past",
    venue: "Auditorium, JDCOEM",
    description:
      "Interactive guest lecture session by industry professionals on emerging AI technologies and career pathways.",
    highlight: "Industry Expert Speaker Session",
    image: "",
    driveUrl: "https://drive.google.com/drive/folders/1LgSMsq_cUL99gxMrm6lPlDiuEIolontn",
    gallery: []
  },
  {
    id: "ev-04",
    name: "SkillSpark 2.0",
    date: "2026-09-07",
    category: "Workshop",
    status: "past",
    venue: "AI Tech Labs, JDCOEM",
    description:
      "Two-day hands-on technical workshop (7–8 September 2026) focusing on modern AI tools, practical coding, and project development.",
    highlight: "2-Day Technical Workshop (7–8 Sept)",
    image: "",
    driveUrl: "https://drive.google.com/",
    gallery: []
  },
  {
    id: "ev-05",
    name: "Stock Market Session",
    date: "2026-09-30",
    category: "Talk",
    status: "past",
    venue: "Seminar Hall, JDCOEM",
    description:
      "Educational session on stock market fundamentals, financial data analytics, and AI applications in algorithmic trading.",
    highlight: "Financial Literacy & Market Analysis",
    image: "",
    driveUrl: "https://drive.google.com/drive/folders/1y8K32HcLTuwnzE3YZeuJKiYW-K473oz5",
    gallery: []
  }
];

/* -------------------------------------------------------------------------
   SOCIAL LINKS
   Replace the `url` values with the forum's official handles.
   ------------------------------------------------------------------------- */
const SOCIAL_LINKS = [
  {
    platform: "Instagram",
    handle: "@aavinya_jd",
    icon: "fa-brands fa-instagram",
    url: "https://www.instagram.com/",
    desc: "Event reels, posters, announcements and behind-the-scenes from the forum.",
    color: "#e1306c"
  },
  {
    platform: "LinkedIn",
    handle: "AAVINYA AI Forum",
    icon: "fa-brands fa-linkedin-in",
    url: "https://www.linkedin.com/",
    desc: "Professional updates, achievements, collaborations and alumni network.",
    color: "#0a66c2"
  },
  {
    platform: "GitHub",
    handle: "aavinya",
    icon: "fa-brands fa-github",
    url: "https://github.com/",
    desc: "Open-source AI projects, workshop notebooks and build-lab repositories.",
    color: "#c9d1d9"
  },
  {
    platform: "Email",
    handle: SITE_CONFIG.contact.email,
    icon: "fa-solid fa-envelope",
    url: "mailto:" + SITE_CONFIG.contact.email,
    desc: "Write to us for collaborations, sponsorships and general queries.",
    color: "#2BB8D8"
  }
];

/* -------------------------------------------------------------------------
   EXPORT (single namespace consumed by main.js)
   ------------------------------------------------------------------------- */
window.AAVINYA_DATA = {
  SITE_CONFIG,
  STATS,
  VISION,
  MISSION,
  WHAT_WE_RUN,
  HOD,
  FORUM_INCHARGE,
  ADMIN_BODY,
  COMMITTEES,
  EVENTS,
  SOCIAL_LINKS
};
