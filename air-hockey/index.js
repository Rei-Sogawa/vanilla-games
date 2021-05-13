var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 15;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var paddleHeight = 10;
var paddleWidth = 75;
var playerPaddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var cpuPaddleX = (canvas.width - paddleWidth) / 2;
var noiseToCpuPaddleX = 0;
var rallyLength = 0;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
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
  ctx.fillStyle = "#0095DD";
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
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPlayerPaddle();
  drawCpuPaddle();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    if (
      x + ballRadius > cpuPaddleX &&
      x - ballRadius < cpuPaddleX + paddleWidth
    ) {
      rallyLength += 1;
      dy = -dy;
    } else {
      alert("YOU WIN!");
      document.location.reload();
      clearInterval(interval);
    }
  } else if (y + dy > canvas.height - ballRadius) {
    if (
      x + ballRadius > playerPaddleX &&
      x - ballRadius < playerPaddleX + paddleWidth
    ) {
      rallyLength += 1;
      dy = -dy;
    } else {
      alert("GAME OVER");
      document.location.reload();
      clearInterval(interval); // Needed for Chrome to end game
    }
  }

  if (rightPressed && playerPaddleX < canvas.width - paddleWidth) {
    playerPaddleX += 7;
  } else if (leftPressed && playerPaddleX > 0) {
    playerPaddleX -= 7;
  }

  x += dx * (1 + (3 * Math.min(rallyLength, 20)) / 20);
  y += dy * (1 + (3 * Math.min(rallyLength, 20)) / 20);
}

var interval = setInterval(draw, 10);

// utils
function shuffleArray(ary) {
  return ary
    .slice()
    .map((el) => ({ el, order: Math.random() }))
    .sort((a, b) => a.order - b.order)
    .map((a) => a.el);
}

function randomInt(length, startAt = 0) {
  return Math.floor(Math.random() * length) + startAt;
}
