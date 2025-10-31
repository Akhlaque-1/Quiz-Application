
/* ========== Sample Question Array ========== */
const quesArray = [
  {
    num: 1,
    question: "HTML stands for",
    Option: {
      a: "Hyper Text Markup Language",
      b: "Hyper Text Programming Language",
      c: "High Text Markup Language",
      d: "Hyper Transfer Markup Language",
    },
    answer: "Hyper Text Markup Language",
  },
  {
    num: 2,
    question: "Which type of language is JavaScript?",
    Option: {
      a: "Object-Oriented",
      b: "Object-based",
      c: "Assembly",
      d: "High level",
    },
    answer: "Object-based",
  },
  {
    num: 3,
    question: "The 'function' and 'var' are known as",
    Option: {
      a: "Keywords",
      b: "Data types",
      c: "Declaration statements",
      d: "Prototypes",
    },
    answer: "Declaration statements",
  },
  {
    num: 4,
    question: "Which company developed JavaScript?",
    Option: {
      a: "Netscape",
      b: "Microsoft",
      c: "Google",
      d: "Apple",
    },
    answer: "Netscape",
  },

  {
    num: 5,
    question: "Inside which HTML element do we put the JavaScript?",
    Option: {
      a: "&lt;script&gt;",
      b: "&lt;javascript&gt;",
      c: "&lt;js&gt;",
      d: "&lt;scripting&gt;",
    },
    answer: "a"
  },
  {
    num: 6,
    question: "Which symbol is used for comments in JavaScript?",
    Option: {
      a: "//",
      b: "/* */",
      c: "#",
      d: "&lt;!-- --&gt;",
    },
    answer: "a"
  },
  {
    num: 7,
    question: "Which method is used to write content into an HTML document?",
    Option: {
      a: "document.write()",
      b: "console.log()",
      c: "window.alert()",
      d: "document.output()",
    },
    answer: "a"
  },
  {
    num: 8,
    question: "What is the correct syntax to refer to an external script called 'app.js'?",
    Option: {
      a: "&lt;script href='app.js'&gt;",
      b: "&lt;script name='app.js'&gt;",
      c: "&lt;script src='app.js'&gt;",
      d: "&lt;script file='app.js'&gt;",
    },
    answer: "c"
  },
  {
    num: 9,
    question: "Which operator is used to assign a value to a variable?",
    Option: {
      a: "x",
      b: "-",
      c: "=",
      d: "*",
    },
    answer: "c"
  },
  {
    num: 10,
    question: "How do you create a function in JavaScript?",
    Option: {
      a: "function = myFunction()",
      b: "function myFunction()",
      c: "create myFunction()",
      d: "def myFunction()",
    },
    answer: "b"
  },
];


/* ========== DOM References ========== */
const formCard = document.getElementById("formCard");
const startCard = document.getElementById("startCard");
const quizCard = document.getElementById("quizCard");
const resultCard = document.getElementById("resultCard");

const inpName = document.getElementById("inp_name");
const inpEmail = document.getElementById("inp_email");
const inpRoll = document.getElementById("inp_roll");
const inpInst = document.getElementById("inp-inst");

const paraName = document.getElementById("para-name");
const paraEmail = document.getElementById("para-email");
const paraRoll = document.getElementById("para-roll");

const quesEl = document.getElementById("ques");
const optionsList = document.getElementById("opt");
const optionItems = optionsList.getElementsByTagName("li");

const nextBtn = document.getElementById("nextBtn");
const startQuizBtn = document.getElementById("startQuizBtn");
const submitDetailsBtn = document.getElementById("submitDetails");
const editDetailsBtn = document.getElementById("editDetails");
const quitBtn = document.getElementById("quitBtn");
const retryBtn = document.getElementById("retryBtn");
const downloadResultBtn = document.getElementById("downloadResult");

const ttlqSpan = document.querySelector(".ttlq");
const numbSpan = document.querySelector(".numb");

const resName = document.getElementById("res-name");
const resEmail = document.getElementById("res-email");
const resRoll = document.getElementById("res-roll");
const resInst = document.getElementById("res-inst");

const ttlEl = document.getElementById("ttl");
const raEl = document.getElementById("ra");
const waEl = document.getElementById("wa");
const percEl = document.getElementById("perc");
const defineText = document.getElementById("defineText");

