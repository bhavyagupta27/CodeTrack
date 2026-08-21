const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const PORT = 3000;

// Local temporary database
let users = [
    {
        id: 1,
        email: "admin@gmail.com",
        password: "123456",
        name: "Bhavya",
        questionsSolved: 150,
        target: 300,
        githubCommits: 200,
        dayStreak: 15,
        goal: "Full Stack Developer",
        goals: [false, false, false, false], // Tracks your 4 daily checkboxes
        weeklyProgress: [2, 4, 3, 6, 5, 8, 7] // Tracks the chart
    }
];

// Home Route
app.get("/", (req, res) => res.send("🚀 CodeTrack Backend Running (Local Array Mode)"));

// Login Route
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        return res.json({
            success: true,
            message: "Login Successful",
            user: { id: user.id, name: user.name, email: user.email }
        });
    }
    res.json({ success: false, message: "Invalid Credentials" });
});

// Profile Route (Get User Data)
app.post("/profile", (req, res) => {
    const { email } = req.body;
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json(user);
});

// Update Profile Route
app.put("/profile", (req, res) => {
    const { email, name, goal } = req.body;
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    if (name) users[userIndex].name = name;
    if (goal) users[userIndex].goal = goal;

    res.json({
        success: true,
        message: "Profile Updated Successfully",
        user: { name: users[userIndex].name, email: users[userIndex].email, goal: users[userIndex].goal }
    });
});
// Save Daily Goals and Progress
app.put("/progress", (req, res) => {
    const { email, goals, weeklyProgress } = req.body;
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    if (goals) users[userIndex].goals = goals;
    if (weeklyProgress) users[userIndex].weeklyProgress = weeklyProgress;

    res.json({ success: true, message: "Progress synced to backend!" });
});
// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

