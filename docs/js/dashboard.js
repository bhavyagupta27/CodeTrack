// 1. Check if user is actually logged in
const savedEmail = localStorage.getItem("email");
const savedName = localStorage.getItem("name");

if (!savedEmail) {
    window.location.href = "login.html";
}

// 2. Update basic UI elements
document.querySelector("#userName").innerText = savedName;
document.querySelector("#userEmail").innerText = savedEmail;
document.querySelector("#sidebarName").innerText = savedName;
document.querySelector("#sidebarEmail").innerText = savedEmail;
document.querySelector("#greeting").innerText = `Welcome Back, ${savedName.split(" ")[0]}! 🚀`;

// Initialize Chart.js Variables
let progressChart;
let weeklyProgressData = [0, 0, 0, 0, 0, 0, 0];

// Function to render/update Chart
function renderChart() {
    const ctx = document.getElementById("progressChart").getContext("2d");
    
    if (progressChart) {
        progressChart.data.datasets[0].data = weeklyProgressData;
        progressChart.update();
    } else {
        progressChart = new Chart(ctx, {
            type: "line", // Changed back to line!
            data: {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [{
                    label: "Goals Completed",
                    data: weeklyProgressData,
                    borderColor: "#6c5ce7", // Your theme color
                    backgroundColor: "rgba(108, 92, 231, 0.2)", // Subtle fill under the line
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4, // Adds a smooth curve to the line
                    pointBackgroundColor: "#6c5ce7",
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { 
                    y: { 
                        beginAtZero: true, 
                        max: 4 // Maximum 4 daily goals
                    } 
                }
            }
        });
    }
}    

// 3. Fetch Full Profile Data from MongoDB
async function loadUserData() {
    try {
        const response = await fetch("http://localhost:3000/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: savedEmail })
        });
        
        const userData = await response.json();

        if (userData) {
            // Populate stats
            const solved = userData.questionsSolved || 0;
            const target = userData.target || 300; // Default target
            
            document.querySelector("#questionsSolved").innerText = solved;
            document.querySelector("#githubCommits").innerText = userData.githubCommits || 0;
            document.querySelector("#dayStreak").innerText = userData.dayStreak || 0;
            document.querySelector("#userGoal").innerText = "🎯 Goal: " + (userData.goal || "Full Stack Developer");

            // Populate Placement Readiness Progress Bar
            const progressPercent = Math.min((solved / target) * 100, 100).toFixed(0);
            document.querySelector("#progressBar").style.width = progressPercent + "%";
            document.querySelector("#progressText").innerText = progressPercent + "%";

            // Populate checkboxes
            if (userData.goals && userData.goals.length === 4) {
                document.querySelector("#goal1").checked = userData.goals[0];
                document.querySelector("#goal2").checked = userData.goals[1];
                document.querySelector("#goal3").checked = userData.goals[2];
                document.querySelector("#goal4").checked = userData.goals[3];
            }

            // Populate Chart Data
            if (userData.weeklyProgress) {
                weeklyProgressData = userData.weeklyProgress;
            }
            
            // Render the graph and update text
            renderChart();
            updateGoalCounter(false); // Updates text without syncing to DB on initial load
        }
    } catch (error) {
        console.error("Failed to load user data:", error);
    }
}

// 4. Handle Checkbox Logic & Syncing
const checkboxes = [
    document.querySelector("#goal1"),
    document.querySelector("#goal2"),
    document.querySelector("#goal3"),
    document.querySelector("#goal4")
];
const goalCounter = document.querySelector("#goalCounter");

function updateGoalCounter(syncToBackend = true) {
    let completed = 0;
    let currentGoals = [];

    checkboxes.forEach((box) => {
        if (box.checked) completed++;
        currentGoals.push(box.checked);
    });

    goalCounter.innerText = `${completed} / 4 Completed${completed === 4 ? ' 🎉' : ''}`;

    if (syncToBackend) {
        // Update today's chart data (Mapping JS days to array index: Mon=0, Sun=6)
        let today = new Date().getDay();
        let index = today === 0 ? 6 : today - 1; 
        weeklyProgressData[index] = completed;
        renderChart();

        // Sync progress to MongoDB
        fetch("http://localhost:3000/progress", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                email: savedEmail, 
                goals: currentGoals,
                weeklyProgress: weeklyProgressData
            })
        }).catch(err => console.log("Failed to sync progress:", err));
    }
}

// Add event listeners to all checkboxes
checkboxes.forEach(box => {
    box.addEventListener("change", () => updateGoalCounter(true));
});

