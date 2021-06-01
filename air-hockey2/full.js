// https://developer.mozilla.org/ja/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Game_over のコードそのまま
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var ballRadius = 10;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;

var paddleHeight = 10;
var paddleWidth = 75;

var playerPaddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var topPressed = false;

var cpuPaddleX = (canvas.width - paddleWidth) / 2;
var noiseToCpuPaddleX = 0;

var cutSound = new Audio("./cut.mp3");
var driveSound = new Audio("./drive.mp3");

var playerLives = 3;
var cpuLives = 3;

var cutEffectSizeList = [-1, 0, 0, 1];
var driveEffectSizeList = [0, 0, 1];

var canDraw = true;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  } else if (e.key == "Up" || e.key == "ArrowUp") {
    topPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  } else if (e.key == "Up" || e.key == "ArrowUp") {
    topPressed = false;
  }
}

function updateCpuPaddleX() {
  cpuPaddleX = x - paddleWidth / 2;
  noiseToCpuPaddleX += [0.025, -0.025][randomInt(2)];
  cpuPaddleX += (paddleWidth / 2) * noiseToCpuPaddleX;
  if (cpuPaddleX <= 0) cpuPaddleX = 0;
  if (cpuPaddleX + paddleWidth >= canvas.width)
    cpuPaddleX = canvas.width - paddleWidth;
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "orange";
  ctx.fill();
  ctx.closePath();
}
function drawPlayerPaddle() {
  ctx.beginPath();
  ctx.rect(
    playerPaddleX,
    canvas.height - paddleHeight,
    paddleWidth,
    paddleHeight
  );
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}
function drawCpuPaddle() {
  updateCpuPaddleX();
  ctx.beginPath();
  ctx.rect(cpuPaddleX, 0, paddleWidth, paddleHeight);
  ctx.fillStyle = "magenta";
  ctx.fill();
  ctx.closePath();
}

function drawLives() {
  ctx.font = "16px monospace";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Player Lives: " + playerLives, canvas.width - 150, 20);
  ctx.fillText("Cpu Lives:    " + cpuLives, canvas.width - 150, 40);
}

function drawBallSpeed() {
  ctx.font = "16px monospace";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("|dx|: " + Math.abs(dx), canvas.width - 150, 80);
  ctx.fillText("|dy|: " + Math.abs(dy), canvas.width - 150, 100);
}

function draw() {
  if (!canDraw) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPlayerPaddle();
  drawCpuPaddle();
  drawLives();
  drawBallSpeed();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    if (
      x + ballRadius > cpuPaddleX &&
      x - ballRadius < cpuPaddleX + paddleWidth
    ) {
      dy = -dy;

      // cpu のカット・ドライブの処理
      var cut = cutEffectSizeList[randomInt(cutEffectSizeList.length)];
      var drive = driveEffectSizeList[randomInt(driveEffectSizeList.length)];
      dx += cut;
      dy += drive;

      // cpu のカット・ドライブ時の効果音
      if (cut !== 0) {
        cutSound.play();
      }
      if (drive !== 0) {
        driveSound.play();
      }
    } else {
      cpuLives--;
      if (cpuLives === 0) {
        alert("YOU WIN!");
        document.location.reload();
        clearInterval(interval);
      } else {
        canDraw = false;
        setTimeout(() => {
          x = canvas.width / 2;
          y = 30;
          dx = 2;
          dy = 2;
          playerPaddleX = (canvas.width - paddleWidth) / 2;
          canDraw = true;
        }, 1000);
      }
    }
  } else if (y + dy > canvas.height - ballRadius) {
    if (
      x + ballRadius > playerPaddleX &&
      x - ballRadius < playerPaddleX + paddleWidth
    ) {
      dy = -dy;

      // カット・ドライブの処理
      if (rightPressed) {
        dx += 1;
      }
      if (leftPressed) {
        dx -= 1;
      }
      if (topPressed) {
        dy -= 1;
      }

      // カット・ドライブの効果音
      if (rightPressed || leftPressed) {
        cutSound.play();
      }
      if (topPressed) {
        driveSound.play();
      }
    } else {
      playerLives--;
      if (playerLives === 0) {
        alert("GAME OVER");
        document.location.reload();
        clearInterval(interval); // Needed for Chrome to end game
      } else {
        canDraw = false;
        setTimeout(() => {
          x = canvas.width / 2;
          y = canvas.height - 30;
          dx = 2;
          dy = -2;
          playerPaddleX = (canvas.width - paddleWidth) / 2;

          canDraw = true;
        }, 1000);
      }
    }
  }

  if (rightPressed && playerPaddleX < canvas.width - paddleWidth) {
    playerPaddleX += 7;
  } else if (leftPressed && playerPaddleX > 0) {
    playerPaddleX -= 7;
  }

  x += dx;
  y += dy;
}

var interval = setInterval(draw, 10);

// utils
function randomInt(length, startAt = 0) {
  return Math.floor(Math.random() * length) + startAt;
}
