document.addEventListener("DOMContentLoaded", async () => {
    const userEmail = localStorage.getItem("loggedInUserEmail") || localStorage.getItem("email");
    const userName = localStorage.getItem("name") || "Bhavya Gupta";

    if (!userEmail) {
        window.location.href = "login.html";
        return;
    }

    const firstName = userName.split(" ")[0];
    if (document.querySelector("#userName")) document.querySelector("#userName").innerText = userName;
    if (document.querySelector("#userEmail")) document.querySelector("#userEmail").innerText = userEmail;
    if (document.querySelector("#sidebarName")) document.querySelector("#sidebarName").innerText = userName;
    if (document.querySelector("#sidebarEmail")) document.querySelector("#sidebarEmail").innerText = userEmail;
    if (document.querySelector("#greeting")) document.querySelector("#greeting").innerText = `Welcome Back, ${firstName}! 🚀`;

    let progressChart;
    let weeklyProgressData = [0, 0, 0, 0, 0, 0, 0];

    // Theme Toggle Functionality
    const themeToggleBtn = document.querySelector("#themeToggle");
    if (themeToggleBtn) {
        if (localStorage.getItem("theme") === "light") {
            document.body.classList.add("light-mode");
            themeToggleBtn.innerText = "☀️";
        } else {
            themeToggleBtn.innerText = "🌙";
        }

        themeToggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");
            const isLight = document.body.classList.contains("light-mode");
            themeToggleBtn.innerText = isLight ? "☀️" : "🌙";
            localStorage.setItem("theme", isLight ? "light" : "dark");
        });
    }

    // Unified Goals List & DOM Elements
    let customGoalsList = [
        { text: "DSA Practice", completed: false },
        { text: "Backend Learning", completed: false },
        { text: "GSSoC", completed: false },
        { text: "Project Development", completed: false }
    ];

    const goalsContainer = document.querySelector("#goalsContainer");
    const newGoalInput = document.querySelector("#newGoalInput");
    const addGoalBtn = document.querySelector("#addGoalBtn");
    const goalCounter = document.querySelector("#goalCounter");

    function renderChart() {
        const canvasElement = document.getElementById("progressChart");
        if (!canvasElement) return;
        const ctx = canvasElement.getContext("2d");
        
        if (progressChart) {
            progressChart.data.datasets[0].data = weeklyProgressData;
            progressChart.update();
        } else {
            progressChart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    datasets: [{
                        label: "Goals Completed",
                        data: weeklyProgressData,
                        borderColor: "#6c5ce7",
                        backgroundColor: "rgba(108, 92, 231, 0.2)",
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
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
                            max: 10 
                        } 
                    }
                }
            });
        }
    }

    function renderGoalsUI() {
        if (!goalsContainer) return;
        goalsContainer.innerHTML = "";
        
        customGoalsList.forEach((goal, index) => {
            const goalDiv = document.createElement("div");
            goalDiv.className = "form-check mb-2";
            goalDiv.innerHTML = `
                <input class="form-check-input goal-checkbox" type="checkbox" id="customGoal_${index}" ${goal.completed ? 'checked' : ''}>
                <label class="form-check-label" for="customGoal_${index}">${goal.text}</label>
            `;
            goalsContainer.appendChild(goalDiv);
        });

        document.querySelectorAll(".goal-checkbox").forEach((box, index) => {
            box.addEventListener("change", (e) => {
                customGoalsList[index].completed = e.target.checked;
                updateGoalCounter(true);
            });
        });
    }

    function updateGoalCounter(syncToBackend = true) {
        let completed = 0;
        let currentGoalsStatus = [];

        customGoalsList.forEach((goal) => {
            if (goal.completed) completed++;
            currentGoalsStatus.push(goal.completed);
        });

        const totalGoals = customGoalsList.length;
        if (goalCounter) {
            goalCounter.innerText = `${completed} / ${totalGoals} Completed${completed === totalGoals && totalGoals > 0 ? ' 🎉' : ''}`;
        }

        if (syncToBackend) {
            let today = new Date().getDay();
            let index = today === 0 ? 6 : today - 1; 
            weeklyProgressData[index] = completed;
            renderChart();

            fetch("https://codetrack-pyrc.onrender.com/progress", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    email: userEmail, 
                    goals: currentGoalsStatus,
                    weeklyProgress: weeklyProgressData
                })
            }).catch(err => console.log("Failed to sync progress:", err));
        }
    }

    if (addGoalBtn) {
        addGoalBtn.addEventListener("click", () => {
            const goalText = newGoalInput.value.trim();
            if (!goalText) {
                alert("Please enter a goal!");
                return;
            }

            customGoalsList.push({ text: goalText, completed: false });
            newGoalInput.value = "";
            renderGoalsUI();
            updateGoalCounter(true);
        });
    }

    const resetBtn = document.querySelector("#resetProgress");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            customGoalsList.forEach(goal => goal.completed = false);
            renderGoalsUI();
            updateGoalCounter(true);
        });
    }

    renderGoalsUI();
    renderChart();

    async function loadUserData() {
        try {
            const response = await fetch(`https://codetrack-pyrc.onrender.com/user-profile?email=${userEmail}`);
            const data = await response.json();

            if (response.ok && data.success) {
                const userData = data.user;
                const solved = userData.leetcodeSolved || userData.questionsSolved || 0;
                const target = userData.target || 300;
                
                document.querySelector("#questionsSolved").innerText = solved;
                document.querySelector("#githubCommits").innerText = userData.githubCommits || 0;
                document.querySelector("#dayStreak").innerText = (userData.streak || userData.dayStreak || 0) + " Days";
                document.querySelector("#userGoal").innerText = "🎯 Goal: " + (userData.goal || "Crack Product-Based Company");

                const progressPercent = Math.min((solved / target) * 100, 100).toFixed(0);
                document.querySelector("#progressBar").style.width = progressPercent + "%";
                document.querySelector("#progressText").innerText = progressPercent + "%";

                if (userData.goals && Array.isArray(userData.goals) && userData.goals.length === customGoalsList.length) {
                    userData.goals.forEach((status, idx) => {
                        if (customGoalsList[idx]) customGoalsList[idx].completed = status;
                    });
                    renderGoalsUI();
                }

                if (userData.weeklyProgress && userData.weeklyProgress.length === 7) {
                    weeklyProgressData = userData.weeklyProgress;
                }
                
                renderChart();
                updateGoalCounter(false);
            }
        } catch (error) {
            console.error("Failed to load user data:", error);
            renderChart();
        }
    }

    loadUserData();

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "login.html";
    };
    if (document.querySelector("#logoutBtn")) document.querySelector("#logoutBtn").addEventListener("click", handleLogout);
    if (document.querySelector("#footerLogout")) {
        document.querySelector("#footerLogout").addEventListener("click", (e) => {
            e.preventDefault();
            handleLogout();
        });
    }

    const editProfileBtn = document.querySelector("#editProfileBtn");
    if (editProfileBtn) {
        editProfileBtn.addEventListener("click", () => {
            document.querySelector("#editName").value = document.querySelector("#userName").innerText;
            document.querySelector("#editGoal").value = document.querySelector("#userGoal").innerText.replace("🎯 Goal: ", "");
        });
    }

    const saveProfileBtn = document.querySelector("#saveProfile");
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener("click", () => {
            const newName = document.querySelector("#editName").value;
            const newGoal = document.querySelector("#editGoal").value;

            if (!newName || !newGoal) {
                alert("Please fill out both fields!");
                return;
            }

            fetch("https://codetrack-pyrc.onrender.com/update-profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail, name: newName, goal: newGoal })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("Profile updated successfully! 🎉");
                    location.reload();
                } else {
                    alert(data.message || "Update failed!");
                }
            })
            .catch(err => console.error("Error:", err));
        });
    }

    const avatarImg = document.querySelector("#profileAvatar");
    if (avatarImg) {
        avatarImg.src = `https://github.com/bhavyagupta27.png`;
    }
});