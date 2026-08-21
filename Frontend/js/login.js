const loginForm = document.querySelector("#loginForm");

loginForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    if (email === "" || password === "") {
        alert("Please fill all fields!");
        return;
    }

    fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        email: email,
        password: password
    })
})
.then((response) => response.json())
.then((data) => {

    if (data.success) {

        localStorage.setItem("email", data.user.email);
        localStorage.setItem("name", data.user.name);

        alert(data.message);

        window.location.href = "dashboard.html";

    } else {

        alert(data.message);

    }

})
.catch((error) => {

    console.log(error);

    alert("Server Error");

});



});


const passwordInput = document.querySelector("#password");
const togglePassword = document.querySelector("#togglePassword");

togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.innerText = "Hide Password";

    }

    else {

        passwordInput.type = "password";

        togglePassword.innerText = "Show Password";

    }

});

