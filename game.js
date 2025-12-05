const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreText = document.getElementById("score");
const gameOverText = document.getElementById("gameOver");

let score = 0;
let gameRunning = true;
let playerX = 180;

let moveLeft = false;
let moveRight = false;

// --- CONTROL PLAYER ---
document.addEventListener("keydown", (e) => {
  if (!gameRunning) return;

  if (e.key === "ArrowLeft") moveLeft = true;
  if (e.key === "ArrowRight") moveRight = true;
  if (e.key === " ") shoot();
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") moveLeft = false;
  if (e.key === "ArrowRight") moveRight = false;
});

// --- UPDATE PLAYER POSITION (SMOOTH) ---
function updatePlayer() {
  if (moveLeft && playerX > 0) {
    playerX -= 5;
  }
  if (moveRight && playerX < 360) {
    playerX += 5;
  }

  player.style.left = playerX + "px";
  requestAnimationFrame(updatePlayer);
}
updatePlayer();

// --- SHOOT ---
function shoot() {
  const bullet = document.createElement("div");
  bullet.classList.add("bullet");
  bullet.style.left = playerX + 15 + "px";
  bullet.style.bottom = "50px";
  game.appendChild(bullet);

  let bulletSpeed = setInterval(() => {
    let bottom = parseInt(bullet.style.bottom);
    if (bottom > 600) {
      bullet.remove();
      clearInterval(bulletSpeed);
    } else {
      bullet.style.bottom = bottom + 10 + "px";
      checkHit(bullet);
    }
  }, 20);
}

// --- ENEMY ---
function spawnEnemy() {
  if (!gameRunning) return;

  const enemy = document.createElement("div");
  enemy.classList.add("enemy");
  enemy.style.left = Math.random() * 360 + "px";
  enemy.style.top = "-40px";
  game.appendChild(enemy);

  let speed = setInterval(() => {
    let top = parseInt(enemy.style.top);
    if (top > 600) {
      enemy.remove();
      clearInterval(speed);
    } else {
      enemy.style.top = top + 3 + "px";
    }
  }, 20);

  setTimeout(spawnEnemy, 1000);
}

// --- BOMB ---
function spawnBomb() {
  if (!gameRunning) return;

  const bomb = document.createElement("div");
  bomb.classList.add("bomb");
  bomb.style.left = Math.random() * 360 + "px";
  bomb.style.top = "-40px";
  game.appendChild(bomb);

  let speed = setInterval(() => {
    let top = parseInt(bomb.style.top);
    if (top > 600) {
      bomb.remove();
      clearInterval(speed);
    } else {
      bomb.style.top = top + 4 + "px";
      checkBombHit(bomb);
    }
  }, 20);

  setTimeout(spawnBomb, 2500);
}

// --- CHECK BULLET HIT ENEMY ---
function checkHit(bullet) {
  document.querySelectorAll(".enemy").forEach((enemy) => {
    const bulletRect = bullet.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();

    if (
      bulletRect.left < enemyRect.right &&
      bulletRect.right > enemyRect.left &&
      bulletRect.top < enemyRect.bottom &&
      bulletRect.bottom > enemyRect.top
    ) {
      enemy.remove();
      bullet.remove();
      score++;
      scoreText.innerText = "Skor: " + score;
    }
  });
}

// --- CHECK BOMB HIT PLAYER ---
function checkBombHit(bomb) {
  const playerRect = player.getBoundingClientRect();
  const bombRect = bomb.getBoundingClientRect();

  if (
    bombRect.left < playerRect.right &&
    bombRect.right > playerRect.left &&
    bombRect.top < playerRect.bottom &&
    bombRect.bottom > playerRect.top
  ) {
    gameOver();
  }
}

function gameOver() {
  gameRunning = false;
  gameOverText.classList.remove("hidden");
}

// START GAME
spawnEnemy();
spawnBomb();
function checkBulletBombCollision() {
  for (let i = 0; i < bullets.length; i++) {
    for (let j = 0; j < bombs.length; j++) {
      let b = bullets[i];
      let bomb = bombs[j];

      // cek tabrakan (collision)
      if (
        b.x < bomb.x + bomb.width &&
        b.x + b.width > bomb.x &&
        b.y < bomb.y + bomb.height &&
        b.y + b.height > bomb.y
      ) {
        // GAME OVER!!
        gameOver();
        return;
      }
    }
  }
}
function update() {
  moveBullets();
  moveEnemies();
  moveBombs();

  checkBulletEnemyCollision();
  checkBulletBombCollision(); // ← ini yang penting

  draw();
  if (!isGameOver) requestAnimationFrame(update);
}
let isGameOver = false;

function gameOver() {
  isGameOver = true;
  alert("GAME OVER! Kamu menembak bomb!");
}
