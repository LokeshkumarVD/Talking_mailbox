document.addEventListener('DOMContentLoaded', function () {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
    } else {
        alert("Speech Recognition not supported in your browser. Please use Chrome or Edge.");
    }

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const statusMessage = document.getElementById('status-message');

    // Start listening when the user clicks anywhere on the page
    document.body.addEventListener('click', function () {
        speakAndListen("Welcome to Talking Mailbox. Please say your email address after the beep.", 'email');
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
        // Accept password if it's at least 6 characters long
        if (password.length >= 6) {
            speakAndListen("Password received. Confirming your details. Please say 'Yes' to confirm or 'No' to retry.", 'confirmation');
        } else {
            speakAndListen("Password is too weak. Please ensure it has at least 6 characters.", 'password');
        }
    }

    function formatPassword(spokenText) {
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
        let formatted = spokenText.toLowerCase()
            .replace(/\s/g, '')          // remove spaces
            .replace('attherate', '@')    // if someone says 'attherate'
            .replace('at', '@')           // if someone says 'at'
            .replace('dot', '.')          // if someone says 'dot'
            .replace('underscore', '_');  // if someone says 'underscore'
        return formatted;
    }

});
