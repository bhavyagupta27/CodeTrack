const API_BASE = (typeof window.CODETRACK_API_URL !== "undefined") ? window.CODETRACK_API_URL : "http://localhost:3000";
const savedEmail=localStorage.getItem("email");
if(!savedEmail){window.location.href="login.html";}

const q=s=>document.querySelector(s);
const displayName=localStorage.getItem("name") || savedEmail.split("@")[0];
const avatar=q("#profileAvatar");
if(q("#userEmail")) q("#userEmail").innerText=savedEmail;
if(avatar) avatar.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=8b5cf6&color=fff&size=120`;
if(q("#userName")) q("#userName").innerText=displayName;
if(q("#sidebarName")) q("#sidebarName").innerText=displayName;
if(q("#sidebarEmail")) q("#sidebarEmail").innerText=savedEmail;

function logout(event){event.preventDefault();["email","name","goal"].forEach(k=>localStorage.removeItem(k));alert("Logged Out Successfully!");window.location.href="login.html";}
q("#logoutBtn")?.addEventListener("click",logout); q("#footerLogout")?.addEventListener("click",logout);

const hour=new Date().getHours();
const greeting=hour<12?"Good Morning ☀️":hour<17?"Good Afternoon 🌤️":"Good Evening 🌙";
if(q("#greeting")) q("#greeting").innerText=`${greeting}, ${displayName.charAt(0).toUpperCase()+displayName.slice(1)}!`;

function qAll(s){return document.querySelectorAll(s);}
let weeklyProgress=JSON.parse(localStorage.getItem("weeklyProgress"))||[0,0,0,0,0,0,0];
let dailyAims=JSON.parse(localStorage.getItem("dailyAims"))||[
  {text:"DSA Practice",completed:false},
  {text:"Backend Learning",completed:false},
  {text:"GSSoC",completed:false},
  {text:"Project Development",completed:false}
];

const goalsContainer=q("#goalsContainer");
const newGoalInput=q("#newGoalInput");
const addGoalBtn=q("#addGoalBtn");

function renderGoalsUI(){
  if(!goalsContainer) return;
  goalsContainer.innerHTML="";
  dailyAims.forEach((goal,index)=>{
    const row=document.createElement("div");
    row.className="form-check d-flex align-items-center justify-content-between mb-2";
    row.innerHTML=`
      <div>
        <input class="form-check-input aim-checkbox" type="checkbox" id="aim_${index}" ${goal.completed?"checked":""}>
        <label class="form-check-label" for="aim_${index}">${goal.text}</label>
      </div>
      <button class="btn btn-sm btn-outline-danger remove-aim" data-index="${index}">✕</button>
    `;
    goalsContainer.appendChild(row);
  });
  qAll(".aim-checkbox").forEach((box,index)=>{
    box.addEventListener("change",e=>{dailyAims[index].completed=e.target.checked;updateGoalCounter();});
  });
  qAll(".remove-aim").forEach(btn=>{
    btn.addEventListener("click",e=>{
      const idx=Number(e.target.dataset.index);
      dailyAims.splice(idx,1);
      renderGoalsUI();
      updateGoalCounter();
    });
  });
}

function updateGoalCounter(){
  let completed=0; dailyAims.forEach(g=>{if(g.completed)completed++;});
  const total=dailyAims.length;
  if(q("#goalCounter")) q("#goalCounter").innerText=`${completed} / ${total} Completed${total>0&&completed===total?" 🎉":""}`;
  const day=new Date().getDay(), index=day===0?6:day-1;
  weeklyProgress[index]=completed;
  localStorage.setItem("weeklyProgress",JSON.stringify(weeklyProgress));
  localStorage.setItem("dailyAims",JSON.stringify(dailyAims));
  if(window.progressChart){progressChart.data.datasets[0].data=weeklyProgress;progressChart.update();}
  syncProgress();
}

addGoalBtn?.addEventListener("click",()=>{
  const text=newGoalInput.value.trim();
  if(!text){alert("Please enter a daily target!");return;}
  dailyAims.push({text,completed:false});
  newGoalInput.value="";
  renderGoalsUI();
  updateGoalCounter();
});
newGoalInput?.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();addGoalBtn.click();}});

renderGoalsUI();

async function syncProgress(){
  try{
    const response=await fetch(`${API_BASE}/progress`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:savedEmail,goals:dailyAims,weeklyProgress})});
    const data=await response.json();
    if(data.rating && q("#globalRatingBadge")) q("#globalRatingBadge").innerText=`🌍 Global Rating: ${data.rating}`;
  }
  catch(e){console.warn("Progress sync skipped:",e.message);}
}

async function loadProfile(){
  try{
    const response=await fetch(`${API_BASE}/profile`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:savedEmail})});
    const data=await response.json();
    if(!response.ok) return;
    if(q("#questionsSolved")) q("#questionsSolved").innerText="📚 "+(data.questionsSolved||0);
    if(q("#githubCommits")) q("#githubCommits").innerText="💻 "+(data.githubCommits||0);
    if(q("#dayStreak")) q("#dayStreak").innerText="🔥 "+(data.dayStreak||0);
    const target=data.target||300, progress=Math.min(100,((data.questionsSolved||0)/target)*100);
    if(q("#progressBar")) q("#progressBar").style.width=progress+"%";
    if(q("#progressText")) q("#progressText").innerText=Math.round(progress)+"%";
    if(data.goal && q("#userGoal")){q("#userGoal").innerText="🎯 Goal: "+data.goal;localStorage.setItem("goal",data.goal);}
    if(Array.isArray(data.goals) && data.goals.length){
      dailyAims=data.goals.map(g=>({text:g.text||"Goal",completed:!!g.completed}));
      renderGoalsUI();
    }
    if(Array.isArray(data.weeklyProgress) && data.weeklyProgress.length===7){
      weeklyProgress=data.weeklyProgress;
      if(window.progressChart){progressChart.data.datasets[0].data=weeklyProgress;progressChart.update();}
    }
    if(data.rating && q("#globalRatingBadge")) q("#globalRatingBadge").innerText=`🌍 Global Rating: ${data.rating}`;
    updateGoalCounter();
  }catch(e){console.error("Profile fetch failed:",e);}
}
loadProfile();

const ctx=q("#progressChart");
if(ctx && window.Chart){
  window.progressChart=new Chart(ctx,{type:"line",data:{labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],datasets:[{label:"Questions Solved",data:weeklyProgress,borderColor:"#8b5cf6",backgroundColor:"rgba(139,92,246,.2)",borderWidth:3,fill:true,tension:.4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:true}},scales:{y:{beginAtZero:true,ticks:{stepSize:1}}}}});
}

const editName=q("#editName"),editGoal=q("#editGoal"),saveProfile=q("#saveProfile"),userGoal=q("#userGoal");
q('[data-bs-target="#editProfileModal"]')?.addEventListener("click",()=>{if(editName)editName.value=q("#userName").innerText;if(editGoal)editGoal.value=(userGoal?.innerText||"").replace("🎯 Goal: ","");});
saveProfile?.addEventListener("click",async()=>{
  const newName=editName.value.trim(),newGoal=editGoal.value.trim();
  try{
    const response=await fetch(`${API_BASE}/profile`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:savedEmail,name:newName,goal:newGoal})});
    const data=await response.json();
    if(!data.success){alert(data.message||"Could not update profile");return;}
    if(newName){q("#userName").innerText=newName;q("#sidebarName").innerText=newName;avatar.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(newName)}&background=8b5cf6&color=fff&size=120`;localStorage.setItem("name",newName);}
    if(newGoal){userGoal.innerText="🎯 Goal: "+newGoal;localStorage.setItem("goal",newGoal);}
    bootstrap.Modal.getInstance(q("#editProfileModal"))?.hide();new bootstrap.Toast(q("#successToast"),{delay:3000}).show();
  }catch(e){alert("Error saving profile.");}
});

