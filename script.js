document.addEventListener('DOMContentLoaded', () => {
    
    /* -------------------------------------------------------------
       1. Mobile Menu Toggle
       ------------------------------------------------------------- */
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-links a');

    function toggleMenu() {
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    }

    if(mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMenu);
    if(closeMenuBtn) closeMenuBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    /* -------------------------------------------------------------
       2. Navbar Scroll Effect
       ------------------------------------------------------------- */
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* -------------------------------------------------------------
       3. Scroll Reveal Animation
       ------------------------------------------------------------- */
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* -------------------------------------------------------------
       4. Countdown Timer (Removed)
       ------------------------------------------------------------- */
    // Code removed as per new design requirements

    /* -------------------------------------------------------------
       5. Dark Mode Toggle
       ------------------------------------------------------------- */
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check saved preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });

    /* -------------------------------------------------------------
       7. Form Submission Handling (Google Sheets) & Real-time Count
       ------------------------------------------------------------- */
    const scriptURL = 'YOUR_GOOGLE_SCRIPT_URL_HERE'; // User needs to replace this
    
    // Select both the hero form (by ID) and the launch form (by name)
    const forms = document.querySelectorAll("#hero-waitlist, form[name='submit-to-google-sheet']"); 



    // Modal Elements
    const modal = document.getElementById('success-modal');
    const closeModal = document.querySelector('.close-modal');
    const closeModalBtn = document.querySelector('.close-modal-btn');

    function openModal() {
        if(modal) modal.classList.add('active');
    }

    function removeModal() {
        if(modal) modal.classList.remove('active');
    }

    if(closeModal) closeModal.addEventListener('click', removeModal);
    if(closeModalBtn) closeModalBtn.addEventListener('click', removeModal);
    window.addEventListener('click', (e) => {
        if(e.target === modal) removeModal();
    });
    
    // Base count starting from 10
    // The visual counter text was changed to generic text, so we no longer update a number.
    // However, if we want to keep the logic for future use or to track internally:
    let currentCount = 10; 
    
    // Function to update the displayed count - DISABLED as element has no ID now or is text only
    function updateCountDisplay() {
        if(countDisplay) {
            // countDisplay.innerText = currentCount.toLocaleString(); // Disabled per user request
        }
    }
    
    // Initialize count
    // updateCountDisplay();

    if (forms) {
        forms.forEach(form => {
            form.addEventListener('submit', e => {
                e.preventDefault();
                
                // Simulate success for demo purposes if URL not set
                if(scriptURL === 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
                    openModal();
                    form.reset();
                    // currentCount++; // Increment count on signup
                    // updateCountDisplay();
                    return;
                }

                fetch(scriptURL, { method: 'POST', body: new FormData(form)})
                    .then(response => {
                        openModal();
                        form.reset();
                        // currentCount++; // Increment count on signup
                        // updateCountDisplay();
                    })
                    .catch(error => {
                        console.error('Error!', error.message);
                        alert("There was an issue joining the waitlist. Please try again.");
                    });
            });
        });
    }

    /* -------------------------------------------------------------
       8. FAQ Accordion
       ------------------------------------------------------------- */
    const accordions = document.querySelectorAll('.accordion-header');
    accordions.forEach(acc => {
        acc.addEventListener('click', () => {
            acc.classList.toggle('active');
            const panel = acc.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    });

});
