/* =========================================================
   DAPHNE B. AXALAN — LOGIN SCRIPT
   ---------------------------------------------------------
   Correct credentials (Daphne / 12345) -> index.html
   Wrong credentials              -> error notification
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

    // login page matches the portfolio
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

    // show a styled notification pill (red = error, green = success)
    function notify(message, type) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('error', 'success');
        void errorMessage.offsetWidth; // restart any CSS animation
        errorMessage.classList.add('show', type);
    }

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (username === CORRECT_USERNAME && password === CORRECT_PASSWORD) {
            // mark this browser session as logged in, then enter the portfolio
            sessionStorage.setItem('daphne_logged_in', 'yes');

            notify('✅ Login successful! Redirecting...', 'success');

            setTimeout(function () {
                window.location.href = 'index.html';
            }, 900);

        } else {
            notify('❌ Incorrect username or password. Please try again.', 'error');

            // clear the password so the visitor can retry
            passwordInput.value = '';
            passwordInput.focus();
        }
    });

});