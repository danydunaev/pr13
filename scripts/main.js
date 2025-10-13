// Смена темы (без изменений)
(() => {
    'use strict'
    const getStoredTheme = () => localStorage.getItem('theme')
    const setStoredTheme = theme => localStorage.setItem('theme', theme)
    const getPreferredTheme = () => {
        const storedTheme = getStoredTheme()
        if (storedTheme) return storedTheme
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    const setTheme = theme => {
        if (theme === 'auto') {
            document.documentElement.setAttribute('data-bs-theme', (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
        } else {
            document.documentElement.setAttribute('data-bs-theme', theme)
        }
    }
    setTheme(getPreferredTheme())
    const showActiveTheme = (theme, focus = false) => {
        const themeSwitcher = document.querySelector('#bd-theme')
        if (!themeSwitcher) return
        const themeSwitcherText = document.querySelector('#bd-theme-text')
        const activeThemeIcon = document.querySelector('.theme-icon-active use')
        const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)
        const svgOfActiveBtn = btnToActive.querySelector('svg use').getAttribute('href')
        document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
            element.classList.remove('active')
            element.setAttribute('aria-pressed', 'false')
        })
        btnToActive.classList.add('active')
        btnToActive.setAttribute('aria-pressed', 'true')
        activeThemeIcon.setAttribute('href', svgOfActiveBtn)
        const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`
        themeSwitcher.setAttribute('aria-label', themeSwitcherLabel)
        if (focus) themeSwitcher.focus()
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const storedTheme = getStoredTheme()
        if (storedTheme !== 'light' && storedTheme !== 'dark') setTheme(getPreferredTheme())
    })
    window.addEventListener('DOMContentLoaded', () => {
        showActiveTheme(getPreferredTheme())
        document.querySelectorAll('[data-bs-theme-value]').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const theme = toggle.getAttribute('data-bs-theme-value')
                setStoredTheme(theme)
                setTheme(theme)
                showActiveTheme(theme, true)
            })
        })
    })
})();

// Валидация и добавление записей в формы (для diary и contacts)
window.addEventListener('DOMContentLoaded', () => {
    ['diaryForm', 'contactForm'].forEach(formId => {
        const form = document.getElementById(formId)
        if (form) {
            form.addEventListener('submit', event => {
                event.preventDefault(); // Всегда предотвращаем дефолт, чтобы обработать JS
                if (!form.checkValidity()) {
                    event.stopPropagation();
                } else {
                    // Успешная валидация
                    if (formId === 'diaryForm') {
                        // Добавляем новую запись в хронологию
                        const date = document.getElementById('date').value;
                        const topic = document.getElementById('topic').value;
                        const description = document.getElementById('description').value; // Не используется в li, но можно добавить
                        const status = document.getElementById('status').value === 'done' ? '✓' : '⏳';
                        const badgeClass = status === '✓' ? 'bg-success' : 'bg-warning';

                        const listGroup = document.querySelector('.list-group'); // UL с хронологией
                        const newItem = document.createElement('li');
                        newItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
                        newItem.innerHTML = `
                            ${date} - ${topic}
                            <span class="badge ${badgeClass}">${status}</span>
                        `;
                        listGroup.prepend(newItem); // Добавляем в начало списка (новые сверху)

                        // Очищаем форму
                        form.reset();
                    } else if (formId === 'contactForm') {
                        // Для контактов: Просто алерт или симуляция отправки (без backend)
                        alert('Сообщение отправлено! (Симуляция)');
                        form.reset();
                    }
                }
                form.classList.add('was-validated');
            }, false);
        }
    });
});