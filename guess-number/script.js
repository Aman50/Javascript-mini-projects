"use strict";

let secretNumber = Math.trunc(Math.random()*20) + 1;
let score = 20;
let highScore = 0;

const inputElement = document.querySelector('.guess');
const checkButtonElement = document.querySelector('.check');
const messageElement = document.querySelector('.message');
const numberElement = document.querySelector('.number');
const scoreElement = document.querySelector('.score');
const againButtonElement = document.querySelector('.again');
const highScoreElement = document.querySelector('.highscore');

scoreElement.textContent = score;


checkButtonElement.addEventListener('click', function () {
    const val = Number(inputElement.value);
    console.log(val);

    if (!val) { // 0 is also a Falsy value
        messageElement.textContent = "Enter a number!";
    } else if (val === secretNumber) {
        messageElement.textContent = "Correct! You won!!";
        document.querySelector('body').style.backgroundColor = "#60b347";
        numberElement.style.width = "30rem";

        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
        }
    } else {
        if (score > 0) {
            if (score == 1) {
                messageElement.textContent = "Game over!";
            } else {
                messageElement.textContent =
                val > secretNumber ? "Too High" : "Too Low!";
            }
            score--;
            scoreElement.textContent = score;
        }
    }
});

againButtonElement.addEventListener('click', resetGame);

function resetGame() {
    secretNumber = Math.trunc(Math.random()*20) + 1;
    score = 20;

    numberElement.textContent = "?";
    messageElement.textContent = "Start guessing...";
    scoreElement.textContent = score;
    inputElement.value = "";
    document.body.style.removeProperty('background-color');
    numberElement.style.removeProperty('width');
}