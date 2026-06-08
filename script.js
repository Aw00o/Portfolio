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
                const category = card.getAttribute('data-category') || '';
                const categories = category.split(' ');

                if (filter === 'all' || categories.includes(filter)) {
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

    // 3. PROJECT VIDEO PLAY ON HOVER / FOCUS
    const projectVideos = document.querySelectorAll('.project-video-preview');

    projectVideos.forEach(video => {
        // Autoplay on hover
        video.addEventListener('mouseenter', () => {
            video.play().catch(err => console.log("Video play interrupted:", err));
        });

        video.addEventListener('mouseleave', () => {
            video.pause();
        });

        // Autoplay on focus (mobile/keyboard navigation)
        video.addEventListener('focus', () => {
            video.play().catch(err => console.log("Video play interrupted:", err));
        });

        video.addEventListener('blur', () => {
            video.pause();
        });

        // Toggle play/pause on tap for touch devices
        video.addEventListener('click', () => {
            if (video.paused) {
                video.play().catch(err => console.log("Video play interrupted:", err));
            } else {
                video.pause();
            }
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

    // 7. PROJECT MEDIA PREVIEW MODAL INTERACTIVITY
    const projectCardsList = document.querySelectorAll('.project-card');
    const modal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    const modalVideo = document.getElementById('modal-video');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalTags = document.getElementById('modal-tags');
    const modalDesc = document.getElementById('modal-desc');
    const modalLinks = document.getElementById('modal-links');

    if (modal && projectCardsList.length > 0) {
        projectCardsList.forEach(card => {
            card.addEventListener('click', (e) => {
                // Ignore clicks on links within the card so they work normally
                if (e.target.closest('.project-link') || e.target.closest('a')) {
                    return;
                }

                // Get project details from card
                const title = card.querySelector('.project-card-title').textContent;
                const desc = card.querySelector('.project-card-desc').textContent;
                const tagsHtml = card.querySelector('.project-tags-row').innerHTML;
                const linksHtml = card.querySelector('.project-links-row').innerHTML;
                
                // Check if card has video or image
                const videoElement = card.querySelector('.project-video-preview');
                const imageElement = card.querySelector('.project-thumbnail');

                // Populate modal info
                modalTitle.textContent = title;
                modalDesc.textContent = desc;
                modalTags.innerHTML = tagsHtml;
                modalLinks.innerHTML = linksHtml;

                // Handle video vs image displaying
                if (videoElement) {
                    const sourceElement = videoElement.querySelector('source');
                    if (sourceElement) {
                        modalVideo.src = sourceElement.src;
                        modalVideo.classList.add('active');
                        modalImg.classList.remove('active');
                        modalVideo.load();
                        modalVideo.play().catch(err => console.log("Modal video play interrupted:", err));
                    }
                } else if (imageElement) {
                    modalImg.src = imageElement.src;
                    modalImg.classList.add('active');
                    modalVideo.classList.remove('active');
                    modalVideo.src = '';
                }

                // Show modal
                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden'; // Disable background scrolling
            });
        });

        // Close modal function
        const closeModal = () => {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = ''; // Re-enable background scrolling
            modalVideo.pause();
            modalVideo.src = '';
            modalImg.src = '';
        };

        modalClose.addEventListener('click', closeModal);

        // Close when clicking background outside content
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close with escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

});
