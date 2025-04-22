// MENU TOGGLE
function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");

    menu.classList.toggle("open");
    icon.classList.toggle("open");

    // Disable scrolling when menu is open (optional)
    document.body.style.overflow = menu.classList.contains("open") ? "hidden" : "";
}

// CLOSE MENU WHEN CLICKED OUTSIDE
document.addEventListener("click", function (e) {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");

    // If menu is open and click is outside both menu and icon
    if (
        menu.classList.contains("open") &&
        !menu.contains(e.target) &&
        !icon.contains(e.target)
    ) {
        menu.classList.remove("open");
        icon.classList.remove("open");
        document.body.style.overflow = "";
    }
});

// THEME TOGGLE
function toggleTheme() {
    document.body.classList.toggle("dark-theme");
    const isDark = document.body.classList.contains("dark-theme");

    const themeToggle = document.getElementById("theme-toggle");
    const themeToggleMobile = document.getElementById("theme-toggle-mobile");

    if (themeToggle) themeToggle.textContent = isDark ? "🌙" : "🌞";
    if (themeToggleMobile) themeToggleMobile.textContent = isDark ? "🌙" : "🌞";

    localStorage.setItem("theme", isDark ? "dark" : "light");
}

// ON LOAD: THEME SETUP, EVENT LISTENERS
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark";
    if (isDark) {
        document.body.classList.add("dark-theme");
    }

    const themeToggle = document.getElementById("theme-toggle");
    const themeToggleMobile = document.getElementById("theme-toggle-mobile");

    if (themeToggle) themeToggle.textContent = isDark ? "🌙" : "🌞";
    if (themeToggleMobile) themeToggleMobile.textContent = isDark ? "🌙" : "🌞";

    if (themeToggle) themeToggle.addEventListener("click", toggleTheme);
    if (themeToggleMobile) themeToggleMobile.addEventListener("click", toggleTheme);
});

// FADE-IN ON SCROLL
const faders = document.querySelectorAll('.fade-in-section');
const appearOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
    });
}, appearOptions);

faders.forEach(section => {
    appearOnScroll.observe(section);
});

// TYPING EFFECT
document.addEventListener("DOMContentLoaded", function () {
    const roles = ["STUDENT", "TECH ENTHUSIAST", "SOFTWARE EXPLORER"];
    let index = 0;
    let charIndex = 0;
    const typingElement = document.querySelector(".typing");

    function type() {
        if (charIndex < roles[index].length) {
            typingElement.textContent += roles[index].charAt(charIndex);
            charIndex++;
            setTimeout(type, 100);
        } else {
            setTimeout(erase, 2000);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typingElement.textContent = roles[index].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, 50);
        } else {
            index = (index + 1) % roles.length;
            setTimeout(type, 200);
        }
    }

    if (typingElement) type();
});

// BOUNCE LINK CLICK
function startBounce(element, targetHref) {
    element.classList.add("bounce");
    setTimeout(() => {
        window.location.href = targetHref;
    }, 300);
}
