// board
let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

// players
let playerWidth = 10;
let playerHeight = 50;
let playerVelocityY = 3;

let player1 = {
    x: 10,
    y: boardHeight / 2,
    width: playerWidth,
    height: playerHeight,
    isMovingUp: false,
    isMovingDown: false,
}

let player2 = {
    x: boardWidth - playerWidth - 10,
    y: boardHeight / 2,
    width: playerWidth,
    height: playerHeight,
    isMovingUp: false,
    isMovingDown: false,
}

// ball
let ballWidth = 10;
let ballHeight = 10;
let ball = createBall(boardWidth / 2, boardHeight / 2, 1, 2);

let player1Score = 0;
let player2Score = 0;

let maxScore = 2; // Set the maximum score for the game

let resetKeyPressed = false; // Variable to track if the reset key is pressed

// Initialize the game with player names
function initGame(player1Name, player2Name) {
    player1.name = player1Name;
    player2.name = player2Name;

    window.onload = function () {
        board = document.getElementById("board");
        board.height = boardHeight;
        board.width = boardWidth;
        context = board.getContext("2d");

        // Start the game loop
        requestAnimationFrame(update);

        // Add event listeners for player movement and reset key
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);
    };
}

// Main game loop
function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    moveAndDrawPlayer(player1);
    moveAndDrawPlayer(player2);

    moveAndDrawBall();

    handleBallCollision();

    updateScores();

    drawMiddleLine();

    // Check for game over and reset only when the reset key is pressed
    if ((player1Score >= maxScore || player2Score >= maxScore) && resetKeyPressed) {
        endGame();
    }

    // Reset the key flag after each frame
    resetKeyPressed = false;
}

// Move and draw player
function moveAndDrawPlayer(player) {
    context.fillStyle = "#87ceeb";

    if (player.isMovingUp && player.y > 0) {
        player.y -= playerVelocityY;
    }

    if (player.isMovingDown && player.y + player.height < boardHeight) {
        player.y += playerVelocityY;
    }

    context.fillRect(player.x, player.y, player.width, player.height);
}

// Move and draw ball
function moveAndDrawBall() {
    context.fillStyle = "#fff";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);
}

// Handle ball collision with walls and paddles
function handleBallCollision() {
    if (ball.y <= 0 || ball.y + ball.height >= boardHeight) {
        ball.velocityY = -ball.velocityY;
    }

    if (detectCollision(ball, player1) || detectCollision(ball, player2)) {
        ball.velocityX = -ball.velocityX;
    }

    // Check if the ball is out of bounds
    if (ball.x < 0) {
        player2Score++;
        resetGame(1);
    } else if (ball.x + ball.width > boardWidth) {
        player1Score++;
        resetGame(-1);
    }
}

// Draw the dotted line in the middle of the board
function drawMiddleLine() {
    for (let i = 10; i < board.height; i += 25) {
        context.fillRect(board.width / 2 - 10, i, 5, 5);
    }
}

// Check if the player is out of bounds
function outOfBounds(yPosition) {
    return yPosition < 0 || yPosition + playerHeight > boardHeight;
}

// Handle keydown event for player movement and reset
function handleKeyDown(e) {
    // Player 1
    if (e.code === "KeyW") {
        player1.isMovingUp = true;
    } else if (e.code === "KeyS") {
        player1.isMovingDown = true;
    }

    // Player 2
    if (e.code === "ArrowUp") {
        player2.isMovingUp = true;
    } else if (e.code === "ArrowDown") {
        player2.isMovingDown = true;

        // Check for the reset key ('R')
    } else if (e.code === "KeyR") {
        resetKeyPressed = true;
    }
}

// Handle keyup event to stop player movement
function handleKeyUp(e) {
    // Player 1
    if (e.code === "KeyW") {
        player1.isMovingUp = false;
    } else if (e.code === "KeyS") {
        player1.isMovingDown = false;
    }

    // Player 2
    if (e.code === "ArrowUp") {
        player2.isMovingUp = false;
    } else if (e.code === "ArrowDown") {
        player2.isMovingDown = false;
    }
}

// Detect collision between ball and player
function detectCollision(ball, player) {
    return ball.x < player.x + player.width &&
        ball.x + ball.width > player.x &&
        ball.y < player.y + player.height &&
        ball.y + ball.height > player.y;
}

// Reset the game with a given direction for the ball
function resetGame(direction) {
    ball = createBall(boardWidth / 2, boardHeight / 2, direction, 2);
}

// Helper function to create a ball object
function createBall(x, y, velocityX, velocityY) {
    return {
        x: x,
        y: y,
        width: ballWidth,
        height: ballHeight,
        velocityX: velocityX,
        velocityY: velocityY,
    };
}

// End the game and reset scores
function endGame() {
    player1Score = 0;
    player2Score = 0;
    resetGame(1); // Set the direction for the next round
}

// Update and display scores
function updateScores() {
    context.font = "20px sans-serif";
    context.fillText(`${player1.name}: ${player1Score}`, boardWidth / 5, 25);
    context.fillText(`${player2.name}: ${player2Score}`, boardWidth * 4 / 5 - 125, 25);

    // Redirect to result.html when a player wins
    if (player1Score >= maxScore || player2Score >= maxScore) {
        const winner = (player1Score >= maxScore) ? player1.name : player2.name;
        setTimeout(() => {
            window.location.href = `result.html?winner=${encodeURIComponent(winner)}&player1=${encodeURIComponent(player1.name)}&player2=${encodeURIComponent(player2.name)}`;
        }, 2000); // Redirect after 2 seconds (adjust the delay as needed)
    }
}

// Show result on the result page
function showResult(winner) {
    const resultText = document.getElementById("resultText");
    if (!resultText) return;

    resultText.innerText = `${winner} wins!`;

    // Display player names and scores
    resultText.insertAdjacentHTML(
        "beforeend",
        `<p>${player1.name}: ${player1Score}</p><p>${player2.name}: ${player2Score}</p>`
    );

    // Redirect to result.html after a brief delay
    setTimeout(() => {
        window.location.href = `result.html?winner=${encodeURIComponent(winner)}&player1=${encodeURIComponent(player1.name)}&player2=${encodeURIComponent(player2.name)}&score1=${encodeURIComponent(player1Score)}&score2=${encodeURIComponent(player2Score)}`;
    }, 2000); // Redirect after 2 seconds (adjust the delay as needed)
}


