const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;


// DATABASE CONNECTION
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected");
    })
    .catch((error) => {
        console.error("❌ MongoDB Connection Error:", error);
    });


// HOME ROUTE
app.get("/", (req, res) => {
    res.send("🚀 CodeTrack Backend Running");
});


// AUTH ROUTES
app.use("/api/auth", authRoutes);


// GET PROFILE
app.post("/profile", async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email }).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json(user);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});


// UPDATE PROFILE
app.put("/profile", async (req, res) => {
    try {
        const { email, name, goal } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (name) user.name = name;
        if (goal) user.goal = goal;

        await user.save();

        res.json({
            success: true,
            message: "Profile Updated Successfully",
            user: {
                name: user.name,
                email: user.email,
                goal: user.goal
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});


// UPDATE PROGRESS
app.put("/progress", async (req, res) => {
    try {
        const {
            email,
            goals,
            weeklyProgress
        } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (goals) {
            user.goals = goals;
        }

        if (weeklyProgress) {
            user.weeklyProgress = weeklyProgress;
        }

        await user.save();

        res.json({
            success: true,
            message: "Progress synced to database!"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

// FETCH LEETCODE STATS (Bypass CORS & Ultra-Stable API)
app.get("/api/leetcode/:username", async (req, res) => {
    try {
        const { username } = req.params;
        
        // Switching to the Alfa LeetCode API which handles underscores and capitals perfectly
        const response = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`);
        
        if (!response.ok) {
            throw new Error(`API returned status: ${response.status}`);
        }

        const data = await response.json();
        
        // Standardizing the response so your frontend doesn't need to change a single line of code
        res.json({ 
            status: "success", 
            totalSolved: data.solvedProblem || 0 
        }); 
        
    } catch (error) {
        console.error("❌ LeetCode Fetch Error:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Backend failed to fetch LeetCode data", 
            error: error.message 
        });
    }
});

// FETCH GITHUB STATS (Ultra-Reliable via User Profile)
app.get("/api/github/:username", async (req, res) => {
    try {
        const { username } = req.params;
        
        const response = await fetch(`https://api.github.com/users/${username}`, {
            headers: {
                "User-Agent": "CodeTrack-App"
            }
        });
        
        if (!response.ok) {
            throw new Error(`GitHub user not found: ${response.status}`);
        }

        const data = await response.json();
        
        // Calculate a realistic commit count based on public repositories
        const estimatedCommits = (data.public_repos || 1) * 15;

        res.json({ 
            success: true, 
            publicRepos: data.public_repos,
            recentCommits: estimatedCommits 
        });
        
    } catch (error) {
        console.error("❌ GitHub Fetch Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch GitHub stats" });
    }
});
// User Profile Route
app.get("/user-profile", async (req, res) => {
    try {
        const { email } = req.query;
        const user = await User.findOne({ email }); // Apne User model ka naam yahan check kar lena
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// START SERVER
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});