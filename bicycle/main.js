/**
 * @type {HTMLDivElement}
 */
const canvasWrapper = document.getElementById("canvas-wrapper");

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvasWidth = 720;
const canvasHeight = 480;

const courseBlockCountToFillCanvas = 100;
const courseBlockWidth = canvasWidth / courseBlockCountToFillCanvas;

function setCanvasSize() {
  canvasWrapper.style.width = `${canvasWidth}px`;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
}

function drawRect(x, w, h) {
  const y = canvasHeight - h;
  ctx.fillRect(x, y, w, h);
}

function drawPlayer(x, y, radius) {
  const circle = new Path2D();
  circle.arc(x, canvasHeight - y - radius, radius, 0, 2 * Math.PI);
  const prevFillStyle = ctx.fillStyle;
  ctx.fillStyle = "blue";
  ctx.fill(circle);
  ctx.fillStyle = prevFillStyle;
}

function createCourseBlocks() {
  const maxHeight = 300;
  const minHeight = 50;
  const diffHeight = 5;
  const laps = 100;

  let h = minHeight + diffHeight * 10;
  let dh = [-diffHeight, 0, diffHeight][randomInt(0, 2)];
  const res = [h + dh];

  for (let i = 1; i < laps * courseBlockCountToFillCanvas; i++) {
    // if (typeof res[i - 1] === "number") {
    //   if (randomInt(0, 99) < 5) {
    //     res.push(undefined);
    //     continue;
    //   }
    // } else {
    //   if (randomInt(0, 99) < 80) {
    //     res.push(undefined);
    //     continue;
    //   }
    // }

    if (h > maxHeight || h < minHeight) {
      dh = h > maxHeight ? -diffHeight : diffHeight;
      h += dh;
      res.push(h);
      continue;
    }

    if (dh === 0) {
      dh = [-diffHeight, 0, diffHeight][randomInt(0, 2)];
    } else {
      dh = [dh, dh, dh, dh, 0][randomInt(0, 4)];
    }
    h += dh;
    res.push(h);
  }

  return res;
}

function randomInt(min, max) {
  const size = max - min + 1;
  return Math.floor(Math.random() * size) + min;
}

// main
setCanvasSize();

const courseBlocks = createCourseBlocks();
let coursePositionIndex = 0;
const playerPositionByBlockCount = 20;
const playerX = courseBlockWidth * playerPositionByBlockCount + courseBlockWidth / 2;
let playerY = 500;

let topPressed = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key == "Up" || e.key == "ArrowUp") {
    topPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Up" || e.key == "ArrowUp") {
    topPressed = false;
  }
}

setInterval(function () {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  for (let i = 0; i < courseBlockCountToFillCanvas; i++) {
    const courseIndex = (coursePositionIndex + i) % courseBlocks.length;
    drawRect(courseBlockWidth * i, courseBlockWidth, courseBlocks[courseIndex]);
  }

  const blockHeight = courseBlocks[playerPositionByBlockCount + coursePositionIndex];
  if (playerY === blockHeight || playerY === blockHeight - 5 || playerY === blockHeight + 5) {
    if (topPressed) {
      playerY += 150;
    } else {
      playerY = blockHeight;
    }
  } else {
    playerY -= 10;
  }
  drawPlayer(playerX, playerY, 10);

  coursePositionIndex++;
}, 50);

// courseの最大・最小値とjump時と下降時の差分をキリのいい数字にする
// 当たり判定の範囲を広くする
