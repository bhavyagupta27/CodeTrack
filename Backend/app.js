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


// START SERVER
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});