document.addEventListener('DOMContentLoaded', () => {
            const months = [
                { name: 'March 2026', year: 2026, month: 2, days: 31, offset: 0 }, 
                { name: 'April 2026', year: 2026, month: 3, days: 30, offset: 3 }, 
                { name: 'May 2026', year: 2026, month: 4, days: 31, offset: 5 },   
                { name: 'June 2026 (End)', year: 2026, month: 5, days: 6, offset: 1 } // Only render early June
            ];

            const events = [
                { start: '2026-03-25', end: '2026-03-30', label: 'Application Period', class: 'evt-app' },
                { start: '2026-03-31', end: '2026-03-31', label: 'Task Division', class: 'evt-div' },
                
                { start: '2026-04-01', end: '2026-04-10', label: 'Task 1 (Execute)', class: 'evt-work' },
                { start: '2026-04-11', end: '2026-04-12', label: 'Submit T1', class: 'evt-sub' },
                { start: '2026-04-13', end: '2026-04-14', label: 'Eval T1', class: 'evt-rev' },

                { start: '2026-04-15', end: '2026-04-24', label: 'Task 2 (Execute)', class: 'evt-work' },
                { start: '2026-04-25', end: '2026-04-26', label: 'Submit T2', class: 'evt-sub' },
                { start: '2026-04-27', end: '2026-04-28', label: 'Eval T2', class: 'evt-rev' },

                { start: '2026-04-29', end: '2026-05-08', label: 'Task 3 (Execute)', class: 'evt-work' },
                { start: '2026-05-09', end: '2026-05-10', label: 'Submit T3', class: 'evt-sub' },
                { start: '2026-05-11', end: '2026-05-12', label: 'Eval T3', class: 'evt-rev' },

                { start: '2026-05-14', end: '2026-05-29', label: 'Group Task 4', class: 'evt-work' },
                { start: '2026-05-30', end: '2026-05-31', label: 'Submit T4', class: 'evt-sub' },
                { start: '2026-06-01', end: '2026-06-02', label: 'Final Eval', class: 'evt-rev' }
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
                const isShortJune = m.month === 5;
                
                let html = `
                    <div class="month-container">
                        <div class="month-header">
                            <button class="calendar-nav-btn prev-btn" ${currentIndex === 0 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>
                            <span>${m.name}</span>
                            <button class="calendar-nav-btn next-btn" ${currentIndex === months.length - 1 ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button>
                        </div>
                        <div class="days-grid">
                            ${weekdays.map(d => `<div class="day-header">${d}</div>`).join('')}
                `;

                // Empty cells before start of month
                for (let i = 0; i < m.offset; i++) {
                    html += `<div class="day-cell other-month"></div>`;
                }

                // Days
                for (let d = 1; d <= m.days; d++) {
                    const dateStr = `${m.year}-${String(m.month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                    const dObj = new Date(m.year, m.month, d);
                    const isToday = dObj.toDateString() === today.toDateString();
                    
                    let dayEventsHtml = '';
                    events.forEach(e => {
                        if (dateStr >= e.start && dateStr <= e.end) {
                            dayEventsHtml += `<div class="event-badge ${e.class}">${e.label}</div>`;
                        }
                    });

                    html += `
                        <div class="day-cell ${isToday ? 'today' : ''}" data-date="${dateStr}">
                            ${isToday ? '<span class="today-label">Today</span>' : ''}
                            <span class="date-num">${d}</span>
                            <div class="day-events">${dayEventsHtml}</div>
                        </div>
                    `;
                }

                // Fill remaining cells to complete the grid
                const totalCells = m.offset + m.days;
                const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
                for (let i = 0; i < remaining; i++) {
                    html += `<div class="day-cell other-month"></div>`;
                }

                html += `</div></div>`;
                wrapper.innerHTML = html;

                // Add event listeners for arrows
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

            // Initial render
            renderCalendar();
        });