q("#themeToggle")?.addEventListener("click",()=>{document.body.classList.toggle("light-mode");localStorage.setItem("theme",document.body.classList.contains("light-mode")?"light":"dark");q("#themeToggle").innerText=document.body.classList.contains("light-mode")?"☀️":"🌙";});
if(localStorage.getItem("theme")==="light"){document.body.classList.add("light-mode");if(q("#themeToggle"))q("#themeToggle").innerText="☀️";}

q("#resetProgress")?.addEventListener("click",()=>{
  if(!confirm("Are you sure you want to reset progress?"))return;
  dailyAims.forEach(g=>g.completed=false);
  weeklyProgress=[0,0,0,0,0,0,0];localStorage.setItem("weeklyProgress",JSON.stringify(weeklyProgress));
  if(window.progressChart){progressChart.data.datasets[0].data=weeklyProgress;progressChart.update();}
  renderGoalsUI(); updateGoalCounter(); alert("Progress Reset Successfully!");
});

updateGoalCounter();

// ---------- Profile Analyser: Codeforces / GitHub / LeetCode ----------
function analyserLoading(el){el.innerHTML=`<p class="text-secondary">Loading...</p>`;}
function analyserError(el,msg){el.innerHTML=`<p class="text-danger">${msg}</p>`;}

