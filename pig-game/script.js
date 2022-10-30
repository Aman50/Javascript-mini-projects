"use strict";

let currentScore;
let totalScores;
let activePlayer;
let isPlaying;

const player0Element = document.querySelector('.player--0');
const player1Element = document.querySelector('.player--1');
const score0Element = document.getElementById('score--0');
const score1Element = document.getElementById('score--1');
const currentScore0Element = document.getElementById('current--0');
const currentScore1Element = document.getElementById('current--1');

const diceElement = document.querySelector('.dice');
const rollDiceBtn = document.querySelector('.btn--roll');
const holdDiceBtn = document.querySelector('.btn--hold');
const newGameBtn = document.querySelector('.btn--new');


const switchPlayer = function () {
    currentScore = 0;
    document.getElementById(`current--${activePlayer}`).textContent
    = currentScore;
    activePlayer = activePlayer == 0 ? 1 : 0;
    player0Element.classList.toggle('player--active');
    player1Element.classList.toggle('player--active');
};

const initGame = function() {
    currentScore = 0;
    totalScores = [0 , 0];
    activePlayer = 0;
    isPlaying = true;
    diceElement.classList.add('hidden');
    player0Element.classList.remove('player--winner');
    player1Element.classList.remove('player--winner');
    player0Element.classList.add('player--active');
    player1Element.classList.remove('player--active');
    score0Element.textContent = totalScores[0];
    score1Element.textContent = totalScores[1];
    currentScore0Element.textContent = currentScore;
    currentScore1Element.textContent = currentScore;
};

rollDiceBtn.addEventListener('click', function() {
    if (!isPlaying) {
        return;
    }
    // Generate a random number between 1 and 6
    const dice = Math.trunc(Math.random() * 6) + 1;

    // Show the dice number on screen
    diceElement.classList.remove('hidden');
    diceElement.setAttribute('src', `dice-${dice}.png`);

    // If the dice number is a 1 switch player; else add it to current score
    if (dice == 1) {
        switchPlayer();
    } else {
        currentScore += dice;
        document.getElementById(`current--${activePlayer}`).textContent
        = currentScore;
    }
});

holdDiceBtn.addEventListener('click', function() {
    if (!isPlaying) {
        return ;
    }
    
    // Add to total score of active user
    totalScores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent = totalScores[activePlayer];
    if (totalScores[activePlayer] >= 100) {
        // If totalScore > 100, declare the user as winner and end game
        document.querySelector(`.player--${activePlayer}`).classList.remove('player--active');
        document.querySelector(`.player--${activePlayer}`).classList.add('player--winner');
        diceElement.classList.add('hidden');
        isPlaying = false;

    } else {
        // Else switch player
        switchPlayer();

    }
});

newGameBtn.addEventListener('click', initGame);


// Main
initGame();

