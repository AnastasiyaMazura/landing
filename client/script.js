document.addEventListener('DOMContentLoaded', function() {
    const getAccessBtn = document.getElementById('getAccessBtn');
    const modal = document.getElementById('waitlistModal');
    const closeModalBtn = document.querySelector('.close-modal');
    
    // Открытие модального окна при клике на кнопку "Get Access"
    getAccessBtn.addEventListener('click', function() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Предотвращение прокрутки основной страницы
    });
    
    // Закрытие модального окна при клике на кнопку X
    closeModalBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Возвращение прокрутки основной страницы
    });
    
    // Закрытие модального окна при клике вне его содержимого
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Переключение выбранных вариантов ответов
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Находим все кнопки в текущей группе вопросов
            const parentQuestion = this.closest('.question');
            const siblings = parentQuestion.querySelectorAll('.option-btn');
            
            // Если это вопрос 6, разрешаем множественный выбор
            if (parentQuestion.querySelector('.question-number').textContent === '6') {
                this.classList.toggle('selected');
            } else {
                // Для остальных вопросов - только один ответ
                siblings.forEach(btn => btn.classList.remove('selected'));
                this.classList.add('selected');
            }
        });
    });
    
    // Обработка отправки формы
    const form = document.getElementById('waitlistForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Здесь будет логика отправки данных формы
        alert('Thank you for joining the waitlist!');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
});