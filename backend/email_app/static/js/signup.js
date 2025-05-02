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
    function handleVoiceConfirmation(response) {
        if (response === 'yes') {
            speak("Creating your account. Please wait...");
    
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
    
            fetch('/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            })
            .then(response => response.json())  // Convert to JSON
            .then(data => {
                if (data.status === "success") {  // Check for success status
                    speak("Signup successful. Redirecting to your dashboard.");
                    setTimeout(() => {
                        window.location.href = "/dashboard/";  // Redirect to dashboard
                    }, 2000);  // Wait for 2 seconds to finish TTS before redirecting
                } else {
                    speak("There was a problem creating your account. Please try again.");
                }
            })
            .catch(error => {
                console.error("Signup fetch error:", error);
                speak("Network error. Please try again.");
            });
        } else {
            speak("Account creation canceled. Please refresh the page to start again.");
        }
    }
    
    
    // After gathering user inputs (name, email, password)
    function confirmSignup() {
        speak("Do you want to create your account? Say 'yes' to confirm.");
    
        listenForConfirmation((confirmation) => {
            if (confirmation === 'yes') {
                const userData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value
                };
    
                fetch('/signup/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: JSON.stringify(userData)
                })
                .then(response => {
                    if (response.ok) {
                        speak("Account created successfully.");
                        window.location.href = "/dashboard/";
                    } else {
                        speak("Error creating account. Please try again.");
                    }
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                    speak("There was a network error. Please try again.");
                });
            } else {
                speak("Account creation canceled.");
            }
        });
    }
    
function listenForConfirmation(callback) {
    // Implement speech recognition logic here to capture 'yes' or 'no' response
    // Once 'yes' is heard, call the callback with the response
    recognition.start();

    recognition.onresult = function (event) {
        const response = event.results[0][0].transcript.trim().toLowerCase();
        callback(response);
    };

    recognition.onerror = function () {
        speak("Sorry, I didn't catch that. Please say yes or no.");
        listenForConfirmation(callback);
    };

}
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


});
