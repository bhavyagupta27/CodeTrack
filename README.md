# 🚀 CodeTrack

A full-stack, responsive placement preparation dashboard built to help students track their DSA progress, daily goals, and GitHub activity.

---

## ✨ Features

- **🔐 Backend Authentication:** Custom login system using a Node.js/Express REST API.
- **👤 Dynamic User Profiles:** Update and persist user goals and names via API endpoints.
- **💻 Live GitHub Integration:** Fetches and displays real-time public repository stats using the official GitHub API.
- **📊 Progress Tracking:** Visualizes placement readiness and daily streaks.
- **✅ Daily Goals:** Tracks daily coding targets with local storage persistence.
- **📱 Responsive UI:** Clean, modern interface with an offcanvas sidebar and dark/light mode toggle.

---

## 🛠️ Tech Stack

**Frontend:**
- HTML5 & CSS3
- Bootstrap 5
- Vanilla JavaScript (ES6)
- Chart.js (Data Visualization)

**Backend:**
- Node.js
- Express.js
- RESTful API Architecture
- CORS

---

## 📂 Project Structure

```text
CodeTrack/
│
├── Backend/
│   ├── app.js               # Main Express server & API routes
│   ├── package.json         # Node dependencies
│   └── .gitignore
│
└── Frontend/
    ├── index.html           # Landing page
    ├── login.html           # Authentication portal
    ├── dashboard.html       # Main user dashboard
    ├── css/
    │   ├── style.css
    │   └── dashboard.css
    └── js/
        ├── script.js        # Landing page animations
        ├── login.js         # Frontend auth handling
        └── dashboard.js     # API fetching & UI logic