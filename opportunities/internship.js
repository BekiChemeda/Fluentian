document.addEventListener('DOMContentLoaded', () => {
    const months = [
        { name: 'March 2026', year: 2026, month: 2, days: 31, offset: 0 }, 
        { name: 'April 2026', year: 2026, month: 3, days: 30, offset: 3 }, 
        { name: 'May 2026', year: 2026, month: 4, days: 31, offset: 5 },   
        { name: 'June 2026 (End)', year: 2026, month: 5, days: 6, offset: 1 }
    ];

    const events = [
        { start: '2026-03-25', end: '2026-03-30', label: 'Application Period', class: 'bg-blue-500' },
        { start: '2026-03-31', end: '2026-03-31', label: 'Task Division', class: 'bg-gray-500' },
        
        { start: '2026-04-01', end: '2026-04-10', label: 'Task 1 (Execute)', class: 'bg-blue-600' },
        { start: '2026-04-11', end: '2026-04-12', label: 'Submit T1', class: 'bg-green-500' },
        { start: '2026-04-13', end: '2026-04-14', label: 'Eval T1', class: 'bg-gray-800 dark:bg-gray-600' },

        { start: '2026-04-15', end: '2026-04-24', label: 'Task 2 (Execute)', class: 'bg-blue-600' },
        { start: '2026-04-25', end: '2026-04-26', label: 'Submit T2', class: 'bg-green-500' },
        { start: '2026-04-27', end: '2026-04-28', label: 'Eval T2', class: 'bg-gray-800 dark:bg-gray-600' },

        { start: '2026-04-29', end: '2026-05-08', label: 'Task 3 (Execute)', class: 'bg-blue-600' },
        { start: '2026-05-09', end: '2026-05-10', label: 'Submit T3', class: 'bg-green-500' },
        { start: '2026-05-11', end: '2026-05-12', label: 'Eval T3', class: 'bg-gray-800 dark:bg-gray-600' },

        { start: '2026-05-14', end: '2026-05-29', label: 'Group Task 4', class: 'bg-blue-600' },
        { start: '2026-05-30', end: '2026-05-31', label: 'Submit T4', class: 'bg-green-500' },
        { start: '2026-06-01', end: '2026-06-02', label: 'Final Eval', class: 'bg-gray-800 dark:bg-gray-600' }
    ];

    const today = new Date();
    const wrapper = document.getElementById('calendar-wrapper');
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    let currentIndex = 0;
    
    // Try to find the valid starting month based on real date
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const foundIndex = months.findIndex(m => m.year === currentYear && m.month === currentMonth);
    if (foundIndex !== -1) {
        currentIndex = foundIndex;
    }

    function renderCalendar() {
        const m = months[currentIndex];
        
        let html = `
            <div class="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden shadow-sm transition-colors duration-200">
                <div class="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-dark-border p-4 flex justify-between items-center">
                    <button class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed prev-btn" ${currentIndex === 0 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <span class="font-bold text-lg text-gray-900 dark:text-white pointer-events-none select-none">${m.name}</span>
                    <button class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed next-btn" ${currentIndex === months.length - 1 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                <div class="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
                    ${weekdays.map(d => `<div class="bg-white dark:bg-dark-surface py-2 text-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">${d}</div>`).join('')}
        `;

        // Empty cells before start of month
        for (let i = 0; i < m.offset; i++) {
            html += `<div class="bg-gray-50 dark:bg-dark-bg min-h-[90px] p-2"></div>`;
        }

        // Days
        for (let d = 1; d <= m.days; d++) {
            const dateStr = `${m.year}-${String(m.month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const dObj = new Date(m.year, m.month, d);
            const isToday = dObj.toDateString() === today.toDateString();
            
            let dayEventsHtml = '';
            events.forEach(e => {
                if (dateStr >= e.start && dateStr <= e.end) {
                    dayEventsHtml += `<div class="block text-[10px] sm:text-xs px-1.5 py-0.5 rounded text-white font-medium mb-1 truncate ${e.class} shadow-sm">${e.label}</div>`;
                }
            });

            html += `
                <div class="bg-white dark:bg-dark-surface min-h-[90px] p-2 relative group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    ${isToday ? '<span class="absolute top-1 right-1 text-[10px] font-bold text-accent uppercase hidden sm:block">Today</span>' : ''}
                    <div class="w-7 h-7 flex items-center justify-center font-bold text-sm rounded-full mb-1 ${isToday ? 'bg-accent text-white shadow-md' : 'text-gray-700 dark:text-gray-300'}">${d}</div>
                    <div class="space-y-1">${dayEventsHtml}</div>
                </div>
            `;
        }

        // Fill remaining cells
        const totalCells = m.offset + m.days;
        const remaining = (7 - (totalCells % 7)) % 7;
        for (let i = 0; i < remaining; i++) {
             html += `<div class="bg-gray-50 dark:bg-dark-bg min-h-[90px] p-2"></div>`;
        }

        html += `</div></div>`;
        wrapper.innerHTML = html;

        // Listeners
        const prevBtn = wrapper.querySelector('.prev-btn');
        const nextBtn = wrapper.querySelector('.next-btn');

        if (prevBtn && !prevBtn.disabled) {
            prevBtn.addEventListener('click', () => {
                currentIndex--;
                renderCalendar();
            });
        }
        
        if (nextBtn && !nextBtn.disabled) {
            nextBtn.addEventListener('click', () => {
                currentIndex++;
                renderCalendar();
            });
        }
    }

    if(wrapper) {
        renderCalendar();
    }

    // Set default dark mode if no preference saved
    const currentTheme = localStorage.getItem('theme');
    
    // Function to apply theme
    const applyTheme = (theme) => {
        if(theme === 'dark'){
            document.documentElement.classList.add('dark');
            if(tIcon) {
                tIcon.classList.remove('fa-moon');
                tIcon.classList.add('fa-sun');
            }
        } else {
            document.documentElement.classList.remove('dark');
            if(tIcon) {
                tIcon.classList.remove('fa-sun');
                tIcon.classList.add('fa-moon');
            }
        }
    }

    const tIcon = document.querySelector('#theme-toggle i');
    
    if (!currentTheme) {
        applyTheme('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        applyTheme(currentTheme);
    }

    // Theme toggle click handler
    const themeToggle = document.getElementById('theme-toggle');
    if(themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (document.documentElement.classList.contains('dark')) {
                applyTheme('light');
                localStorage.setItem('theme', 'light');
            } else {
                applyTheme('dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // FAQ Accordion Logic
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
           const item = question.parentElement;
           const answer = item.querySelector('.faq-answer');
           const icon = question.querySelector('.faq-toggle-icon');

           // Toggle active state
           item.classList.toggle('active');

           if (item.classList.contains('active')) {
               // Expand
               answer.style.maxHeight = answer.scrollHeight + 'px';
               if(icon) {
                   icon.classList.remove('fa-plus');
                   icon.classList.add('fa-minus');
               }
           } else {
               // Collapse
               answer.style.maxHeight = 0;
               if(icon) {
                   icon.classList.remove('fa-minus');
                   icon.classList.add('fa-plus');
               }
           }
        });
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
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));});