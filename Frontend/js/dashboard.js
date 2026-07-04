const savedEmail = localStorage.getItem("email");

if (!savedEmail) {
    window.location.href = "login.html";
}

const userEmail = document.querySelector("#userEmail");
userEmail.innerText = savedEmail;

const name = savedEmail.split("@")[0];

document.querySelector("#userName").innerText = name;

document.querySelector("#sidebarName").innerText = name;

document.querySelector("#sidebarEmail").innerText = savedEmail;

const logoutBtn = document.querySelector("#logoutBtn");

logoutBtn.addEventListener("click", (event) => {

    event.preventDefault();

    localStorage.removeItem("email");

    alert("Logged Out Successfully!");

    window.location.href = "login.html";

});

const footerLogout = document.querySelector("#footerLogout");

footerLogout.addEventListener("click", (event) => {

    event.preventDefault();

    localStorage.removeItem("email");

    alert("Logged Out Successfully!");

    window.location.href = "login.html";

});

const questionsSolved = 150;
const githubCommits = 200;
const dayStreak = 15;

document.querySelector("#questionsSolved").innerText = "📚 " + questionsSolved;

document.querySelector("#githubCommits").innerText = "💻 " + githubCommits;

document.querySelector("#dayStreak").innerText = "🔥 " + dayStreak;

const goals = document.querySelectorAll(".form-check-input");

goals.forEach((goal) => {
    const savedGoal = localStorage.getItem(goal.id);
    if (savedGoal === "true") {
        goal.checked = true;
    }
    goal.addEventListener("change", function () {
        localStorage.setItem(goal.id, goal.checked);
        updateGoalCounter();
    });
});

const progress = 82;
document.querySelector("#progressBar").style.width = progress + "%";
document.querySelector("#progressText").innerText = progress + "%";
const hour = new Date().getHours();
let greeting = "";
const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
if (hour < 12) {
    greeting = "Good Morning ☀️";
}
else if (hour < 17) {
    greeting = "Good Afternoon 🌤️";
}
else {
    greeting = "Good Evening 🌙";
}

document.querySelector("#greeting").innerText =
    greeting + ", " + formattedName + "!";
const goalCounter = document.querySelector("#goalCounter");
function updateGoalCounter() {

    let completed = 0;

    goals.forEach((goal) => {

        if (goal.checked) {
            completed++;
        }

    });

    if (completed === goals.length) {

        goalCounter.innerText = `${completed} / ${goals.length} Completed 🎉`;

    } else {

        goalCounter.innerText = `${completed} / ${goals.length} Completed`;

    }

}

updateGoalCounter();