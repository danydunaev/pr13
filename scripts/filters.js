window.addEventListener('DOMContentLoaded', () => {
    const filters = document.querySelectorAll('[data-filter]')
    const grid = document.getElementById('projects-grid')
    if (grid) {
        filters.forEach(filter => {
            filter.addEventListener('change', () => {
                const selected = Array.from(filters).filter(f => f.checked).map(f => f.dataset.filter)
                grid.querySelectorAll('.col-md-4').forEach(item => {
                    const tech = item.dataset.tech
                    item.style.display = selected.length === 0 || selected.includes(tech) ? 'block' : 'none'
                })
            })
        })
    }
})