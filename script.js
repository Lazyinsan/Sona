// Constants
const PLAYER_X = 'X';
const PLAYER_O = 'O';
const EMPTY = ' ';

// Variables
let board = Array(9).fill(EMPTY);
let currentPlayer = PLAYER_X;
let gameMode = 'player'; // Default: Two-player mode
let gameOver = false;

// Get DOM elements
const cells = document.querySelectorAll('.cell');
const statusDiv = document.getElementById('status');
const resetButton = document.getElementById('reset');
const modeSelect = document.getElementById('gameMode');
const congratulationsDiv = document.getElementById('congratulations');

// Add event listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
modeSelect.addEventListener('change', () => {
    gameMode = modeSelect.value;
    resetGame();
});

// Handle cell click
function handleCellClick(event) {
    const index = event.target.getAttribute('data-index');

    if (board[index] !== EMPTY || gameOver) return;

    // Update board and display move
    board[index] = currentPlayer;
    event.target.textContent = currentPlayer;

    // Check for a winner
    if (checkWinner(currentPlayer)) {
        gameOver = true;
        showCongratulations(currentPlayer);
        return;
    }

    // Check for draw
    if (board.every(cell => cell !== EMPTY)) {
        gameOver = true;
        statusDiv.textContent = "It's a draw!";
        return;
    }

    // Switch player
    currentPlayer = (currentPlayer === PLAYER_X) ? PLAYER_O : PLAYER_X;

    // If AI's turn (Player O), trigger AI move
    if (gameMode === 'ai' && currentPlayer === PLAYER_O && !gameOver) {
        setTimeout(aiMove, 500);
    }
}

// AI Move using Minimax algorithm
function aiMove() {
    const bestMove = findBestMove(board);
    board[bestMove] = PLAYER_O;
    cells[bestMove].textContent = PLAYER_O;

    // Check for winner or draw
    if (checkWinner(PLAYER_O)) {
        gameOver = true;
        showCongratulations(PLAYER_O);
        return;
    }
    if (board.every(cell => cell !== EMPTY)) {
        gameOver = true;
        statusDiv.textContent = "It's a draw!";
        return;
    }

    // Switch back to Player X
    currentPlayer = PLAYER_X;
}

// Minimax algorithm to find the best move for AI
function minimax(board, depth, isMaximizing) {
    if (checkWinner(PLAYER_X)) return -10 + depth;
    if (checkWinner(PLAYER_O)) return 10 - depth;
    if (board.every(cell => cell !== EMPTY)) return 0;

    let best = isMaximizing ? -Infinity : Infinity;

    for (let i = 0; i < 9; i++) {
        if (board[i] === EMPTY) {
            board[i] = isMaximizing ? PLAYER_O : PLAYER_X;
            let score = minimax(board, depth + 1, !isMaximizing);
            board[i] = EMPTY;
            best = isMaximizing ? Math.max(best, score) : Math.min(best, score);
        }
    }
    return best;
}

function findBestMove(board) {
    let bestVal = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
        if (board[i] === EMPTY) {
            board[i] = PLAYER_O;
            let moveVal = minimax(board, 0, false);
            board[i] = EMPTY;

            if (moveVal > bestVal) {
                bestMove = i;
                bestVal = moveVal;
            }
        }
    }
    return bestMove;
}

// Check if a player has won
function checkWinner(player) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return winningCombinations.some(combination => {
        return combination.every(index => board[index] === player);
    });
}

// Show Congratulations and trigger flower animation
function showCongratulations(winner) {
    congratulationsDiv.classList.remove('hidden');
    statusDiv.textContent = `${winner} wins!`;

    // Flower animation effect
    setTimeout(() => {
        congratulationsDiv.style.opacity = 1;
    }, 200);
}

// Reset the game
function resetGame() {
    board = Array(9).fill(EMPTY);
    gameOver = false;
    currentPlayer = PLAYER_X;
    cells.forEach(cell => cell.textContent = '');
    statusDiv.textContent = '';
    congratulationsDiv.classList.add('hidden');
}
