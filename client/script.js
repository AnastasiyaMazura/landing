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
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Собираем данные формы
        const formData = {
            email: document.getElementById('email').value,
            questions: []
        };
        
        // Собираем ответы на все вопросы
        const questions = document.querySelectorAll('.question');
        questions.forEach(question => {
            const questionNumber = question.querySelector('.question-number').textContent;
            const questionText = question.querySelector('p').textContent;
            
            // Для вопроса с текстовым полем
            if (questionNumber === '9') {
                const textareaValue = question.querySelector('textarea').value;
                formData.questions.push({
                    number: parseInt(questionNumber),
                    question: questionText,
                    answer: textareaValue
                });
            } else {
                // Для вопросов с вариантами ответов
                const selectedOptions = question.querySelectorAll('.option-btn.selected');
                const answers = Array.from(selectedOptions).map(option => option.textContent);
                
                formData.questions.push({
                    number: parseInt(questionNumber),
                    question: questionText,
                    answer: answers
                });
            }
        });
        
        // Показываем пользователю, что идет отправка
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            // Отправляем данные на сервер
            const response = await fetch('/api/submit-waitlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Показываем сообщение об успехе
                alert('Thank you for joining the waitlist! We will contact you soon.');
                form.reset();
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            } else {
                alert('Error: ' + (result.error || 'Failed to submit form'));
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit form. Please try again later.');
        } finally {
            // Возвращаем кнопке исходный вид
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
});