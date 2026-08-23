const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },

        questionsSolved: {
            type: Number,
            default: 0
        },

        target: {
            type: Number,
            default: 300
        },

        githubCommits: {
            type: Number,
            default: 0
        },

        dayStreak: {
            type: Number,
            default: 0
        },

        goal: {
            type: String,
            default: "Full Stack Developer"
        },

        goals: {
            type: [Boolean],
            default: [false, false, false, false]
        },

        weeklyProgress: {
            type: [Number],
            default: [0, 0, 0, 0, 0, 0, 0]
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);