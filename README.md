# Typing Game - Simplified Monkey Type Clone

## Overview
This project is a web-based typing game built using Web Components, designed to be a simplified clone of the popular Monkey Type typing test. It challenges users to type a series of randomly shuffled words within a set time limit, aiming to improve typing speed and accuracy.

The game features a countdown timer, dynamic word generation, and real-time feedback on correct or incorrect keystrokes. It also calculates and displays the user's Words Per Minute (WPM) at the end of each round.

## Features
- **Real-time Typing Test**: Users type a sequence of words, receiving feedback for each character typed.
- **Words Per Minute (WPM)**: Displays the user's WPM based on the number of correct words typed within the time limit.
- **Dynamic Word Generation**: Words are fetched from a `words.json` file, shuffled, and displayed to the user.
- **Responsive Design**: The game adapts to different screen sizes for mobile, tablet, and desktop devices.
- **Game Timer**: The game has a countdown timer, challenging users to type as quickly and accurately as possible before time runs out.
- **Correct/Incorrect Feedback**: Real-time visual feedback highlights correctly typed letters in green, incorrectly typed ones in red, and the current letter being typed in blue.

## Code Structure
- **`index.html`**: Main HTML file where the custom `TypingGame` component is used.
- **`words.json`**: A JSON file containing an array of words that the game will use. Example:
  ```json
  {
    "words": ["hello", "world", "typing", "game", "practice"]
  }
  ```
- **`TypingGame.js`**: Contains the logic for the custom Web Component `TypingGame`. It handles word generation, key press events, game logic, and the timer.
  
## How it Works
- The **TypingGame** class extends `HTMLElement` and is encapsulated within the Shadow DOM for better style encapsulation and isolation.
- Upon initialization, the game fetches a list of words from `words.json`, shuffles them, and dynamically populates the game area with the words.
- The user starts the game by clicking the "Start Game" button, triggering a countdown timer and enabling typing.
- As the user types, the game checks each letter against the current word and provides feedback:
  - Green for correct letters.
  - Red for incorrect letters.
  - Blue for the letter currently being typed.
- The game ends when the timer runs out, and the user's WPM is displayed.

## Customization
- **Styling**: The game features responsive CSS styles that adjust based on the screen size. You can customize the appearance further by editing the styles inside the `<style>` tag within the `TypingGame` component.
- **Words**: Modify `words.json` to change the list of words used in the game. You can add more words to increase the difficulty or change the theme.
  
## Technologies Used
- **Web Components**: The game is built as a custom HTML element using the Web Components API.
- **CSS**: Responsive and styled components for mobile-first design.
- **JavaScript**: Handles game logic, timer, and word management.

## Contributing
Feel free to fork the repository, contribute improvements, or open issues for bug reports and feature requests.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
