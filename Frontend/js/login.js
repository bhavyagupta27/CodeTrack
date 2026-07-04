const loginForm = document.querySelector("#loginForm");

loginForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    if (email === "" || password === "") {
        alert("Please fill all fields!");
        return;
    }

    const correctEmail = "admin@gmail.com";
    const correctPassword = "123456";

    if (email === correctEmail && password === correctPassword) {

        localStorage.setItem("email", email);

        alert("Login Successful!");

        window.location.href = "index.html";
    }
    else {

        alert("Invalid Email or Password");

    }

});


const passwordInput = document.querySelector("#password");
const togglePassword = document.querySelector("#togglePassword");

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.innerText = "Hide Password";

    }

    else {

        passwordInput.type = "password";

        togglePassword.innerText = "Show Password";

    }

});

