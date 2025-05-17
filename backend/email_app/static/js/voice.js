document.addEventListener('DOMContentLoaded', function () {
    const welcomeContainer = document.querySelector('.welcome-container');
    const loginContainer = document.querySelector('.login-container');
    welcomeContainer.classList.add('active');

    setTimeout(() => {
        loginContainer.classList.add('active');
        createParticles();
    }, 500);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US'; // You can customize language here
    } else {
        alert("Speech Recognition not supported in your browser. Please use Chrome or Edge.");
    }

    // Start voice interaction after first click
    document.body.addEventListener('click', function () {
        if (recognition) {
            speakAndListen("Welcome to The Sign in Page. Please say your email.", 'email');
        }
    }, { once: true });

    // Speak a message and then listen for voice input of specific field
    function speakAndListen(text, fieldType) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;

        utterance.onend = function () {
            setTimeout(() => {
                if (fieldType === 'confirmation') {
                    captureConfirmation();
                } else {
                    captureVoiceInput(fieldType);
                }
            }, 500);
        };

        synth.speak(utterance);
    }

    // Listen and process voice input for email or password
    function captureVoiceInput(fieldType) {
        const statusMessage = document.getElementById('status-message');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        recognition.start();

        recognition.onresult = function (event) {
            let transcript = event.results[0][0].transcript.trim();

            if (fieldType === 'email') {
                const formattedEmail = formatEmail(transcript);
                emailInput.value = formattedEmail;
                document.getElementById('email-prompt').textContent = formattedEmail;
                validateEmail(formattedEmail);
            } else if (fieldType === 'password') {
                const formattedPassword = formatPassword(transcript);
                passwordInput.value = formattedPassword;
                document.getElementById('password-prompt').textContent = formattedPassword;
                validatePassword(formattedPassword);
            }
        };

        recognition.onerror = function (event) {
            statusMessage.textContent = 'Error: ' + event.error;
            speakAndListen("Sorry, I didn't catch that. Please try again.", fieldType);
        };

        recognition.onend = function () {
            // If no result received, prompt again
            // (Handled inside onresult and onerror; do nothing here)
        };
    }

    // Validate email format; if valid, prompt for password
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email)) {
            speakAndListen("Email received. Now, please say your password.", 'password');
        } else {
            speakAndListen("That doesn't seem like a valid email address. Please try again.", 'email');
        }
    }

    // Validate password length and credentials; then ask confirmation
    function validatePassword(password) {
        if (password.length >= 6) {
            const userEmail = document.getElementById('email').value;
            const userPassword = password;

            // Dummy credentials - replace with backend validation
            const storedEmail = "test@example.com";
            const storedPassword = "123456";

            if (userEmail === storedEmail && userPassword === storedPassword) {
                speakAndListen("Credentials correct. Say 'Yes' if you want to log in or 'No' to retry.", 'confirmation');
            } else {
                speakAndListen("Incorrect credentials. Please say your email again.", 'email');
            }
        } else {
            speakAndListen("Password must be at least 6 characters. Please try again.", 'password');
        }
    }

    // Capture user confirmation to login or retry
    function captureConfirmation() {
        const statusMessage = document.getElementById('status-message');

        recognition.start();

        recognition.onresult = function (event) {
            let transcript = event.results[0][0].transcript.trim().toLowerCase();

            if (transcript === "yes") {
                speak("Login successful. Redirecting to your dashboard.");
                setTimeout(() => {
                    window.location.href = "dashboard.html"; // Redirect to dashboard
                }, 1500);
            } else if (transcript === "no") {
                speakAndListen("Retrying login. Please say your email address.", 'email');
            } else {
                speak("Sorry, I didn't catch that. Please say 'Yes' to log in or 'No' to retry.");
                // Re-listen for confirmation after speaking
                utteranceOnEnd(() => captureConfirmation());
            }
        };

        recognition.onerror = function (event) {
            statusMessage.textContent = 'Error: ' + event.error;
            speakAndListen("Sorry, I didn't catch that. Please say 'Yes' to log in or 'No' to retry.", 'confirmation');
        };
    }

    // Speak text without further action
    function speak(text) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        synth.speak(utterance);
    }

    // Helper to run callback after utterance ends (used in captureConfirmation)
    function utteranceOnEnd(callback) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance('');
        utterance.onend = callback;
        synth.speak(utterance);
    }

    // Format password from spoken words (converts words to symbols etc.)
    function formatPassword(spokenText) {
        let formatted = spokenText.toLowerCase()
            .replace(/\s/g, '')
            .replace(/hash/g, '#')
            .replace(/attherate/g, '@')
            .replace(/at/g, '@')
            .replace(/star/g, '*')
            .replace(/dollar/g, '$')
            .replace(/percent/g, '%')
            .replace(/and/g, '&')
            .replace(/underscore/g, '_')
            .replace(/plus/g, '+')
            .replace(/minus/g, '-')
            .replace(/dot/g, '.')
            .replace(/comma/g, ',')
            .replace(/questionmark/g, '?')
            .replace(/exclamationmark/g, '!')
            .replace(/colon/g, ':')
            .replace(/semicolon/g, ';');
        return formatted;
    }

    // Format email from spoken words to standard email format
    function formatEmail(spokenText) {
        let formatted = spokenText.toLowerCase()
            .replace(/\s/g, '')
            .replace(/attherate/g, '@')
            .replace(/at/g, '@')
            .replace(/dot/g, '.')
            .replace(/underscore/g, '_');
        return formatted;
    }

    // Particle animation creation for background effect
    function createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 30;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            const size = Math.random() * 10 + 5;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 10 + 10;

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;

            particlesContainer.appendChild(particle);
        }
    }
});
