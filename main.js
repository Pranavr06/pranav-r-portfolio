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
 * Sets the theme to 'light', 'dark', or 'system'.
 * @param {string} mode 
 */
function setTheme(mode) {
    localStorage.setItem("theme", mode);
    let isDark = false;

    if (mode === "system") {
        isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    } else {
        isDark = mode === "dark";
    }

    if (isDark) document.body.classList.add("dark-theme");
    else document.body.classList.remove("dark-theme");

    updateThemeIcons(mode);

    // Also toggle syntax highlighting theme
    const lightTheme = document.getElementById('light-theme-highlight');
    const darkTheme = document.getElementById('dark-theme-highlight');
    if (lightTheme && darkTheme) [lightTheme.disabled, darkTheme.disabled] = [isDark, !isDark];
}

/**
 * Toggles the website's theme between light, dark, and system mode.
 * @returns {string} The new theme mode.
 */
function toggleTheme() {
    const currentMode = localStorage.getItem("theme") || "system";
    let nextMode = "light";
    
    if (currentMode === "light") nextMode = "dark";
    else if (currentMode === "dark") nextMode = "system";
    
    setTheme(nextMode);
    return nextMode;
}

/**
 * Updates the theme toggle icons based on the current theme mode.
 * @param {string} mode - 'light', 'dark', or 'system'
 */
