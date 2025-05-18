// Speech APIs
const synth = window.speechSynthesis;
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let email = "";
let password = "";

function speak(text, callback) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.onend = callback;
  synth.speak(utter);
}

function listen(callback) {
  recognition.start();
  recognition.onresult = (event) => {
    const result = event.results[0][0].transcript.toLowerCase().trim();
    callback(result);
  };
}

function startLoginProcess() {
  speak("Please say your Email ID", () => {
    listen((userEmail) => {
      email = userEmail.replace(/\s+/g, '').replace('at', '@').replace('dot', '.');
      speak(`You said ${email}. Is that correct? Say Yes or No.`, () => {
        listen((response) => {
          if (response.includes("yes")) {
            document.getElementById("email").value = email;
            askPassword();
          } else {
            startLoginProcess(); // Restart if wrong
          }
        });
      });
    });
  });
}

function askPassword() {
  speak("Please spell your password one character at a time. Say 'Done' when finished.", () => {
    password = "";
    collectPasswordChars();
  });
}

function collectPasswordChars() {
  listen((char) => {
    if (char === "done") {
      speak(`You said password as ${password}. Is that correct? Say Yes or No.`, () => {
        listen((confirmation) => {
          if (confirmation.includes("yes")) {
            document.getElementById("password").value = password;
            finalConfirm();
          } else {
            askPassword(); // Retry password
          }
        });
      });
    } else {
      password += char;
      collectPasswordChars(); // Keep collecting
    }
  });
}

function finalConfirm() {
  speak("Do you want to sign in with the provided details? Say Yes to continue or No to restart.", () => {
    listen((decision) => {
      if (decision.includes("yes")) {
        document.getElementById("signin-form").submit();
      } else {
        startLoginProcess();
      }
    });
  });window.onload = () => {
  startLoginProcess(); // Auto-start on page load
};

const synth = window.speechSynthesis;
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let email = "";
let password = "";

function speak(text, callback) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.onend = callback;
  synth.speak(utterance);
}

function listen(callback) {
  recognition.start();
  recognition.onresult = (event) => {
    const result = event.results[0][0].transcript.toLowerCase().trim();
    callback(result);
  };
}

function startLoginProcess() {
  speak("Welcome to the Talking Mailbox. Please say your Email ID", () => {
    listen((userEmail) => {
      email = userEmail.replace(/\s+/g, '').replace('at', '@').replace('dot', '.');
      speak(`You said ${email}. Is that correct? Say Yes or No.`, () => {
        listen((confirmation) => {
          if (confirmation.includes("yes")) {
            document.getElementById("email").value = email;
            askPassword();
          } else {
            startLoginProcess();
          }
        });
      });
    });
  });
}

function askPassword() {
  speak("Now please spell your password. Say one character at a time. Say Done when finished.", () => {
    password = "";
    collectPasswordCharacters();
  });
}

function collectPasswordCharacters() {
  listen((char) => {
    if (char === "done") {
      speak(`You said password as ${password}. Is this correct? Say Yes or No.`, () => {
        listen((confirmation) => {
          if (confirmation.includes("yes")) {
            document.getElementById("password").value = password;
            confirmAndSubmit();
          } else {
            askPassword();
          }
        });
      });
    } else {
      password += char;
      collectPasswordCharacters();
    }
  });
}

function confirmAndSubmit() {
  speak("Do you want to proceed and sign in with these credentials? Say Yes to continue or No to restart.", () => {
    listen((finalConfirm) => {
      if (finalConfirm.includes("yes")) {
        document.getElementById("signin-form").submit();
      } else {
        startLoginProcess();
      }
    });
  });
}

}
