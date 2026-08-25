const loginForm = document.querySelector("#loginForm");
const passwordInput = document.querySelector("#password");
const togglePassword = document.querySelector("#togglePassword");

// UI Elements for toggling Login/Signup
const title = document.querySelector("h2.text-center");
const subtitle = document.querySelector("p.text-secondary");
const submitBtn = document.querySelector("button.w-100");
const switchModeBtn = document.querySelector("p.text-center.mt-4 a"); 

let isLoginMode = true;

// 1. Dynamically create a 'Name' input field (Hidden by default)
const nameDiv = document.createElement("div");
nameDiv.className = "mb-3";
nameDiv.style.display = "none";
nameDiv.innerHTML = `
    <label for="name" class="form-label">Name</label>
    <input type="text" class="form-control" id="name" placeholder="Enter your name">
`;
// Insert it right before the Email field
document.querySelector("#email").closest(".mb-3").before(nameDiv);

// 2. Toggle Mode (Login <-> Sign Up)
switchModeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode; // Switch state

    if (isLoginMode) {
        title.innerText = "Welcome Back 👋";
        subtitle.innerText = "Login to continue your placement journey.";
        submitBtn.innerText = "Login";
        nameDiv.style.display = "none";
        switchModeBtn.innerText = "Sign Up";
        switchModeBtn.parentElement.firstChild.textContent = "Don't have an account? ";
    } else {
        title.innerText = "Create Account 🚀";
        subtitle.innerText = "Start tracking your placement journey.";
        submitBtn.innerText = "Sign Up";
        nameDiv.style.display = "block";
        switchModeBtn.innerText = "Login";
        switchModeBtn.parentElement.firstChild.textContent = "Already have an account? ";
    }
});

// 3. Handle Form Submit for BOTH API Routes
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const name = document.querySelector("#name") ? document.querySelector("#name").value : "";

    // Validation
    if (email === "" || password === "" || (!isLoginMode && name === "")) {
        alert("Please fill all fields!");
        return;
    }

    // Decide which API to hit based on mode
    const endpoint = isLoginMode ? "/api/auth/login" : "/api/auth/register";
    const payload = isLoginMode ? { email, password } : { name, email, password };

    // API Call to MongoDB Backend
    fetch("http://localhost:3000" + endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.success) {
            // Save details to browser memory
            localStorage.setItem("email", data.user.email);
            localStorage.setItem("name", data.user.name);

            alert(data.message); // Will show "Account Created" or "Login Successful"

            // Redirect to Dashboard
            window.location.href = "dashboard.html";
        } else {
            alert(data.message); // Shows "Invalid Credentials" or "User exists"
        }
    })
    .catch((error) => {
        console.log(error);
        alert("Server Error. Is your backend running?");
    });
});

// 4. Password Visibility Toggle
togglePassword.addEventListener("click", () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.innerText = "Hide Password";
    } else {
        passwordInput.type = "password";
        togglePassword.innerText = "Show Password";
    }
});