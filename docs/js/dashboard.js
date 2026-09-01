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
                            max: 4 
                        } 
                    }
                }
            });
        }
    }

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

                if (userData.goals && userData.goals.length === 4) {
                    document.querySelector("#goal1").checked = userData.goals[0];
                    document.querySelector("#goal2").checked = userData.goals[1];
                    document.querySelector("#goal3").checked = userData.goals[2];
                    document.querySelector("#goal4").checked = userData.goals[3];
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
            if (box && box.checked) completed++;
            if (box) currentGoals.push(box.checked);
        });

        if (goalCounter) {
            goalCounter.innerText = `${completed} / 4 Completed${completed === 4 ? ' 🎉' : ''}`;
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
                    goals: currentGoals,
                    weeklyProgress: weeklyProgressData
                })
            }).catch(err => console.log("Failed to sync progress:", err));
        }
    }

    checkboxes.forEach(box => {
        if (box) box.addEventListener("change", () => updateGoalCounter(true));
    });

    const resetBtn = document.querySelector("#resetProgress");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            checkboxes.forEach(box => { if (box) box.checked = false; });
            updateGoalCounter(true);
        });
    }

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
    const githubUser = userData.githubUsername || "bhavyagupta27"; // Fallback
    avatarImg.src = `https://github.com/${githubUser}.png`;
}

    loadUserData();
});