const circularProgress = document.querySelector(".circular-progress");
const progressValue = document.querySelector(".progress-value");

/* ========== State ========== */
let totalQus = quesArray.length;
let corrAns = 0;
let wrngAns = 0;
let counter = 0;
let selected = null;

/* initialize totals */
ttlqSpan.textContent = totalQus;

/* ========== Timer Setup (not started until quiz begins) ========== */
let totalTime = 20 * 60; // seconds
let timerDisplay = document.getElementById("timer");
let timerInterval = null;

/* ========== Event Listeners ========== */
submitDetailsBtn.addEventListener("click", handleSubmitDetails);
startQuizBtn.addEventListener("click", handleStartQuiz);
editDetailsBtn.addEventListener("click", () => {
  startCard.classList.add("hidden");
  formCard.classList.remove("hidden");
});
nextBtn.addEventListener("click", handleNext);
quitBtn.addEventListener("click", () => {
  // go back to start screen
  stopTimer();
  quizCard.classList.add("hidden");
  startCard.classList.remove("hidden");
  resetQuizState(false);
});
retryBtn.addEventListener("click", () => {
  stopTimer();
  resetQuizState(true);
  formCard.classList.remove("hidden");
  resultCard.classList.add("hidden");
});
downloadResultBtn.addEventListener("click", copyResultToClipboard);

/* ========== Functions ========== */

function handleSubmitDetails() {
  if (!inpName.value.trim() || !inpEmail.value.trim() || !inpRoll.value.trim() || !inpInst.value.trim()) {
    alert("Please fill all fields");
    return;
  }

  // Email format check (as you had)
 if (!inpEmail.value.endsWith("@gmail.com")) {
  Swal.fire({
    icon: "error",
    title: "Invalid Email Format",
    text: "Please correct the format of email (should end with '@gmail.com')",
    confirmButtonColor: "#3085d6",
    confirmButtonText: "OK",
  });
  return;
}


  paraName.textContent = inpName.value.trim();
  paraEmail.textContent = inpEmail.value.trim();
  paraRoll.textContent = inpRoll.value.trim();

  formCard.classList.add("hidden");
  startCard.classList.remove("hidden");
}

function handleStartQuiz() {
  // show quiz and start timer
  startCard.classList.add("hidden");
  loadQuestion();
  quizCard.classList.remove("hidden");

  // reset & start timer
  totalTime = 20 * 60;
  updateTimerDisplay(totalTime);
  startTimer();
}

function startTimer() {
  // clear existing interval if any
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    updateTimerDisplay(totalTime);

    totalTime--;

    if (totalTime < 0) {
      clearInterval(timerInterval);
      timerInterval = null;
    //  Replace alert in showResult() with SweetAlert for better UX
      alert("⏰ Time is up! Submitting your quiz automatically...");
      showResult();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function updateTimerDisplay(secondsLeft) {
  if (!timerDisplay) return;
  let minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  // Format as MM:SS (if secondsLeft < 0, show 00:00)
  if (secondsLeft < 0) {
    timerDisplay.textContent = "00:00";
  } else {
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  }
}

function loadQuestion() {
  // reset selected + UI
  selected = null;
  nextBtn.disabled = true;

  // show question
  const q = quesArray[counter];
  quesEl.textContent = q.question;
  numbSpan.textContent = counter + 1;
  ttlqSpan.textContent = totalQus;

  // fill options with A, B, C, D labels
  const optionLabels = ["A", "B", "C", "D"];
  const opts = [q.Option.a, q.Option.b, q.Option.c, q.Option.d];

  for (let i = 0; i < optionItems.length; i++) {
    const li = optionItems[i];
    // reset classes
    li.className = "option";
    // Insert label + text (A. OptionText)
    li.innerHTML = `<strong>${optionLabels[i]}.</strong> ${opts[i] || ""}`;
    li.setAttribute("role", "button");
    li.setAttribute("aria-pressed", "false");
    li.tabIndex = 0;

    // remove previous listeners by cloning node (safe cleanup)
    const newLi = li.cloneNode(true);
    li.parentNode.replaceChild(newLi, li);

    // attach listeners
    newLi.addEventListener("click", () => handleSelect(newLi));
    newLi.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSelect(newLi);
      }
    });
  }

  // hide next button until an option is chosen
  nextBtn.disabled = true;
}