// 5. Reset Goals Button Logic
document.querySelector("#resetProgress").addEventListener("click", () => {
    // Uncheck all boxes
    checkboxes.forEach(box => box.checked = false);
    // Update the counter, the chart, and sync to MongoDB
    updateGoalCounter(true);
});

// 6. Secure Logout Logic
document.querySelector("#logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
});

document.querySelector("#footerLogout").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = "login.html";
});

// Initialize dashboard on load
loadUserData();

// 7. Edit Profile Logic
document.querySelector("#saveProfile").addEventListener("click", () => {
    const newName = document.querySelector("#editName").value;
    const newGoal = document.querySelector("#editGoal").value;

    if (!newName || !newGoal) {
        alert("Please fill out both fields!");
        return;
    }

    // Send updated data to MongoDB
    fetch("http://localhost:3000/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            email: savedEmail, 
            name: newName, 
            goal: newGoal 
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update browser memory and UI
            localStorage.setItem("name", newName);
            document.querySelector("#userName").innerText = newName;
            document.querySelector("#sidebarName").innerText = newName;
            document.querySelector("#userGoal").innerText = "🎯 Goal: " + newGoal;
            document.querySelector("#greeting").innerText = `Welcome Back, ${newName.split(" ")[0]}! 🚀`;
            
            // Close the Bootstrap Modal
            const modalElement = document.querySelector("#editProfileModal");
            const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modalInstance.hide();

            // Show the success toast notification
            const toastElement = document.querySelector("#successToast");
            const toastInstance = new bootstrap.Toast(toastElement);
            toastInstance.show();
        }
    })
    .catch(err => console.log("Failed to update profile:", err));
});

// Pre-fill the modal inputs when it opens
document.querySelector("#editProfileBtn").addEventListener("click", () => {
    document.querySelector("#editName").value = document.querySelector("#userName").innerText;
    document.querySelector("#editGoal").value = document.querySelector("#userGoal").innerText.replace("🎯 Goal: ", "");
});

// 8. Live LeetCode Stats Integration (Via Our Own Backend)
async function fetchLeetCodeStats(leetcodeUsername) {
    try {
        // Ab hum direct LeetCode ki jagah apne backend ko bula rahe hain
        const response = await fetch(`http://localhost:3000/api/leetcode/${leetcodeUsername}`);
        const data = await response.json();

        if (data && data.status === "success") {
            const solved = data.totalSolved;
            document.querySelector("#questionsSolved").innerText = solved;
            
            // Re-calculate the progress bar
            const target = 300; 
            const progressPercent = Math.min((solved / target) * 100, 100).toFixed(0);
            
            document.querySelector("#progressBar").style.width = progressPercent + "%";
            document.querySelector("#progressText").innerText = progressPercent + "%";
            
            console.log("✅ LeetCode Stats Loaded successfully from backend!");
        } else {
            console.log("❌ Could not fetch data. Check username.");
        }
    } catch (error) {
        console.error("Failed to fetch LeetCode stats:", error);
    }
}

// Your actual LeetCode username
fetchLeetCodeStats("Bhavya_2_7_");

// 9. Live GitHub Stats Integration
async function fetchGitHubStats(githubUsername) {
    try {
        const response = await fetch(`http://localhost:3000/api/github/${githubUsername}`);
        const data = await response.json();

        if (data.success) {
            // Update GitHub Commits Card
            document.querySelector("#githubCommits").innerText = data.recentCommits;
            
            // For Day Streak, we can compute a realistic streak or base it on progress
            // Let's set a dynamic streak or pull it from stored consistency
            document.querySelector("#dayStreak").innerText = "15 Days"; // You can make this dynamic later!
            
            console.log("✅ GitHub Stats Loaded successfully!");
        }
    } catch (error) {
        console.error("Failed to fetch GitHub stats:", error);
    }
}

// 10. Dynamic Profile Avatar Loader
function loadProfileAvatar(githubUsername) {
    const avatarImg = document.querySelector("#profileAvatar");
    
    if (githubUsername) {
        // Automatically fetch high-res profile picture from GitHub
        avatarImg.src = `https://github.com/${githubUsername}.png`;
    } else {
        // Fallback default avatar if username is not provided
        avatarImg.src = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg";
    }
}

// Apna GitHub username yahan daal dein (wahi jo upar GitHub stats ke liye dala tha)
fetchGitHubStats("bhavyagupta27");
loadProfileAvatar("bhavyagupta27"); // Yahan apna real GitHub username likh lena