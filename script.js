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

    type(); // Start the animation
});



function startBounce(element, targetHref) {
    element.classList.add("bounce");
    setTimeout(() => {
      window.location.href = targetHref;
    }, 300); // Adjust delay if needed
}


