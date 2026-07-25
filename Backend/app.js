const express = require("express");

const app = express();

app.use(express.json());

const PORT = 3000;

//Temporary Database
const users = [
    {
        id: 1,
        email: "admin@gmail.com",
        password: "123456",
        name: "Bhavya"
    }
];

// Home Route
app.get("/", (req, res) => {
    res.send("🚀 CodeTrack Backend Running");
});


app.get("/profile", (req, res) => {

    res.json({
        id: 1,
        name: "Bhavya",
        email: "admin@gmail.com",
        goal: "Full Stack Developer"
    });

});


// Login Route
app.post("/login", (req, res) => {

    const { email, password } = req.body;

    const user = users.find(
        (u) =>
            u.email === email &&
            u.password === password
    );

  if (user) {

        return res.json({
            success: true,
            message: "Login Successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

       }

    res.json({
        success: false,
        message: "Invalid Credentials"
    });

});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 