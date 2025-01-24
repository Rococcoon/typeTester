class TypingGame extends HTMLElement {
  constructor() {
    super();
    
    // Attach a shadow DOM to the element
    this.attachShadow({ mode: 'open' });
    
    // Initialize game state variables
    this.startTime = 30;
    this.timer = 30;
    this.wordIndex = 0;
    this.letterIndex = 0;
    this.lineIndex = 0;
    this.lineLetterIndex = 0;
    this.wordLetterIndex = 0;
    
    this.words = [];

    this.screenWidth = this.getWindowWidth();
    this.letterDivs = [];
    this.wordDivs = [];

    // Create shadow DOM content (styles and structure)
    this.shadowRoot.innerHTML = `
      <style>
        /* Add your CSS styles here */

        #gameContainer {
          align-items: center;
          display: flex;
          flex-direction: column;
          gap: 48px;
          justify-content: center;
        }

        /* Mobile (xsm) */
        @media (min-width: 0px) {
          #inputContainer {
            height: 132px;
            width: 275px;
          }

          .letter {
            width: 15px;
          }
        }

        /* Small (sm) */
        @media (min-width: 640px) {
          #inputContainer {
            height: 132px;
            width: 550px;
          }

          .letter {
            width: 16.5px;
          }
        }

        /* Medium (md) */
        @media (min-width: 768px) {
          #inputContainer {
            height: 132px;
            width: 750px;
          }

          .letter {
            width: 18px;
          }
        }

        /* Large (lg) */
        @media (min-width: 1024px) {
          #inputContainer {
            height: 132px;
            width: 950px;
          }

          .letter {
            width: 20px;
          }
        }

        #inputContainer {
          display: flex;
          flex-wrap: wrap;
          filter: blur(5px);
          overflow-x: hidden;
          overflow-y: hidden;
          outline: none;
          transition: filter 0.3s ease;
        }

        #inputContainer:focus {
          display: flex;
          filter: none;
          flex-wrap: wrap;
          overflow-x: hidden;
          overflow-y: hidden;
          outline: none;
        }

        .word {
          display: flex;
        }

        .letter {
          border-radius: 3px;
          display: inline-block;
          font-size: 1.5rem;
          padding: 0px 3px;
          transition: background-color 0.4s;
          white-space: pre;
        }

        .letter.focused {
          background-color: #00ffa3;
          color: #121212;
        }

        .letter.incorrect {
          color: #ff6161;
        }

        .letter.correct {
          color: #00e4ff;
        }

        .scrollButton {
          display: none;
        }

        /* Start button styles */
        #comic-button {
          display: inline-block;
          padding: 10px 20px;
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          text-decoration: none;
          color: #fff;
          background-color: #ff5252;
          border: 2px solid #000;
          border-radius: 10px;
          box-shadow: 5px 5px 0px #000;
          transition: all 0.3s ease;
          cursor: pointer;
          opacity: 1;
        }

        #comic-button:hover {
          background-color: #fff;
          color: #ff5252;
          border: 2px solid #ff5252;
          box-shadow: 5px 5px 0px #ff5252;
        }

        #comic-button:active {
          background-color: #fcf414;
          box-shadow: none;
          transform: translateY(4px);
        }

        #comic-button.hidden {
          opacity: 0;
        }

        /* TIMER STYLES BABY */

        #timer {
          font-size: 36px;
          opacity: 0;
          transition: all 0.3s ease;
        }

        #timer.active {
          opacity: 1;
        }

        #wpmContainer {
          font-size: 1.5rem;
          opacity: 0;
          transition: all 0.3 ease;
        }
        
        #wpmContainer.active {
          opacity: 1;
        }
      </style>

      <div id="gameContainer">
        <div id="wpmContainer">WPM:</div>
        <div id="timer" class="timer">30</div>

        <div id="inputContainer" tabindex="-1">
          <!-- Game content will be dynamically inserted here -->
        </div>

        <button id="comic-button">Start Game</button>
      </div>
    `;
  }

  async connectedCallback() {
    try {
      await this.fetchWords();
    } catch(error) {
      console.error("error fetching words:", error);
    }

    this.startButton = this.shadowRoot.querySelector("#comic-button");
    this.inputContainer = this.shadowRoot.querySelector("#inputContainer");
    this.gameContainer = this.shadowRoot.querySelector("#gameContainer");
    this.timerDiv = this.shadowRoot.querySelector("#timer");
    this.wpmDiv = this.shadowRoot.querySelector("#wpmContainer");

    this.startButton.addEventListener("click", () => this.startGame());
    this.inputContainer.addEventListener("keydown", (event) =>
      this.handleKeyPress(event)
    );
    this.inputContainer.addEventListener("mousedown", (event) => {
      event.preventDefault();
    });
    
    this.initWords(this.words);
  }

  async fetchWords() {
    try {
      const response = await fetch("./words.json");
      const data = await response.json();
      this.words = data.words;
    } catch(error) {
      console.error("err fetch worfd, in fetchwords func:", error);
    }
  }

  shuffleWords() {
    const shuffledWords = [...this.words];

    for (let i = shuffledWords.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));

      [shuffledWords[i], shuffledWords[randomIndex]] = [shuffledWords[randomIndex], shuffledWords[i]];
    }

    return shuffledWords;
  }

  initWords(words) {
    const shuffledWords = this.shuffleWords(words)
    this.populateWords(shuffledWords);
  }

  populateWords(shuffledWords) {
    const inputContainer = this.inputContainer;

    shuffledWords.forEach((word) => {
      const wordDiv = document.createElement("div");
      wordDiv.classList.add("word");

      // Loop through the letters of the word
      for (let i = 0; i <= word.length; i++) {
        const letterDiv = document.createElement('div');
        letterDiv.classList.add('letter');
        if (i === word.length) {
          letterDiv.textContent = " ";
        } else {
          letterDiv.textContent = word[i];
        }
        wordDiv.appendChild(letterDiv);
      }

      inputContainer.appendChild(wordDiv);
    });

    // Reinitialize letterDivs & wordDivs after populating
    this.letterDivs = this.shadowRoot.querySelectorAll(".letter");
    this.wordDivs = this.shadowRoot.querySelectorAll(".word");
    this.highlightLetter();
  }

  clearInputContainer() {
    while (this.inputContainer.firstChild) {
      this.inputContainer.removeChild(this.inputContainer.firstChild);
    }
  }

  highlightLetter() {
    if (this.letterIndex !== 0) {
      this.letterDivs[this.letterIndex--].classList.remove("focused");
      this.letterDivs[this.letterIndex++].classList.remove("focused");
    }

    // Add focus to the current letter
    this.letterDivs[this.letterIndex].classList.add("focused");
  }

  handleKeyPress(event) {
    const key = event.key;

    if (key === "Tab") {
      event.preventDefault();
    }

    if (this.letterDivs[this.letterIndex].textContent === " ") {
      if (this.shouldScroll()) {
        this.lineLetterIndex = 0;
        if (this.lineIndex !== 0) {
          this.scrollUpHiddenContent(this.inputContainer);
        }
        this.lineIndex++;
      }
    }

    if (key === "Backspace") {
      if (this.letterIndex !== 0) {
        if (this.letterDivs[this.letterIndex - 1].textContent === "_") {
          this.letterDivs[this.letterIndex - 1].textContent = " ";
        }
        this.letterDivs[this.letterIndex].classList.remove(
          "focused", "correct", "incorrect"
        );
        this.letterDivs[this.letterIndex - 1].classList.remove(
          "focused", "correct", "incorrect"
        );
        this.letterIndex--;
        this.lineLetterIndex--;
        if (this.wordLetterIndex === 0 && this.letterIndex !== 0 && 
            this.wordIndex !== 0) {
          this.wordLetterIndex = this.wordDivs[this.wordIndex - 1]
            .querySelectorAll('.letter').length - 1;
          this.wordIndex--;
        } else {
          this.wordLetterIndex--;
        }
      }
    } else if (key === this.letterDivs[this.letterIndex].textContent) {
      this.letterDivs[this.letterIndex].classList.add("correct");
      this.letterIndex++;
      this.lineLetterIndex++;
      if ((this.wordLetterIndex + 1) === 
        this.wordDivs[this.wordIndex].querySelectorAll('.letter').length) {
        this.wordLetterIndex = 0;
        this.wordIndex++;
      } else {
        this.wordLetterIndex++;
      }
    } else {
      if (this.letterDivs[this.letterIndex].textContent === " ") {
        this.letterDivs[this.letterIndex].textContent = "_";
      }
      this.letterDivs[this.letterIndex].classList.add("incorrect");
      this.letterIndex++;
      this.lineLetterIndex++;
      if ((this.wordLetterIndex + 1) === this.wordDivs[this.wordIndex]
        .querySelectorAll('.letter').length) {
        this.wordLetterIndex = 0;
        this.wordIndex++;
      } else {
        this.wordLetterIndex++;
      }
    }

    this.highlightLetter();
  }

  scrollBack(element) {
    element.scrollTop -= window.getComputedStyle(this.inputContainer).height;
  }

  scrollUpHiddenContent(element) {
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;
    const scrollTop = element.scrollTop;
    let scrollAmount;

    const maxScroll = scrollHeight - clientHeight - scrollTop;

    scrollAmount = Math.min(33, maxScroll);

    element.scrollTop += scrollAmount;
  }

  shouldScroll() {
    const nextWordArray = this.wordDivs[this.wordIndex + 1]
      .querySelectorAll('.letter');
    const nextWordLength = nextWordArray.length;
    const letterDivWidth = this.letterDivs[0].offsetWidth;
    const inputContainerWidth = this.inputContainer.offsetWidth;

    return this.lineLetterIndex + nextWordLength >= inputContainerWidth /
      letterDivWidth;
  }

  startGame() {
    this.gameContainer.setAttribute("tabindex", 1);
    if (this.startButton) {
      this.startButton.classList.add("hidden");
    }

    if (this.timerDiv) {
      this.timerDiv.classList.add("active");
      this.timer = this.startTime;
      this.timerDiv.textContent = this.startTime;
    }

    this.wpmDiv.classList.remove("active");

    this.inputContainer.focus();
    this.startTimer();
  }

  startTimer() {
    this.timerDiv.textContent = this.timer;
    const countDown = setInterval(() => {
      this.timerDiv.textContent = this.timer;
      this.timer--;

      if (this.timer < 0) {
        clearInterval(countDown);
        this.resetGame();
      }
    }, 1000);
  }

  resetGame() {
    const wpm = this.calculateWPM();
    this.wpmDiv.textContent = `Words Per Minute: ${wpm}`;

    this.timerDiv.textContent = "Time's up!";
    this.startButton.classList.remove("hidden");
    this.inputContainer.blur();
    this.wordIndex = 0;
    this.letterIndex = 0;
    this.lineIndex = 0;
    this.lineLetterIndex = 0;
    this.wordLetterIndex = 0;
    this.letterDivs.forEach((letter) => {
      letter.classList.remove("focused", "correct", "incorrect");
      if (letter.textContent === "_") {
        letter.textContent = " ";
      }
    });
    this.scrollBack(this.inputContainer);
    this.wpmDiv.classList.add("active");

    this.clearInputContainer();
    this.initWords();
    this.highlightLetter();
  }

  calculateWPM() {
    let correctLetterCount = 0;
    this.letterDivs.forEach((letter) => {
      if (letter.classList.contains("correct")) {
        correctLetterCount++;
      }
    })
    const timeInSeconds = this.startTime;

    return Math.floor((correctLetterCount / 5) * (60 / timeInSeconds));
  }

  getWindowWidth() {
    return window.innerWidth;
  }
}

// Define the custom element
customElements.define('typing-game', TypingGame);
