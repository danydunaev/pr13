window.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('projectModal')
    if (modal) {
        modal.addEventListener('show.bs.modal', event => {
            const button = event.relatedTarget
            const projectId = button.dataset.projectId
            // Пример данных (адаптируйте под реальные)
            const data = {
                1: { title: 'Проект 1', img: '../images/project1.jpg', desc: 'Полное описание. Скриншоты, ссылки.', tech: 'HTML/CSS', live: '#', code: '#' },
                2: { title: 'Проект 2', img: '../images/project2.jpg', desc: 'Полное описание.', tech: 'JavaScript', live: '#', code: '#' },
                3: { title: 'Проект 3', img: '../images/project3.jpg', desc: 'Полное описание.', tech: 'React', live: '#', code: '#' },
                4: { title: 'Проект 4', img: '../images/project4.jpg', desc: 'Полное описание.', tech: 'HTML/CSS', live: '#', code: '#' }
            }[projectId]
            modal.querySelector('#projectModalLabel').textContent = data.title
            modal.querySelector('#modalImage').src = data.img
            modal.querySelector('#modalDescription').textContent = data.desc
            modal.querySelector('#modalTech').textContent = 'Технологии: ' + data.tech
            modal.querySelector('#modalLive').href = data.live
            modal.querySelector('#modalCode').href = data.code
        })
    }
})