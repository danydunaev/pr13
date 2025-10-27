// Смена темы
(() => {
    'use strict';
    const getStoredTheme = () => localStorage.getItem('theme');
    const setStoredTheme = theme => localStorage.setItem('theme', theme);

    const getPreferredTheme = () => {
        const storedTheme = getStoredTheme();
        if (storedTheme) return storedTheme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const setTheme = theme => {
        if (theme === 'auto') {
            document.documentElement.setAttribute('data-bs-theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        } else {
            document.documentElement.setAttribute('data-bs-theme', theme);
        }
    };

   const updateNavbar = () => {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            // Принудительно устанавливаем тёмный фон для навигации
            navbar.classList.remove('navbar-light', 'bg-light');
            navbar.classList.add('navbar-dark', 'bg-dark');

            // Убедимся, что текст и иконки контрастны на тёмном фоне
            const navLinks = navbar.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.style.color = '#ffffff'; // Белый текст для контраста
            });
            const toggler = navbar.querySelector('.navbar-toggler');
            if (toggler) toggler.classList.add('navbar-dark');
        }
    };

    setTheme(getPreferredTheme());
    updateNavbar();

    const showActiveTheme = (theme, focus = false) => {
        const themeSwitcher = document.querySelector('#bd-theme');
        if (!themeSwitcher) return;

        const themeSwitcherText = document.querySelector('#bd-theme-text');
        const activeThemeIcon = document.querySelector('.theme-icon-active use');
        const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`);
        const svgOfActiveBtn = btnToActive.querySelector('svg use').getAttribute('href');

        document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
            element.classList.remove('active');
            element.setAttribute('aria-pressed', 'false');
        });

        btnToActive.classList.add('active');
        btnToActive.setAttribute('aria-pressed', 'true');
        activeThemeIcon.setAttribute('href', svgOfActiveBtn);
        const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`;
        themeSwitcher.setAttribute('aria-label', themeSwitcherLabel);

        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('role', 'status');
        liveRegion.classList.add('visually-hidden');
        liveRegion.textContent = `Тема изменена на ${btnToActive.dataset.bsThemeValue}`;
        document.body.appendChild(liveRegion);
        setTimeout(() => liveRegion.remove(), 3000);

        if (focus) themeSwitcher.focus();
    };

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const storedTheme = getStoredTheme();
        if (storedTheme !== 'light' && storedTheme !== 'dark') {
            setTheme(getPreferredTheme());
            updateNavbar();
        }
    });

    window.addEventListener('DOMContentLoaded', () => {
        showActiveTheme(getPreferredTheme());
        updateNavbar();

        document.querySelectorAll('[data-bs-theme-value]').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const theme = toggle.getAttribute('data-bs-theme-value');
                setStoredTheme(theme);
                setTheme(theme);
                showActiveTheme(theme, true);
                updateNavbar();
            });
        });
    });
})();

// Валидация и добавление записей в формы (для diary и contacts)
window.addEventListener('DOMContentLoaded', () => {
    ['diaryForm', 'contactForm'].forEach(formId => {
        const form = document.getElementById(formId);
        if (form) {
            const inputs = form.querySelectorAll('input, textarea');
            const statusRegion = document.getElementById('form-status');

            // Прогрессивная валидация на input
            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    if (input.validity.valid) {
                        input.classList.remove('is-invalid');
                        input.setAttribute('aria-invalid', 'false');
                    } else {
                        input.classList.add('is-invalid');
                        input.setAttribute('aria-invalid', 'true');
                    }
                });
            });

            form.addEventListener('submit', event => {
                event.preventDefault();

                // Сброс всех валидационных состояний перед проверкой
                form.classList.remove('was-validated');
                inputs.forEach(input => {
                    input.classList.remove('is-invalid');
                    input.setAttribute('aria-invalid', 'false');
                });
                if (statusRegion) {
                    statusRegion.textContent = '';
                    statusRegion.classList.remove('alert', 'alert-success', 'alert-danger');
                }

                // Проверка валидности
                if (form.checkValidity()) {
                    if (formId === 'diaryForm') {
                        // Добавление записи в дневник
                        const date = document.getElementById('date').value;
                        const topic = document.getElementById('topic').value;
                        const description = document.getElementById('description').value;
                        const status = document.getElementById('status').value === 'done' ? '✓' : '⏳';
                        const badgeClass = status === '✓' ? 'bg-success' : 'bg-warning';

                        const listGroup = document.querySelector('.list-group');
                        const newItem = document.createElement('li');
                        newItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
                        newItem.setAttribute('role', 'listitem');
                        newItem.innerHTML = `
                            <span>${date} - ${topic}</span>
                            <span class="badge ${badgeClass}" aria-label="Статус: ${status === '✓' ? 'Выполнено' : 'В процессе'}">${status}</span>
                        `;
                        listGroup.prepend(newItem);

                        if (statusRegion) {
                            statusRegion.textContent = `Новая запись "${topic}" добавлена в дневник.`;
                            statusRegion.classList.add('alert', 'alert-success');
                            statusRegion.setAttribute('aria-live', 'polite');
                            statusRegion.focus();
                            setTimeout(() => {
                                statusRegion.textContent = '';
                                statusRegion.classList.remove('alert', 'alert-success');
                            }, 3000);
                        }
                    } else if (formId === 'contactForm') {
                        if (statusRegion) {
                            statusRegion.textContent = 'Сообщение успешно отправлено!';
                            statusRegion.classList.add('alert', 'alert-success');
                            statusRegion.setAttribute('aria-live', 'polite');
                            statusRegion.focus();
                            setTimeout(() => {
                                statusRegion.textContent = '';
                                statusRegion.classList.remove('alert', 'alert-success');
                            }, 3000);
                        } else {
                            alert('Сообщение отправлено! (Симуляция)');
                        }
                    }

                    // Полный сброс формы
                    form.reset();
                    form.classList.remove('was-validated');
                    inputs.forEach(input => {
                        input.classList.remove('is-invalid');
                        input.setAttribute('aria-invalid', 'false');
                    });
                } else {
                    // Ошибка
                    form.classList.add('was-validated');
                    inputs.forEach(input => {
                        if (!input.validity.valid) {
                            input.classList.add('is-invalid');
                            input.setAttribute('aria-invalid', 'true');
                        }
                    });
                    const firstInvalid = form.querySelector(':invalid');
                    if (firstInvalid) firstInvalid.focus();

                    if (statusRegion) {
                        statusRegion.textContent = 'Пожалуйста, заполните все обязательные поля.';
                        statusRegion.classList.add('alert', 'alert-danger');
                        statusRegion.setAttribute('aria-live', 'assertive');
                    }
                }
            });

            // Обработка Escape для сброса формы
            form.addEventListener('keydown', event => {
                if (event.key === 'Escape') {
                    form.reset();
                    form.classList.remove('was-validated');
                    inputs.forEach(input => {
                        input.classList.remove('is-invalid');
                        input.setAttribute('aria-invalid', 'false');
                    });
                    if (statusRegion) {
                        statusRegion.textContent = 'Форма сброшена.';
                        statusRegion.classList.remove('alert', 'alert-success', 'alert-danger');
                        statusRegion.setAttribute('aria-live', 'polite');
                        statusRegion.focus();
                    }
                }
            });
        }
    });
});