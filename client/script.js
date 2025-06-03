document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('formModal');
    const btn = document.getElementById('openFormBtn');
    const closeBtn = document.querySelector('.close');
    const form = document.getElementById('contactForm');

    // Открытие модального окна
    btn.onclick = function() {
        modal.style.display = "block";
    }

    // Закрытие модального окна при клике на X
    closeBtn.onclick = function() {
        modal.style.display = "none";
    }

    // Закрытие модального окна при клике вне его
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Обработка отправки формы
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Получаем данные формы
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        const checkedBoxes = document.querySelectorAll('input[name="interests"]:checked');
        const interests = Array.from(checkedBoxes).map(box => box.value);

        try {
            const response = await fetch('/api/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, message, interests })
            });

            const data = await response.json();
            
            if (data.success) {
                alert('Форма успешно отправлена!');
                form.reset();
                modal.style.display = "none";
            } else {
                alert('Произошла ошибка при отправке формы');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка соединения с сервером');
        }
    });
});