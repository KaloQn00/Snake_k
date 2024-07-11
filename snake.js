const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;
let score = 0;
let highScores = [];

// Load the eating sound
const eatSound = new Audio('eat.mp3');

// Load the apple, snake head, and snake body images
const appleImg = document.getElementById('apple');
const snakeHeadImg = document.getElementById('snakeHead');
const snakeBodyImg = document.getElementById('snakeBody');

// Initialize snake and food (moved initialization outside functions)
let snake = [
    { x: 10 * box, y: 10 * box }, // Head initially at (10, 10)
    { x: 9 * box, y: 10 * box }, // Body segment 1 at (9, 10)
    { x: 8 * box, y: 10 * box }  // Body segment 2 at (8, 10)
];

let food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
};

// Initialize the direction
let d = 'RIGHT';

// Control the snake's direction
document.addEventListener('keydown', direction);

function direction(event) {
    if (event.keyCode === 37 && d !== 'RIGHT') {
        d = 'LEFT';
    }
    if (event.keyCode === 38 && d !== 'DOWN') {
        d = 'UP';
    }
    if (event.keyCode === 39 && d !== 'LEFT') {
        d = 'RIGHT';
    }
    if (event.keyCode === 40 && d !== 'UP') {
        d = 'DOWN';
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the food using the apple image
    ctx.drawImage(appleImg, food.x, food.y, box, box);

    // Draw the snake
    for (let i = 0; i < snake.length; i++) {
        if (i === 0) {
            // Draw the snake head using the image
            ctx.drawImage(snakeHeadImg, snake[i].x, snake[i].y, box, box);
        } else {
            // Draw the snake body using the image
            ctx.drawImage(snakeBodyImg, snake[i].x, snake[i].y, box, box);
        }
    }

    // Move the snake
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d === 'LEFT') snakeX -= box;
    if (d === 'UP') snakeY -= box;
    if (d === 'RIGHT') snakeX += box;
    if (d === 'DOWN') snakeY += box;

    // Add new head to the snake
    const newHead = { x: snakeX, y: snakeY };
    snake.unshift(newHead);

    // Check if the snake ate the food
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score++;
        eatSound.play(); // Play sound
        food = {
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box
        };
    } else {
        snake.pop();
    }

    // Check for collisions
    if (
        snake[0].x < 0 || snake[0].x >= canvas.width ||
        snake[0].y < 0 || snake[0].y >= canvas.height ||
        collision(snake[0], snake.slice(1))
    ) {
        // Game over logic
        clearInterval(game);

        // Save score to high scores
        saveHighScore(score);

        // Show leaderboard
        showLeaderboard();

        // Show reset button
        const resetButton = document.getElementById('resetButton');
        resetButton.style.display = 'block';
        
        return; // Exit draw function to prevent restarting game loop
    }

    // Draw the score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function saveHighScore(score) {
    highScores.push(score);
    highScores.sort((a, b) => b - a); // Sort scores in descending order
    if (highScores.length > 5) {
        highScores.pop(); // Keep only the top 5 scores
    }
}

function showLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = '';
    highScores.forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = `#${index + 1}: ${score}`;
        leaderboardList.appendChild(li);
    });

    const leaderboard = document.getElementById('leaderboard');
    leaderboard.style.display = 'block';
}

// Reset game function
function resetGame() {
    // Reset necessary variables
    score = 0;
    snake = [
        { x: 10 * box, y: 10 * box }, // Head initially at (10, 10)
        { x: 9 * box, y: 10 * box }, // Body segment 1 at (9, 10)
        { x: 8 * box, y: 10 * box }  // Body segment 2 at (8, 10)
    ];
    d = 'RIGHT';

    // Hide reset button
    const resetButton = document.getElementById('resetButton');
    resetButton.style.display = 'none';

    // Clear the previous interval and start a new game loop
    clearInterval(game);
    game = setInterval(draw, 100);
}

// Event listener for reset button
const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', resetGame);

// Event listener for play button
const playButton = document.getElementById('playButton');
playButton.addEventListener('click', startGame);

function startGame() {
    // Hide play button
    playButton.style.display = 'none';

    // Start game loop
    game = setInterval(draw, 100);
}

// Initial game loop (not started until Play button is clicked)
let game;
