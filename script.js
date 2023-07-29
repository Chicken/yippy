const wordsContainer = /** @type {HTMLElement} */ (document.getElementById("words"));
const highscoreContainer = /** @type {HTMLElement} */ (document.getElementById("high"));
const previousScoreContainer = /** @type {HTMLElement} */ (document.getElementById("prev"));
const counterContainer = /** @type {HTMLElement} */ (document.getElementById("counter"));
new Audio("pop.ogg");
new Audio("error.wav");

const WORDS = 15;

function restart() {
    wordsContainer.innerHTML = "";
    counterContainer.innerText = `0/${WORDS}`;
    const words = Array(WORDS).fill(0).map(() =>
        String.fromCharCode(...Array(5).fill(0).map(() => 97 + Math.floor(Math.random() * 26)))
    );
    for (const word of words) {
        const wordElement = document.createElement("div");
        wordElement.innerText = word;
        wordsContainer.appendChild(wordElement);
    }
    let startTime = null;
    function handleKeyPress({ key }) {
        if (!startTime) startTime = Date.now();
        const currentKey = words[0][0];
        if (key === " " && words[0].length === 5) return;
        if (key === currentKey) {
            (new Audio("pop.ogg")).play();
            words[0] = words[0].slice(1);
            if (words[0].length) {
                wordsContainer.children[0].innerHTML = words[0];
            } else {
                words.shift();
                counterContainer.innerText = `${WORDS - words.length}/${WORDS}`;
                wordsContainer.removeChild(wordsContainer.children[0]);
            }
            if (!words.length) {
                const endTime = Date.now();
                const wpm = Math.round(WORDS / ((endTime - startTime) / 1000 / 60));
                const highscore = parseInt(localStorage.getItem("high") ?? "0");
                const wpmStr = wpm.toString();
                if (wpm > highscore) {
                    localStorage.setItem("high", wpmStr);
                    highscoreContainer.innerText = wpmStr;
                }
                localStorage.setItem("prev", wpmStr);
                previousScoreContainer.innerText = wpmStr;
                restart();
            }
        } else {
            (new Audio("error.wav")).play();
            document.removeEventListener("keypress", handleKeyPress);
            restart();
        }
    }
    document.addEventListener("keypress", handleKeyPress);
}

highscoreContainer.innerText = localStorage.getItem("high") ?? "0";
previousScoreContainer.innerText = localStorage.getItem("prev") ?? "0";
restart();
