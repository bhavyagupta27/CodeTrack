const counters = document.querySelectorAll(".counter");
counters.forEach((counter)=>{
    const target =+ counter.dataset.target;
    let count =0;
    const increment = target / 100;
    function updateCounter(){
        count += increment;
        counter.innerText = Math.min(Math.ceil(count), target);
        
    if(count < target){

        setTimeout(updateCounter,20);
    }
}
updateCounter();
})

const navbar = document.querySelector("#navbar");
window.addEventListener("scroll",()=>{
    if(window.scrollY > 50){
        navbar.classList.add("scrolled");
  } else{
        navbar.classList.remove("scrolled");
    }
});

const welcomeUser = document.querySelector("#welcomeUser");

const savedEmail = localStorage.getItem("email");

if(!savedEmail){

    window.location.href = "login.html";

}
else{

    welcomeUser.innerText = `Welcome, ${savedEmail}`;

}
const logoutBtn = document.querySelector("#logoutBtn");

if(savedEmail){

    welcomeUser.innerText = `Welcome, ${savedEmail}`;

    logoutBtn.style.display = "inline-block";

}
else{

    logoutBtn.style.display = "none";

}
logoutBtn.addEventListener("click",()=>{

    localStorage.removeItem("email");

    window.location.href = "login.html";

});