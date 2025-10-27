// Функция фильтрации проектов
function filterProjects() {
  // Получаем все чекбоксы
  const checkboxes = document.querySelectorAll('.form-check-input');
  
  // Получаем выбранные технологии
  const selected = Array.from(checkboxes)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.dataset.filter);
  
  // Получаем все карточки проектов
  const cards = document.querySelectorAll('.col-md-4');
  
  // Проходим по каждой карточке
  cards.forEach(card => {
    const tech = card.dataset.tech;
    
    // Если ничего не выбрано или технология совпадает с выбранной - показываем
    if (selected.length === 0 || selected.includes(tech)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Добавляем слушатели на чекбоксы
document.querySelectorAll('.form-check-input').forEach(checkbox => {
  checkbox.addEventListener('change', filterProjects);
});

// Инициализируем фильтр при загрузке
filterProjects();