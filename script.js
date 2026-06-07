/* ==========================================================================
   PORTFOLIO INTERACTIVE LOGIC & EFFECTS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. LIGHT/DARK THEME CONFIGURATION (SYSTEM & MANUAL OVERRIDE)
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Determine default theme
    const savedTheme = localStorage.getItem('portfolio-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    function setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('portfolio-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('portfolio-theme', 'light');
        }
    }

    // Initialize theme based on preference or system
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme(prefersDark.matches ? 'dark' : 'light');
    }

    // Listen to changes in browser preference dynamically
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('portfolio-theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Toggle button handler
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }


    // 2. SKILLS INTERACTIVE ANALYZER LOGGER
    const skillPills = document.querySelectorAll('.skill-pill');
    const logBoxText = document.getElementById('analyzer-text-log');

    skillPills.forEach(pill => {
        const desc = pill.getAttribute('data-desc');
        const name = pill.querySelector('.skill-pill-name').textContent;

        pill.addEventListener('mouseenter', () => {
            if (logBoxText && desc) {
                logBoxText.innerHTML = `<strong>ANALYZING SECTION: ${name.toUpperCase()}</strong><br>${desc}`;
            }
        });

        pill.addEventListener('click', () => {
            if (logBoxText && desc) {
                logBoxText.innerHTML = `<strong>SECTOR SCAN CONFIRMED [${name.toUpperCase()}]:</strong><br>${desc}`;
            }
        });
    });


    // 3. FEATURED PROJECTS SORTING / FILTERING
    const filterTabs = document.querySelectorAll('.tab-filter');
    const projectCards = document.querySelectorAll('.project-card');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.getAttribute('data-filter');

            // Set active class on tab
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Apply card filters
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });


    // 4. MOBILE NAVIGATION DRAWER TOGGLE
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('hud-nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile drawer when clicking navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }


    // 5. SCROLLSPY (ACTIVE NAV LINK DETECTOR)
    const sections = document.querySelectorAll('section, main > div'); // matches elements to check offsets
    
    window.addEventListener('scroll', () => {
        let activeId = '';
        const scrollPos = window.scrollY + 150; // offset for nav header

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                activeId = id;
            }
        });

        if (activeId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${activeId}`) {
                    link.classList.add('active');
                }
            });
        }
    });


    // 6. CONTACT QUEST FORM VALIDATION & FEEDBACK
    const contactForm = document.getElementById('contact-form');
    const alertBox = document.getElementById('form-alert');

    if (contactForm && alertBox) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const subject = document.getElementById('contact-subject').value.trim();
            const message = document.getElementById('contact-message').value.trim();

            if (!name || !email || !subject || !message) {
                alertBox.className = 'form-alert-box error';
                alertBox.textContent = '>> ERROR: Key coordinates missing. Check all inputs.';
                return;
            }

            // Success feedback
            alertBox.className = 'form-alert-box success';
            alertBox.innerHTML = `>> QUEST PLACED SUCCESSFULLY! Coordinates received from <strong>${name}</strong>. Channel route established.`;

            // Reset inputs
            contactForm.reset();
        });
    }

});
