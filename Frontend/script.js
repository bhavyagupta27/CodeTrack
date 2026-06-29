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
}
});

const startBtn = document.querySelector("#startBtn");
const dashboard = document.querySelector("#dashboard");
startBtn.addEventListener("click",()=>{
    dashboard.scrollIntoView({
    behavior:"smooth"
});
});