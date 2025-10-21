// =========================================================================
// UNIVERSAL SCRIPT FOR PRANAV R'S PORTFOLIO
// This single file handles all interactivity for all pages.
// =========================================================================

/**
 * Toggles the visibility of the hamburger menu.
 */
function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    if (menu && icon) {
        menu.classList.toggle("open");
        icon.classList.toggle("open");
        const isOpen = menu.classList.contains("open");
        icon.setAttribute("aria-expanded", isOpen);
    }
}

/**
 * Toggles the website's theme between light and dark mode.
 */
function toggleTheme() {
    document.body.classList.toggle("dark-theme");
    const isDark = document.body.classList.contains("dark-theme");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateThemeIcons(isDark);

    // Also toggle syntax highlighting theme
    const lightTheme = document.getElementById('light-theme-highlight');
    const darkTheme = document.getElementById('dark-theme-highlight');
    if (lightTheme && darkTheme) [lightTheme.disabled, darkTheme.disabled] = [isDark, !isDark];
}

/**
 * Updates the theme toggle icons based on the current theme.
 * @param {boolean} isDark - True if the dark theme is active.
 */
function updateThemeIcons(isDark) {
    const themeIcon = isDark ? "🌙" : "🌞";
    document.querySelectorAll(".theme-toggle").forEach(toggle => {
        if (toggle) {
            toggle.textContent = themeIcon;
        }
    });
}

/**
 * [CORRECTED] Initializes a robust typing and deleting animation effect for a target element.
 */
function initTypingEffect() {
    const typingElement = document.querySelector(".section__text__p2 .typing");
    if (!typingElement) return; // Exit if the element doesn't exist

    const roles = ["STUDENT", "WEB DEVELOPER", "TECH ENTHUSIAST"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        // Set a dynamic timeout speed for the animation
        let typeSpeed = 200;
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            // Speed up when deleting
            typeSpeed = 100;
            // Remove a character
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;

            // When the word is fully deleted
            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length; // Move to the next role
                typeSpeed = 500; // Pause before typing the new word
            }

        } else {
            // Slow down when typing
            typeSpeed = 200;
            // Add a character
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;

            // When the word is fully typed
            if (charIndex === currentRole.length) {
                isDeleting = true;
                typeSpeed = 2000; // Long pause after the word is complete
            }
        }
        
        // Call the function again after the calculated delay
        setTimeout(type, typeSpeed);
    }

    // Start the animation
    type();
}

/**
 * Filters items in a grid based on a data attribute.
 * @param {string} containerSelector - The selector for the main section (e.g., '#certificate').
 * @param {string} filterValue - The value to filter by (e.g., 'completed', 'all').
 */
function filterItems(containerSelector, filterValue) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const items = container.querySelectorAll('[data-status]');
    const categoryTitles = container.querySelectorAll('.category-title');
    const countSpan = container.querySelector('.count-span');
    let visibleCount = 0;

    // Use a Set to track which categories have visible items
    const visibleCategories = new Set();

    items.forEach(item => {
        const status = item.dataset.status;
        const isVisible = filterValue === 'all' || status === filterValue;
        item.style.display = isVisible ? 'flex' : 'none';

        if (isVisible) {
            visibleCount++;
            // Add the category of the visible item to the set
            const category = item.closest('[data-category]')?.dataset.category;
            if (category) visibleCategories.add(category);
        }
    });

    // Show/hide category titles based on whether they have visible items
    categoryTitles.forEach(title => {
        title.style.display = visibleCategories.has(title.dataset.category) ? 'block' : 'none';
    });

    if (countSpan) countSpan.textContent = `(${visibleCount})`;
}

/**
 * Initializes all "copy to clipboard" buttons for code blocks.
 */
function initCopyCodeButtons() {
    const copyButtons = document.querySelectorAll('.copy-code-btn');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const pre = btn.previousElementSibling;
            const code = pre.querySelector('code');
            if (navigator.clipboard && code) {
                navigator.clipboard.writeText(code.innerText).then(() => {
                    btn.textContent = 'Copied!';
                    btn.classList.add('copied');
                    // Reset button text after 2 seconds
                    setTimeout(() => {
                        btn.textContent = 'Copy';
                        btn.classList.remove('copied');
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                    btn.textContent = 'Error';
                });
            }
        });
    });
}


