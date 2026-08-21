const savedEmail = localStorage.getItem("email");

if (!savedEmail) {
    window.location.href = "login.html";
}

const userEmail = document.querySelector("#userEmail");
userEmail.innerText = savedEmail;

const name = savedEmail.split("@")[0];
const displayName = localStorage.getItem("name") || name;
const avatar = document.querySelector("#profileAvatar");

avatar.src = `https://ui-avatars.com/api/?name=${displayName}&background=8b5cf6&color=fff&size=120`;
document.querySelector("#userName").innerText = displayName;
document.querySelector("#sidebarName").innerText = displayName;
document.querySelector("#sidebarEmail").innerText = savedEmail;

const logoutBtn = document.querySelector("#logoutBtn");
logoutBtn.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("goal");
    alert("Logged Out Successfully!");
    window.location.href = "login.html";
});

const footerLogout = document.querySelector("#footerLogout");
footerLogout.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("goal");
    alert("Logged Out Successfully!");
    window.location.href = "login.html";
});

// Fetch User Data from MongoDB
fetch("http://localhost:3000/profile", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ email: savedEmail })
})
.then((response) => response.json())
.then((data) => {
    if(data) {
        document.querySelector("#questionsSolved").innerText = "📚 " + (data.questionsSolved || 0);
        document.querySelector("#githubCommits").innerText = "💻 " + (data.githubCommits || 0);
        document.querySelector("#dayStreak").innerText = "🔥 " + (data.dayStreak || 0);
        
        const target = data.target || 300;
        const progress = ((data.questionsSolved || 0) / target) * 100;

        document.querySelector("#progressBar").style.width = progress + "%";
        document.querySelector("#progressText").innerText = Math.round(progress) + "%";
        
        if (data.goal) {
            document.querySelector("#userGoal").innerText = "🎯 Goal: " + data.goal;
            localStorage.setItem("goal", data.goal);
        }
    }
})
.catch((error) => console.log(error));

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

const hour = new Date().getHours();
let greeting = "";
const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
if (hour < 12) greeting = "Good Morning ☀️";
else if (hour < 17) greeting = "Good Afternoon 🌤️";
else greeting = "Good Evening 🌙";

document.querySelector("#greeting").innerText = greeting + ", " + formattedName + "!";

const goalCounter = document.querySelector("#goalCounter");
function updateGoalCounter() {
    let completed = 0;
    goals.forEach((goal) => {
        if (goal.checked) completed++;
    });

    if (completed === goals.length) {
        goalCounter.innerText = `${completed} / ${goals.length} Completed 🎉`;
    } else {
        goalCounter.innerText = `${completed} / ${goals.length} Completed`;
    }
    const today = new Date().getDay();
    const index = today === 0 ? 6 : today - 1;
    weeklyProgress[index] = completed;
    localStorage.setItem("weeklyProgress", JSON.stringify(weeklyProgress));
    
    if(typeof progressChart !== 'undefined') {
        progressChart.data.datasets[0].data = weeklyProgress;
        progressChart.update();
    }
}

const editName = document.querySelector("#editName");
const editGoal = document.querySelector("#editGoal");
const saveProfile = document.querySelector("#saveProfile");
const userGoal = document.querySelector("#userGoal");

const savedName = localStorage.getItem("name");
const savedUserGoal = localStorage.getItem("goal");

if (savedName) {
    document.querySelector("#userName").innerText = savedName;
    document.querySelector("#sidebarName").innerText = savedName;
    document.querySelector("#greeting").innerText = greeting + ", " + savedName + "!";
}
if (savedUserGoal) {
    userGoal.innerText = "🎯 Goal: " + savedUserGoal;
}

document.querySelector('[data-bs-target="#editProfileModal"]').addEventListener("click", () => {
    editName.value = document.querySelector("#userName").innerText;
    editGoal.value = userGoal.innerText.replace("🎯 Goal: ", "");
});

// Update Profile to MongoDB Backend
saveProfile.addEventListener("click", () => {
    const newName = editName.value.trim();
    const newGoal = editGoal.value.trim();

    fetch("http://localhost:3000/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: savedEmail, name: newName, goal: newGoal })
    })
    .then(res => res.json())
    .then(data => {
        if(data.success) {
            if (newName !== "") {
                document.querySelector("#userName").innerText = newName;
                document.querySelector("#sidebarName").innerText = newName;
                avatar.src = `https://ui-avatars.com/api/?name=${newName}&background=8b5cf6&color=fff&size=120`;
                document.querySelector("#greeting").innerText = greeting + ", " + newName + "!";
                localStorage.setItem("name", newName);
            }
            if (newGoal !== "") {
                userGoal.innerText = "🎯 Goal: " + newGoal;
                localStorage.setItem("goal", newGoal);
            }

            const modal = bootstrap.Modal.getInstance(document.querySelector("#editProfileModal"));
            modal.hide();
            const toast = new bootstrap.Toast(document.querySelector("#successToast"), { delay: 3000 });
            toast.show();
        }
    })
    .catch(err => alert("Error saving profile to database"));
});

const ctx = document.getElementById("progressChart");
let weeklyProgress = JSON.parse(localStorage.getItem("weeklyProgress")) || [2, 4, 3, 6, 5, 8, 7];
const progressChart = new Chart(ctx, {
    type: "line",
    data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{
            label: "Questions Solved",
            data: weeklyProgress,
            borderColor: "#8b5cf6",
            backgroundColor: "rgba(139,92,246,0.2)",
            borderWidth: 3,
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        plugins: { legend: { display: true } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
    }
});

updateGoalCounter();

const themeToggle = document.querySelector("#themeToggle");
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    themeToggle.innerText = "☀️";
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    if (document.body.classList.contains("light-mode")) {
        localStorage.setItem("theme", "light");
        themeToggle.innerText = "☀️";
    } else {
        localStorage.setItem("theme", "dark");
        themeToggle.innerText = "🌙";
    }
});

const resetBtn = document.querySelector("#resetProgress");
resetBtn.addEventListener("click", () => {
    const confirmReset = confirm("Are you sure you want to reset progress?");
    if (confirmReset) {
        goals.forEach((goal) => {
            goal.checked = false;
            localStorage.removeItem(goal.id);
        });
        weeklyProgress = [2, 4, 1, 3, 5, 2, 4];
        localStorage.setItem("weeklyProgress", JSON.stringify(weeklyProgress));
        progressChart.data.datasets[0].data = weeklyProgress;
        progressChart.update();
        updateGoalCounter();
        alert("Progress Reset Successfully!");
    }
});

// ==========================================
// LIVE GITHUB API INTEGRATION
// ==========================================
async function fetchLiveGitHubStats(githubUsername) {
    try {
        // Fetch data from GitHub's public API
        const response = await fetch(`https://api.github.com/users/${githubUsername}`);
        const data = await response.json();

        // If the user exists, update the dashboard UI
        if (data.public_repos !== undefined) {
            
            // Update the GitHub card to show actual Public Repos instead of hardcoded commits
            const githubCard = document.querySelector("#githubCommits");
            githubCard.innerText = "💻 " + data.public_repos;
            
            // Optional: Change the label below it so it makes sense
            githubCard.nextElementSibling.innerText = "Public Repositories";
        }
    } catch (error) {
        console.error("Failed to fetch GitHub stats:", error);
    }
}

// Replace 'your-github-username' with your actual GitHub handle!
// For example: fetchLiveGitHubStats("torvalds");
fetchLiveGitHubStats("bhavyagupta27");