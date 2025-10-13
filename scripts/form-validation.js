// Валидация форм (для diary и contacts)
window.addEventListener('DOMContentLoaded', () => {
    ['diaryForm', 'contactForm'].forEach(formId => {
        const form = document.getElementById(formId)
        if (form) {
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }
                form.classList.add('was-validated')
            }, false)
        }
    })
})