const API_BASE = window.CODETRACK_API_URL || "http://localhost:3000";
const loginForm = document.querySelector("#loginForm");
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email=document.querySelector("#email").value.trim();
  const password=document.querySelector("#password").value;
  if(!email || !password){ alert("Please fill all fields!"); return; }
  try{
    const response=await fetch(`${API_BASE}/api/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});
    const data=await response.json();
    if(data.success){
      localStorage.setItem("email",data.user.email);
      localStorage.setItem("name",data.user.name);
      localStorage.setItem("goal",data.user.goal||"");
      alert(data.message);
      window.location.href="dashboard.html";
    }else alert(data.message||"Invalid Credentials");
  }catch(error){ console.error(error); alert("Server Error. Make sure the backend is running."); }
});
const passwordInput=document.querySelector("#password");
const togglePassword=document.querySelector("#togglePassword");
togglePassword.addEventListener("click",()=>{
  if(passwordInput.type==="password"){passwordInput.type="text";togglePassword.innerText="Hide Password";}
  else{passwordInput.type="password";togglePassword.innerText="Show Password";}
});