function handleSelect(ele) {
  if (!ele || ele.classList.contains("disabled")) return;

  // userChoice is the option text (without the "A." label)
  // so we need to trim the label before comparing
  const rawText = ele.textContent.trim();
  // rawText like "A. Hyper Text Markup Language" -> remove "A." and trim
  const userChoice = rawText.replace(/^[A-D]\.\s*/, "").trim();

  const correctAnsText = quesArray[counter].answer.trim();

  // mark chosen
  if (userChoice === correctAnsText) {
    ele.classList.add("correct");
    corrAns++;
  } else {
    ele.classList.add("wrong");
    wrngAns++;
    // show correct one
    for (const li of optionsList.children) {
      const liText = li.textContent.replace(/^[A-D]\.\s*/, "").trim();
      if (liText === correctAnsText) {
        li.classList.add("correct");
      }
    }
  }

  // disable others
  for (const li of optionsList.children) {
    li.classList.add("disabled");
    li.setAttribute("aria-pressed", "false");
  }
  ele.setAttribute("aria-pressed", "true");

  // enable next
  nextBtn.disabled = false;
}

function handleNext() {
  counter++;
  if (counter < totalQus) {
    loadQuestion();
  } else {
    showResult();
  }
}

/* Show the results and animate progress circle */
function showResult() {
  // stop timer immediately
  stopTimer();

  quizCard.classList.add("hidden");
  resultCard.classList.remove("hidden");

  // fill user details
  resName.textContent = inpName.value.trim();
  resEmail.textContent = inpEmail.value.trim();
  resRoll.textContent = inpRoll.value.trim();
  resInst.textContent = inpInst.value.trim();

  ttlEl.textContent = totalQus;
  raEl.textContent = corrAns;
  waEl.textContent = wrngAns;

  const percentage = Math.round((corrAns / Math.max(1, totalQus)) * 100);
  percEl.textContent = percentage;

  if (percentage < 60) {
    defineText.textContent = "Sorry, you failed! Try again.";
    defineText.className = "define fail";
  } else {
    defineText.textContent = "Congratulations — you passed!";
    defineText.className = "define pass";
  }

  animateProgress(percentage);

  // hide/reset timer display on result screen (optional)
  if (timerDisplay) timerDisplay.textContent = "00:00";
}

function animateProgress(targetPercent) {
  const start = 0;
  const end = Math.max(1, targetPercent); // ensure at least 1 for animation
  let current = start;
  const speed = 8; // smaller = faster

  // clear any previous transition by setting immediate background
  circularProgress.style.background = `conic-gradient(#e6eef9 0deg, #e6eef9 0deg)`;
  progressValue.textContent = `${current}%`;

  const timer = setInterval(() => {
    current++;
    progressValue.textContent = `${current}%`;
    // convert percent to degrees (360 * percent/100)
    circularProgress.style.background = `conic-gradient(var(--accent) ${(current * 3.6)}deg, #e6eef9 0deg)`;

    if (current >= end) clearInterval(timer);
  }, speed);
}

/* Reset quiz state for retry or quit */
function resetQuizState(resetScores = true) {
  if (resetScores) {
    corrAns = 0;
    wrngAns = 0;
  }
  counter = 0;
  selected = null;
  // reset UI
  nextBtn.disabled = true;
  progressValue.textContent = `0%`;
  circularProgress.style.background = `conic-gradient(#e6eef9 0deg, #e6eef9 0deg)`;
  ttlqSpan.textContent = totalQus;

  // reset timer
  stopTimer();
  totalTime = 20 * 60;
  updateTimerDisplay(totalTime);
}

/* copy result text to clipboard */
function copyResultToClipboard() {
  const text = `Quiz Result for ${inpName.value.trim() || 'Student'}:
Total: ${totalQus}, Correct: ${corrAns}, Wrong: ${wrngAns}, Percentage: ${percEl.textContent}%`;
  navigator.clipboard?.writeText(text).then(() => {
    alert("Result copied to clipboard!");
  }).catch(() => {
    alert("Could not copy automatically. Here's the result:\n\n" + text);
  });
}

/* optional helper to open external link */
function foo() {
  window.location.href = "https://www.google.com/";
}

/* initial setup */
resetQuizState(false);