// --- Main Script Execution ---
document.addEventListener("DOMContentLoaded", () => {
    // 1. INITIAL THEME SETUP
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
        document.body.classList.add("dark-theme");
    }
    updateThemeIcons(document.body.classList.contains("dark-theme"));

    // Set initial syntax highlighting theme
    const lightTheme = document.getElementById('light-theme-highlight');
    const darkTheme = document.getElementById('dark-theme-highlight');
    if (lightTheme && darkTheme) [lightTheme.disabled, darkTheme.disabled] = [document.body.classList.contains("dark-theme"), !document.body.classList.contains("dark-theme")];
    
    // 2. START TYPING ANIMATION
    if (document.querySelector(".section__text__p2 .typing")) initTypingEffect();

    // 3. CORE EVENT LISTENERS (FOR ALL PAGES)
    const hamburgerIcon = document.querySelector(".hamburger-icon");
    if (hamburgerIcon) {
        hamburgerIcon.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    // Add a listener to the menu itself to handle clicks on items
    const menuLinks = document.querySelector('.menu-links');
    if (menuLinks) {
        menuLinks.addEventListener('click', (e) => {
            // If a menu-item (like a link) is clicked, close the menu
            if (e.target.classList.contains('menu-item')) {
                toggleMenu();
            }
        });
    }

    // Close menu when clicking outside of it
    document.addEventListener('click', function(e) {
        const menu = document.querySelector(".menu-links");
        const icon = document.querySelector(".hamburger-icon");
        if (menu && icon && menu.classList.contains('open')) {
            // If the click is outside the menu and not on the hamburger icon
            if (!menu.contains(e.target) && !icon.contains(e.target)) {
                toggleMenu();
            }
        }
    });

    const themeToggleDesktop = document.getElementById('theme-toggle');
    if (themeToggleDesktop) {
        themeToggleDesktop.addEventListener('click', toggleTheme);
    }

    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', () => {
            toggleTheme();
        });
    }
    
    // Universal link handler for elements with [data-href]
    document.body.addEventListener('click', function(e) {
        const target = e.target.closest('[data-href]');
        if (target) {
            const href = target.dataset.href;
            if (href.startsWith('http') || href.startsWith('./assets')) {
                window.open(href, '_blank');
            } else if (href.startsWith('#')) {
                document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
                // Prevent default anchor behavior
                e.preventDefault();
            } else {
                window.location.href = href;
            }
        }
    });

    // Netlify Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const formStatus = document.getElementById('form-status');

            // Reset status on new submission
            formStatus.style.display = 'none';
            formStatus.className = '';
            formStatus.textContent = '';

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString(),
            }).then(() => {
                if (formStatus) {
                    formStatus.textContent = 'Message sent successfully! Thank you.';
                    formStatus.className = 'success';
                    formStatus.style.display = 'block';
                }
                this.reset(); // Clear the form fields
            }).catch(() => {
                if (formStatus) {
                    formStatus.textContent = 'An error occurred. Please try again.';
                    formStatus.className = 'error';
                    formStatus.style.display = 'block';
                }
            }).finally(() => {
                // Re-enable the button after a short delay
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                }, 2000); // Keep button disabled for 2s to prevent spam
            });
        });
    }

    // Dynamic Copyright Year
    const copyrightP = document.getElementById('copyright');
    if (copyrightP) {
        copyrightP.innerHTML = `Copyright © ${new Date().getFullYear()} <a href="#profile" class="no-underline">Pranav R</a> - All rights reserved.`;
    }

    // Fade-in sections on scroll
    const faders = document.querySelectorAll('.fade-in-section');
    const appearOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);
    faders.forEach(fader => appearOnScroll.observe(fader));

    // Animate progress bars on scroll
    const progressBars = document.querySelectorAll('.progress');
    const progressObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.8 }); // Trigger when 80% of the bar is visible

    progressBars.forEach(bar => progressObserver.observe(bar));


    // --- PAGE-SPECIFIC INITIALIZERS ---

    // Certificate Page Filter Logic
    const certificateFilter = document.getElementById('certificate-filter');
    if (certificateFilter) {
        certificateFilter.addEventListener('change', (e) => filterItems('#certificate', e.target.value));
        filterItems('#certificate', 'all');
    }

    // Project Page Filter Logic
    const projectFilter = document.getElementById('project-filter');
    if (projectFilter) {
        projectFilter.addEventListener('change', (e) => filterItems('#projects', e.target.value));
        filterItems('#projects', 'all'); // Initial call
    }

    // Blog Page Copy Code Button
    initCopyCodeButtons();

    // Initialize Syntax Highlighting if hljs is available
    if (typeof hljs !== 'undefined') {
        hljs.highlightAll();
    }
});