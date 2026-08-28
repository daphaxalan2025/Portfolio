/* =========================================================
   LOGIN SCRIPT
   Credentials: Daphne / 12345
   ========================================================= */

document.addEventListener('DOMContentLoaded', function() {

    // Apply saved theme to login page
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
    }

    const loginForm = document.getElementById('loginform');
    if (!loginForm) return;

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');

    const CORRECT_USERNAME = 'Daphne';
    const CORRECT_PASSWORD = '12345';

    function notify(message, type) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('error', 'success');
        void errorMessage.offsetWidth;
        errorMessage.classList.add('show', type);
    }

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (username === CORRECT_USERNAME && password === CORRECT_PASSWORD) {
            sessionStorage.setItem('daphne_logged_in', 'yes');
            notify('Login successful! Redirecting...', 'success');

            setTimeout(function() {
                window.location.href = 'index.html';
            }, 900);
        } else {
            notify('Incorrect username or password. Please try again.', 'error');
            passwordInput.value = '';
            passwordInput.focus();
        }
    });
});