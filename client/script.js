document.addEventListener('DOMContentLoaded', function() {
    const getAccessBtn = document.getElementById('getAccessBtn');
    const modal = document.getElementById('waitlistModal');
    const closeModalBtn = document.querySelector('.close-modal');
    
    // Function for creating toast notification
    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.classList.add('toast', `toast-${type}`);
        
        toast.innerHTML = `
            <div class="toast-message">${message}</div>
            <img class="toast-close" src="assets/icons/close.svg" alt="Clipboard icon">
        `;
        
        toastContainer.appendChild(toast);
        
        // Appearance animation
        setTimeout(() => {
            toast.style.opacity = 1;
        }, 10);
        
        // Handling closure
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => removeToast(toast));
        
        // Automatic hiding after 5 seconds
        setTimeout(() => removeToast(toast), 5000);
    }
    
    // Function for removing toast with animation
    function removeToast(toast) {
        toast.classList.add('toast-fadeout');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }
    
    // Opening the modal window when clicking on the "Get Access" button
    getAccessBtn.addEventListener('click', function() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Preventing scrolling of the main page
    });
    
    // Closing the modal window when clicking on the X button
    closeModalBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restoring scrolling of the main page
    });
    
    // Closing the modal window when clicking outside its content
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Toggling selected answer options
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Finding all buttons in the current question group
            const parentQuestion = this.closest('.question');
            const siblings = parentQuestion.querySelectorAll('.option-btn');
            
            // If this is question 6, allow multiple selection
            if (parentQuestion.querySelector('.question-number').textContent === '6') {
                this.classList.toggle('selected');
            } else {
                // For other questions - only one answer
                siblings.forEach(btn => btn.classList.remove('selected'));
                this.classList.add('selected');
            }
        });
    });
    
    // Processing form submission
    const form = document.getElementById('waitlistForm');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Collecting form data
        const formData = {
            email: document.getElementById('email').value,
            questions: []
        };
        
        // Collecting answers to all questions
        const questions = document.querySelectorAll('.question');
        questions.forEach(question => {
            const questionNumber = question.querySelector('.question-number').textContent;
            const questionText = question.querySelector('p').textContent;
            
            // For questions with text field
            if (questionNumber === '9') {
                const textareaValue = question.querySelector('textarea').value;
                formData.questions.push({
                    number: parseInt(questionNumber),
                    question: questionText,
                    answer: textareaValue
                });
            } else {
                // For questions with answer options
                const selectedOptions = question.querySelectorAll('.option-btn.selected');
                const answers = Array.from(selectedOptions).map(option => option.textContent);
                
                formData.questions.push({
                    number: parseInt(questionNumber),
                    question: questionText,
                    answer: answers
                });
            }
        });
        
        // Showing the user that submission is in progress
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            // Sending data to the server
            const response = await fetch('/api/submit-waitlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Showing success message
                showToast('Thank you for joining the waitlist! We will contact you soon.', 'success');
                form.reset();
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            } else {
                showToast('Error: ' + (result.error || 'Failed to submit form'), 'error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showToast('Failed to submit form. Please try again later.', 'error');
        } finally {
            // Returning the button to its original state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
});
