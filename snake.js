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
    if (++count < 8) return;
    count = 0;
    // Draw background
    ctx.fillStyle = '#FFF9E3';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Draw grass patches
    drawGrassPatches();
    // Draw grid lines
    drawGridLines();

    // Apply next direction from user input
    dx = nextDx;
    dy = nextDy;

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

    // Draw food (apple)
    drawApple(food.x, food.y);

    // Draw snake
    snake.forEach((segment, i) => {
        if (i === 0) {
            drawSnakeHead(segment.x, segment.y, dx, dy);
        } else {
            drawSnakeBody(segment.x, segment.y);
        }
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
    ctx.fillStyle = '#222';
    ctx.font = '16px Arial';
    ctx.fillText('Score: ' + score, 10, 20);
}

function getRandomDirection(dx, dy) {
    // 4방향 중 현재 진행방향의 반대가 아닌 방향만 선택
    const directions = [
        {dx: grid, dy: 0},   // 오른쪽
        {dx: -grid, dy: 0},  // 왼쪽
        {dx: 0, dy: grid},   // 아래
        {dx: 0, dy: -grid},  // 위
    ];
    // 현재 진행방향의 반대는 제외
    const valid = directions.filter(dir => !(dir.dx === -dx && dir.dy === -dy));
    return valid[Math.floor(Math.random() * valid.length)];
}

// Draw snake head (face)
function drawSnakeHead(x, y, dx, dy) {
    ctx.save();
    ctx.translate(x + grid/2, y + grid/2);
    let angle = 0;
    if (dx === grid) angle = 0;
    else if (dx === -grid) angle = Math.PI;
    else if (dy === grid) angle = Math.PI/2;
    else if (dy === -grid) angle = -Math.PI/2;
    ctx.rotate(angle);
    ctx.fillStyle = '#0f0';
    ctx.beginPath();
    ctx.arc(0, 0, grid/2-1, Math.PI*0.15, Math.PI*1.85, false);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();
    // Eyes
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(grid/6, -grid/6, grid/10, 0, Math.PI*2);
    ctx.arc(grid/6, grid/6, grid/10, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
}

// Draw snake body
function drawSnakeBody(x, y) {
    ctx.fillStyle = '#0f0';
    ctx.fillRect(x, y, grid-2, grid-2);
}

// Draw apple (food)
function drawApple(x, y) {
    ctx.save();
    ctx.translate(x + grid/2, y + grid/2);
    // Apple body
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(0, 0, grid/2-2, 0, Math.PI*2);
    ctx.fill();
    // Apple highlight
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.arc(-grid/6, -grid/6, grid/8, 0, Math.PI*2);
    ctx.fill();
    // Apple stem
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -grid/2+3);
    ctx.lineTo(0, -grid/2+8);
    ctx.stroke();
    ctx.restore();
}

// Draw random grass patches
function drawGrassPatches() {
    // 고정된 위치에 잔디 여러 개
    const grassList = [
        {x: 40, y: 60}, {x: 120, y: 300}, {x: 300, y: 80},
        {x: 200, y: 200}, {x: 350, y: 350}, {x: 70, y: 370}
    ];
    grassList.forEach(pos => drawGrass(pos.x, pos.y));
}

function drawGrass(x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = '#3CB371';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(Math.PI/5*i+Math.PI/2)*8, Math.sin(Math.PI/5*i+Math.PI/2)*12);
        ctx.stroke();
    }
    ctx.restore();
}

function drawGridLines() {
    ctx.save();
    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 1;
    for (let x = grid; x < canvas.width; x += grid) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = grid; y < canvas.height; y += grid) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    ctx.restore();
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
