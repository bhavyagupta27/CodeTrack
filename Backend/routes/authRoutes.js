const express = require("express");
const router = express.Router();
const { loginUser, registerUser } = require("../controllers/authControllers"); // Aapke functions import ho gaye

router.post("/login", loginUser);
router.post("/register", registerUser); // Naya signup route

module.exports = router;