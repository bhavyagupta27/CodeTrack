// Counter Animation
const counters = document.querySelectorAll(".counter");

counters.forEach((counter) => {

    const target = +counter.dataset.target;
    let count = 0;
    const increment = target / 100;

    function updateCounter() {

        count += increment;

        counter.innerText = Math.min(Math.ceil(count), target);

        if (count < target) {
            setTimeout(updateCounter, 20);
        }

    }

    updateCounter();

});

// Navbar Scroll Effect
const navbar = document.querySelector("#navbar");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

});

// Login Check
const welcomeUser = document.querySelector("#welcomeUser");
const logoutBtn = document.querySelector("#logoutBtn");

const savedEmail = localStorage.getItem("email");

if (!savedEmail) {

    window.location.href = "login.html";

}

// Show Logged-in User
welcomeUser.innerText = `Welcome, ${savedEmail}`;
logoutBtn.style.display = "inline-block";

// Logout
logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("email");

    alert("Logged Out Successfully!");

    window.location.href = "login.html";

});