q("#cfBtn")?.addEventListener("click",async()=>{
  const handle=q("#cfHandleInput").value.trim();
  const el=q("#cfResult");
  if(!handle){alert("Please enter a Codeforces handle");return;}
  analyserLoading(el);
  try{
    const res=await fetch(`${API_BASE}/api/codeforces/${encodeURIComponent(handle)}`);
    const data=await res.json();
    if(!data.success){analyserError(el,data.message||"Handle not found");return;}
    el.innerHTML=`
      <div class="d-flex align-items-center gap-3">
        ${data.avatar?`<img src="${data.avatar}" width="60" height="60" class="rounded-circle">`:""}
        <div>
          <h5 class="mb-1">${data.handle}</h5>
          <p class="mb-0">Rating: <b>${data.rating}</b> (Max: ${data.maxRating})</p>
          <p class="mb-0">Rank: <b>${data.rank}</b> (Max: ${data.maxRank})</p>
        </div>
      </div>`;
  }catch(e){analyserError(el,"Failed to fetch Codeforces profile");}
});

q("#ghBtn")?.addEventListener("click",async()=>{
  const username=q("#ghUsernameInput").value.trim();
  const el=q("#ghResult");
  if(!username){alert("Please enter a GitHub username");return;}
  analyserLoading(el);
  try{
    const res=await fetch(`${API_BASE}/api/github/${encodeURIComponent(username)}`);
    const data=await res.json();
    if(!data.success){analyserError(el,data.message||"Username not found");return;}
    el.innerHTML=`<p class="mb-0">✅ <b>${username}</b> has <b>${data.publicRepos}</b> public repositories on GitHub.</p>`;
  }catch(e){analyserError(el,"Failed to fetch GitHub profile");}
});

q("#lcBtn")?.addEventListener("click",async()=>{
  const username=q("#lcUsernameInput").value.trim();
  const el=q("#lcResult");
  if(!username){alert("Please enter a LeetCode username");return;}
  analyserLoading(el);
  try{
    const res=await fetch(`${API_BASE}/api/leetcode/${encodeURIComponent(username)}`);
    const data=await res.json();
    if(data.status!=="success"){analyserError(el,data.message||"Username not found");return;}
    el.innerHTML=`<p class="mb-0">✅ <b>${username}</b> has solved <b>${data.totalSolved}</b> problems on LeetCode.</p>`;
  }catch(e){analyserError(el,"Failed to fetch LeetCode profile");}
});
