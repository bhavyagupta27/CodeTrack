const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, default: "New Developer" },
    goal: { type: String, default: "Software Engineer" },
    questionsSolved: { type: Number, default: 0 },
    githubCommits: { type: Number, default: 0 },
    dayStreak: { type: Number, default: 0 },
    target: { type: Number, default: 300 }
});

module.exports = mongoose.model('User', userSchema);