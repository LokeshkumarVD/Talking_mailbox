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
    } else {
        alert("Speech Recognition not supported in your browser. Please use Chrome or Edge.");
    }

    document.body.addEventListener('click', function () {
        if (recognition) {
            speakAndListen("Welcome to Talking Mailbox. Please say your email address after the beep.", 'email');
        }
    }, { once: true });

    function speakAndListen(text, fieldType) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;

        utterance.onend = function () {
            setTimeout(() => {
                captureVoiceInput(fieldType);
            }, 500); // slight delay after speaking
        };

        synth.speak(utterance);
    }

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
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email)) {
            speakAndListen("Email received. Now, please say your password after the beep.", 'password');
        } else {
            speakAndListen("That doesn't seem like a valid email address. Please try again.", 'email');
        }
    }

    function validatePassword(password) {
        // Accept password only if it's exactly 6 characters long
        if (password.length >= 6) {
            // Cross-checking the email and password for login
            const userEmail = document.getElementById('email').value;
            const userPassword = password;

            // Dummy validation (replace with actual validation from backend)
            const storedEmail = "test@example.com";  // Replace with actual stored email
            const storedPassword = "123456";         // Replace with actual stored password

            if (userEmail === storedEmail && userPassword === storedPassword) {
                speakAndListen("Credentials correct. Say 'Yes' if you want to log in or 'No' to retry.", 'confirmation');
            } else {
                speakAndListen("Incorrect credentials. Please try again.", 'retry');
            }
        } else {
            speakAndListen("Password must be more than or equal to 6 characters. Please try again.", 'password');
        }
    }

    function captureConfirmation() {
        const statusMessage = document.getElementById('status-message');
        recognition.start();

        recognition.onresult = function (event) {
            let transcript = event.results[0][0].transcript.trim().toLowerCase();

            if (transcript === "yes") {
                speak("Login successful. Redirecting to your dashboard.");
                window.location.href = "dashboard.html"; // Redirect to the dashboard page
            } else if (transcript === "no") {
                speak("Retrying login. Please enter your credentials again.");
                speakAndListen("Please say your email address after the beep.", 'email'); // Start the process over at the email prompt
            } else {
                speak("Sorry, I didn't catch that. Please say 'Yes' to log in or 'No' to retry.");
            }
        };

        recognition.onerror = function (event) {
            statusMessage.textContent = 'Error: ' + event.error;
        };
    }

    function formatPassword(spokenText) {
        // Format password: convert words to symbols
        let formatted = spokenText.toLowerCase()
            .replace(/\s/g, '')               // remove spaces
            .replace(/hash/g, '#')            // if someone says 'hash'
            .replace(/attherate/g, '@')       // if someone says 'attherate'
            .replace(/at/g, '@')              // if someone says 'at'
            .replace(/star/g, '*')            // if someone says 'star'
            .replace(/dollar/g, '$')          // if someone says 'dollar'
            .replace(/percent/g, '%')         // if someone says 'percent'
            .replace(/and/g, '&')             // if someone says 'and'
            .replace(/underscore/g, '_')      // if someone says 'underscore'
            .replace(/plus/g, '+')            // if someone says 'plus'
            .replace(/minus/g, '-')           // if someone says 'minus'
            .replace(/dot/g, '.')             // if someone says 'dot'
            .replace(/comma/g, ',')           // if someone says 'comma'
            .replace(/questionmark/g, '?')    // if someone says 'questionmark'
            .replace(/exclamationmark/g, '!') // if someone says 'exclamationmark'
            .replace(/colon/g, ':')           // if someone says 'colon'
            .replace(/semicolon/g, ';');      // if someone says 'semicolon'
        
        return formatted;
    }
    
    function formatEmail(spokenText) {
        // Convert spoken email into standard email format
        let formatted = spokenText.toLowerCase()
            .replace(/\s/g, '')          // remove spaces
            .replace('attherate', '@')    // if someone says 'attherate'
            .replace('at', '@')           // if someone says 'at'
            .replace('dot', '.')          // if someone says 'dot'
            .replace('underscore', '_');  // if someone says 'underscore'
        return formatted;
    }

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
