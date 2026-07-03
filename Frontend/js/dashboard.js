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
const brand = document.querySelector(".navbar-brand");

brand.addEventListener("click", (event) => {
    event.preventDefault();
});
const questionsSolved = 150;
const githubCommits = 200;
const dayStreak = 15;

document.querySelector("#questionsSolved").innerText = "📚 " + questionsSolved;

document.querySelector("#githubCommits").innerText = "💻 " + githubCommits;

document.querySelector("#dayStreak").innerText = "🔥 " + dayStreak;

const goals = document.querySelectorAll(".form-check-input");

console.log(goals);

goals.forEach((goal) => {

    console.log("Found:", goal.id);

    const savedGoal = localStorage.getItem(goal.id);

    if(savedGoal === "true"){
        goal.checked = true;
    }

    goal.addEventListener("change", function(){

        console.log("Clicked:", goal.id);

        localStorage.setItem(goal.id, goal.checked);

    });

});
const progress = 82;

document.querySelector("#progressBar").style.width = progress + "%";
document.querySelector("#progressText").innerText = progress + "%";

const hour = new Date().getHours();

let greeting = "";

if(hour < 12){
    greeting = "Good Morning ☀️";
}
else if(hour < 17){
    greeting = "Good Afternoon 🌤️";
}
else{
    greeting = "Good Evening 🌙";
}

document.querySelector("#greeting").innerText = greeting + ", " + name + "!";