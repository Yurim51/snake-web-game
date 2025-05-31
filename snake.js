const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const grid = 20;
let count = 0;
let snake = [{x: 160, y: 200}];
let dx = grid;
let dy = 0;
let nextDx = grid;
let nextDy = 0;
let food = { x: 320, y: 200 };
let score = 0;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function resetGame() {
    snake = [{x: 160, y: 200}];
    dx = grid;
    dy = 0;
    nextDx = grid;
    nextDy = 0;
    food = { x: getRandomInt(0, 20) * grid, y: getRandomInt(0, 20) * grid };
    score = 0;
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    if (++count < 4) return;
    count = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply next direction only if not reversing
    if ((nextDx !== -dx || nextDy !== -dy) && (nextDx !== 0 || nextDy !== 0)) {
        dx = nextDx;
        dy = nextDy;
    }

    // Move snake
    let head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score++;
        food.x = getRandomInt(0, 20) * grid;
        food.y = getRandomInt(0, 20) * grid;
    } else {
        snake.pop();
    }

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, grid-2, grid-2);

    // Draw snake
    ctx.fillStyle = '#0f0';
    snake.forEach((segment, i) => {
        ctx.fillRect(segment.x, segment.y, grid-2, grid-2);
        // Check collision with self
        if (i !== 0 && segment.x === head.x && segment.y === head.y) {
            resetGame();
        }
    });

    // Check wall collision
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        resetGame();
    }

    // Draw score
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText('Score: ' + score, 10, 20);
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft' && dx !== grid) {
        nextDx = -grid; nextDy = 0;
    } else if (e.key === 'ArrowUp' && dy !== grid) {
        nextDx = 0; nextDy = -grid;
    } else if (e.key === 'ArrowRight' && dx !== -grid) {
        nextDx = grid; nextDy = 0;
    } else if (e.key === 'ArrowDown' && dy !== -grid) {
        nextDx = 0; nextDy = grid;
    }
});

gameLoop();