function updateThemeIcons(mode) {
    let icon, titleText;
    // Detect OS for shortcut text
    const isMac = typeof navigator !== 'undefined' && /Mac/i.test(navigator.userAgent);
    const shortcutKey = isMac ? "Cmd + Alt + L" : "Ctrl + Alt + L";

    if (mode === "light") {
        icon = "🌞";
        titleText = "Switch to Dark Mode";
    } else if (mode === "dark") {
        icon = "🌙";
        titleText = "Switch to System Theme";
    } else {
        icon = "🌓";
        titleText = "Switch to Light Mode";
    }

    const themeTitle = `${titleText} (${shortcutKey})`;
    document.querySelectorAll(".theme-toggle").forEach(toggle => {
        if (toggle) {
            toggle.textContent = icon;
            toggle.setAttribute("data-tooltip", themeTitle);
            toggle.removeAttribute("title");
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

        if (isVisible) {
            if (item.classList.contains('scale-out-hidden') || item.classList.contains('hidden')) {
                item.classList.remove('hidden');
                void item.offsetWidth; // Force reflow
                item.classList.remove('scale-out-hidden');
            }

            visibleCount++;
            // Add the category of the visible item to the set
            const category = item.closest('[data-category]')?.dataset.category;
            if (category) visibleCategories.add(category);
        } else {
            item.classList.add('scale-out-hidden');
            setTimeout(() => {
                if (item.classList.contains('scale-out-hidden')) {
                    item.classList.add('hidden');
                }
            }, 500); // Matches CSS transition duration
        }
    });

    // Show/hide category titles based on whether they have visible items
    categoryTitles.forEach(title => {
        visibleCategories.has(title.dataset.category) ? title.classList.remove('hidden') : title.classList.add('hidden');
    });

    if (countSpan) countSpan.textContent = `(${visibleCount})`;
}

/**
 * Filters and sorts blog posts based on a filter value.
 * @param {string} filterValue - The value to filter/sort by ('latest', 'popular', 'old', 'all').
 */
function filterBlogPosts(filterValue) {
    const container = document.querySelector('.blog-grid-container');
    if (!container) return;

    const allItems = Array.from(container.children);
    let itemsToShow;

    // 1. Determine which items to show based on filter
    if (filterValue === 'popular') {
        itemsToShow = allItems.filter(item => item.dataset.popular === 'true');
    } else {
        itemsToShow = allItems; // For 'all', 'latest', 'old', we start with all items
    }

    // 2. Sort the items that will be shown
    if (filterValue === 'latest' || filterValue === 'all' || filterValue === 'popular') {
        itemsToShow.sort((a, b) => new Date(b.dataset.date) - new Date(a.dataset.date));
    } else if (filterValue === 'old') {
        itemsToShow.sort((a, b) => new Date(a.dataset.date) - new Date(b.dataset.date));
    }
    
    // 3. Animate and update display for all items
    allItems.forEach(item => {
        const shouldShow = itemsToShow.includes(item);
        if (shouldShow) {
            if (item.classList.contains('scale-out-hidden') || item.classList.contains('hidden')) {
                item.classList.remove('hidden');
                void item.offsetWidth;
                item.classList.remove('scale-out-hidden');
            }
        } else {
            item.classList.add('scale-out-hidden');
            setTimeout(() => {
                if (item.classList.contains('scale-out-hidden')) item.classList.add('hidden');
            }, 500);
        }
    });

    // 4. Re-order the DOM elements
    setTimeout(() => itemsToShow.forEach(item => container.appendChild(item)), 100);
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

/**
 * Displays a toast notification with a message.
 * @param {string} message - The message to display.
 */
function showToast(message) {
    let toast = document.querySelector('.toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.classList.add('show');
    
    // Clear previous timeout if exists to handle rapid clicks
    if (toast.timeoutId) clearTimeout(toast.timeoutId);
    
    toast.timeoutId = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/**
 * Initializes the "More options" menus for certificates.
 */
function initMenus() {
    document.addEventListener('click', (e) => {
        const menuBtn = e.target.closest('.menu-btn');
        const copyBtn = e.target.closest('.btn-copy-link');
        const shareBtn = e.target.closest('.btn-share');
        const downloadBtn = e.target.closest('.btn-download-pdf');
        
        // Close all open menus if click is outside
        if (!menuBtn && !e.target.closest('.options-menu')) {
            document.querySelectorAll('.options-menu.open').forEach(menu => menu.classList.remove('open'));
            return;
        }

        if (menuBtn) {
            e.stopPropagation();
            const menu = menuBtn.nextElementSibling;
            // Close others
            document.querySelectorAll('.options-menu.open').forEach(m => {
                if (m !== menu) m.classList.remove('open');
            });
            menu.classList.toggle('open');
        }

        if (copyBtn || shareBtn) {
            const card = (copyBtn || shareBtn).closest('.details-container, .testimonial-card, .blog-card');
            
            let urlToShare;
            const origin = window.location.origin;

            if (card) {
                // Case 1: It's a blog card on a summary page with a direct link.
                const blogLink = card.querySelector('a.blog-link');
                if (blogLink) {
                    urlToShare = blogLink.href;
                } else if (card.id) {
                    // Case 2: It's a shareable item (certificate, project, testimonial). Generate a hash link.
                    let pageName = '';
                    if (card.closest('#certificate')) pageName = 'certificate.html';
                    else if (card.closest('#projects')) pageName = 'projects.html';
                    else if (card.closest('#testimonials')) pageName = 'testimonials.html';

                    if (pageName) {
                        urlToShare = `${origin}/${pageName}#${card.id}`;
                    } else {
                        urlToShare = `${window.location.href.split('#')[0]}#${card.id}`;
                    }
                } else {
                    // Fallback for cards without an ID or a clear link structure.
                    urlToShare = window.location.href.split('#')[0];
                }
            } else {
                // Fallback for page-level menus (like on individual blog post pages)
                urlToShare = window.location.href.split('#')[0];
            }

            // Handle the specific button action
            if (copyBtn) {
                navigator.clipboard.writeText(urlToShare).then(() => {
                    showToast('Link copied');
                });
                copyBtn.closest('.options-menu').classList.remove('open');
            }

            if (shareBtn) {
                let title = document.title;
                let text = `Check out this page from Pranav R's portfolio: ${document.title}`;

                if (card) { // Only try to get specific text if we're in a card
                    if (card.classList.contains('testimonial-card')) {
                        const authorEl = card.querySelector('.author-info h3');
                        if (authorEl) {
                            title = `Testimonial for Pranav R`;
                            text = `Check out this testimonial for Pranav R from ${authorEl.textContent}!`;
                        }
                    } else if (card.classList.contains('blog-card')) {
                        const titleEl = card.querySelector('.blog-title');
                        if (titleEl) {
                            title = titleEl.textContent;
                            text = `Check out the blog post "${title}" on Pranav R's portfolio.`;
                        }
                    } else { // .details-container
                        const titleEl = card.querySelector('.project-title');
                        if (titleEl) {
                            title = titleEl.textContent;
                            if (card.closest('#projects')) {
                                text = `Check out the project "${title}" on Pranav R's portfolio.`;
                            } else { // Assumes #certificate
                                text = `Check out the achievement "${title}" on Pranav R's portfolio.`;
                            }
                        }
                    }
                }

                if (navigator.share) {
                    navigator.share({ title, text, url: urlToShare }).catch(err => console.error("Share failed:", err));
                } else {
                    navigator.clipboard.writeText(urlToShare).then(() => showToast('Link copied as fallback'));
                }
                shareBtn.closest('.options-menu').classList.remove('open');
            }
            return; // Prevent download logic from running if copy/share was handled
        }

        if (downloadBtn) {
            const card = downloadBtn.closest('.details-container');
            if (card) {
                const viewLink = card.querySelector('.btn-container a');
                const href = viewLink ? viewLink.getAttribute('href') : null;
                
                if (href && href !== '#' && href !== '') {
                    const link = document.createElement('a');
                    link.href = viewLink.href; // Use absolute URL for download
                    link.setAttribute('download', ''); // Let browser handle filename
                    link.className = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else {
                    showToast('Certificate not available');
                }
            }
            downloadBtn.closest('.options-menu').classList.remove('open');
        }
    });
}


// --- Main Script Execution ---
document.addEventListener("DOMContentLoaded", () => {
    // 1. INITIAL THEME SETUP
    const savedTheme = localStorage.getItem("theme") || "system";
    setTheme(savedTheme);

    // Listener for system theme changes
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener('change', () => {
        if (localStorage.getItem("theme") === "system") {
            setTheme("system");
        }
    });
    
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
            formStatus.className = '';
            formStatus.textContent = '';
            formStatus.classList.add('hidden');

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
                    formStatus.classList.remove('hidden');
                }
                this.reset(); // Clear the form fields
            }).catch(() => {
                if (formStatus) {
                    formStatus.textContent = 'An error occurred. Please try again.';
                    formStatus.className = 'error';
                    formStatus.classList.remove('hidden');
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
        copyrightP.innerHTML = `Copyright © ${new Date().getFullYear()} <a href="/" class="no-underline" aria-label="Go to Pranav R's homepage">Pranav R</a> - All rights reserved.`;
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

    // Testimonial Page Filter Logic
    const testimonialFilter = document.getElementById('testimonial-filter');
    if (testimonialFilter) {
        testimonialFilter.addEventListener('change', (e) => filterItems('#testimonials', e.target.value));
    }

    // Blog Page Filter & Sort Logic
    const blogFilter = document.getElementById('blog-filter');
    if (blogFilter) {
        blogFilter.addEventListener('change', (e) => filterBlogPosts(e.target.value));
        filterBlogPosts('latest'); // Initial sort on page load
    }

    // Initialize menus if they exist on the page
    if (document.querySelector('.menu-container')) {
        initMenus();
    }

    // Blog Page Copy Code Button
    initCopyCodeButtons();

    // Initialize Syntax Highlighting if hljs is available
    if (typeof hljs !== 'undefined') {
        hljs.highlightAll();
    }

    // Global Keyboard Shortcut for Theme Toggle
    document.addEventListener('keydown', (e) => {
        // Ignore if typing in an input, textarea, or contenteditable element
        if (e.target.matches && e.target.matches('input, textarea, [contenteditable]')) return;

        // Check for Ctrl+Alt+L (Windows/Linux) or Cmd+Alt+L (macOS)
        if ((e.ctrlKey || e.metaKey) && e.altKey && e.code === 'KeyL') {
            e.preventDefault();
            const newMode = toggleTheme();
            const displayMode = newMode.charAt(0).toUpperCase() + newMode.slice(1);
            showToast(`Theme switched to ${displayMode}`);
        }
    });
});