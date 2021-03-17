const button = document.getElementById("loader");
const loading = document.querySelector(".loading-1");
const icon = document.querySelector(".fa-paper-plane");

button.addEventListener("click", () => {
    console.log("Hit")
    loading.style.opacity = "1";
    icon.style.display = "none";
})