function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

function toggleTheme() {
    document.body.classList.toggle("dark-theme");
    const themeToggle = document.getElementById("theme-toggle");
    const themeToggleMobile = document.getElementById("theme-toggle-mobile");
    if (document.body.classList.contains("dark-theme")) {
        themeToggle.textContent = "🌙";
        themeToggleMobile.textContent = "🌙";
    } else {
        themeToggle.textContent = "🌞";
        themeToggleMobile.textContent = "🌞";
    }
    localStorage.setItem("theme", document.body.classList.contains("dark-theme") ? "dark" : "light");
}

// Check for saved theme preference and add event listeners
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
        document.getElementById("theme-toggle").textContent = "🌙";
        document.getElementById("theme-toggle-mobile").textContent = "🌙";
    }
    
    document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
    document.getElementById("theme-toggle-mobile").addEventListener("click", toggleTheme);
});


