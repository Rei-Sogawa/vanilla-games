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
var upPressed = false;

var cpuPaddleX = (canvas.width - paddleWidth) / 2;
var noiseToCpuPaddleX = 0;

var cutSound = new Audio("./cut.mp3");
var driveSound = new Audio("./drive.mp3");

var playerLives = 3;
var cpuLives = 3;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  } else if (e.key == "Up" || e.key == "ArrowUp") {
    upPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  } else if (e.key == "Up" || e.key == "ArrowUp") {
    upPressed = false;
  }
}

function updateCpuPaddleX() {
  cpuPaddleX = x - paddleWidth / 2;
  noiseToCpuPaddleX += [0.025, -0.025][randomInt(2)];
  cpuPaddleX += (paddleWidth / 2) * noiseToCpuPaddleX;
  if (cpuPaddleX <= 0) {
    cpuPaddleX = 0;
  }
  if (cpuPaddleX + paddleWidth >= canvas.width) {
    cpuPaddleX = canvas.width - paddleWidth;
  }
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

function drawBallSpeed() {
  ctx.font = "16px monospace";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("|dx|: " + Math.abs(dx), canvas.width - 150, 80);
  ctx.fillText("|dy|: " + Math.abs(dy), canvas.width - 150, 100);
}

function drawLives() {
  ctx.font = "16px monospace";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Player Lives: " + playerLives, canvas.width - 150, 20);
  ctx.fillStyle = "magenta";
  ctx.fillText("Cpu Lives   : " + cpuLives, canvas.width - 150, 40);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPlayerPaddle();
  drawCpuPaddle();
  drawBallSpeed();
  drawLives();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    if (
      x + ballRadius > cpuPaddleX &&
      x - ballRadius < cpuPaddleX + paddleWidth
    ) {
      dy = -dy;
    } else {
      cpuLives--;
      if (cpuLives == 0) {
        alert("YOU WIN!");
        document.location.reload();
        clearInterval(interval);
      } else {
        x = canvas.width / 2;
        y = 30;
        dx = 2;
        dy = 2;
        playerPaddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  } else if (y + dy > canvas.height - ballRadius) {
    if (
      x + ballRadius > playerPaddleX &&
      x - ballRadius < playerPaddleX + paddleWidth
    ) {
      dy = -dy;

      if (rightPressed) {
        dx = dx + 1;
      }
      if (leftPressed) {
        dx = dx - 1;
      }
      if (upPressed) {
        dy = dy - 1;
      }

      if (rightPressed || leftPressed) {
        cutSound.play();
      }
      if (upPressed) {
        driveSound.play();
      }
    } else {
      playerLives--;
      if (playerLives == 0) {
        alert("GAME OVER");
        document.location.reload();
        clearInterval(interval); // Needed for Chrome to end game
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        playerPaddleX = (canvas.width - paddleWidth) / 2;
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
