document.addEventListener('DOMContentLoaded', () => {
    
    // Mobile Menu
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

    mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Scroll Animations
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Dark Mode
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

    // Form Submission & Google Sheets
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyJYNkfJWImAlyRY8pKCpf2ffb1sUBQGPBPy-cAuGbCbYx5z2Gjq7yF9N4AIbrhyCxk/exec';
    const forms = document.querySelectorAll("#hero-waitlist, form[name='submit-to-google-sheet']"); 

    // Modals
    const successModal = document.getElementById('success-modal');
    const closeSuccessBtn = successModal ? successModal.querySelector('.close-modal') : null;
    const closeSuccessActionBtn = successModal ? successModal.querySelector('.close-modal-btn') : null;

    const errorModal = document.getElementById('error-modal');
    const closeErrorBtn = errorModal ? errorModal.querySelector('.close-modal') : null;
    const closeErrorActionBtn = errorModal ? errorModal.querySelector('.close-modal-btn') : null;

    function openSuccessModal() { if(successModal) successModal.classList.add('active'); }
    function closeSuccess() { if(successModal) successModal.classList.remove('active'); }
    function openErrorModal() { if(errorModal) errorModal.classList.add('active'); }
    function closeError() { if(errorModal) errorModal.classList.remove('active'); }

    // Modal Listeners
    if(closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeSuccess);
    if(closeSuccessActionBtn) closeSuccessActionBtn.addEventListener('click', closeSuccess);
    if(closeErrorBtn) closeErrorBtn.addEventListener('click', closeError);
    if(closeErrorActionBtn) closeErrorActionBtn.addEventListener('click', closeError);

    window.addEventListener('click', (e) => {
        if(e.target === successModal) closeSuccess();
        if(e.target === errorModal) closeError();
    });

    if (forms) {
        forms.forEach(form => {
            form.addEventListener('submit', e => {
                e.preventDefault();
                
                const originalBtnText = form.querySelector('button').innerHTML;
                form.querySelector('button').innerHTML = 'Sending...';

                fetch(scriptURL, { method: 'POST', body: new FormData(form)})
                    .then(response => {
                        if (!response.ok) throw new Error('Network error');
                        
                        const contentType = response.headers.get("content-type");
                        if (contentType && contentType.indexOf("application/json") !== -1) {
                            return response.json().then(data => {
                                if (data.result === 'error') throw new Error(data.error);
                                return data;
                            });
                        }
                        return response.text();
                    })
                    .then(() => {
                        openSuccessModal();
                        form.reset();
                        form.querySelector('button').innerHTML = originalBtnText;
                    })
                    .catch(error => {
                        console.error('Submission failed', error.message);
                        openErrorModal();
                        form.querySelector('button').innerHTML = originalBtnText;
                    });
            });
        });
    }

    // FAQ Accordion
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
