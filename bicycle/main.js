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

const canvasDivisionLength = 100;
const canvasDivisionWidth = canvasWidth / canvasDivisionLength;

let course;
let courseIndex = 0;
const courseLaps = 100;
const courseMaxHeight = 300;
const courseMinHeight = 50;
const courseDiffHeight = 5;

const playerIndexInCanvas = 20;
const playerX = canvasDivisionWidth * playerIndexInCanvas + canvasDivisionWidth / 2;
let playerY = canvasHeight;
const dy = 20;

function setCanvasSize() {
  canvasWrapper.style.width = `${canvasWidth}px`;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
}

function drawRectOnGround(x, w, h) {
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

function createCourse() {
  let h = courseMinHeight + courseDiffHeight * 10;
  let dh = [-courseDiffHeight, 0, courseDiffHeight][randomInt(0, 2)];
  const course = [h + dh];

  for (let i = 1; i < courseLaps * canvasDivisionLength; i++) {
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

    if (h > courseMaxHeight || h < courseMinHeight) {
      dh = h > courseMaxHeight ? -courseDiffHeight : courseDiffHeight;
      h += dh;
      course.push(h);
      continue;
    }

    if (dh === 0) {
      dh = [-courseDiffHeight, 0, courseDiffHeight][randomInt(0, 2)];
    } else {
      dh = [dh, dh, dh, dh, 0][randomInt(0, 4)];
    }
    h += dh;
    course.push(h);
  }

  return course;
}

function randomInt(min, max) {
  const size = max - min + 1;
  return Math.floor(Math.random() * size) + min;
}

// main
setCanvasSize();

course = createCourse();

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

  for (let i = 0; i < canvasDivisionLength; i++) {
    const index = (courseIndex + i) % course.length;
    drawRectOnGround(canvasDivisionWidth * i, canvasDivisionWidth, course[index]);
  }

  const courseHeightAtPlayerIndexInCanvas = course[courseIndex + playerIndexInCanvas];
  if (
    playerY == courseHeightAtPlayerIndexInCanvas ||
    playerY == courseHeightAtPlayerIndexInCanvas + courseDiffHeight ||
    playerY == courseHeightAtPlayerIndexInCanvas - courseDiffHeight ||
    (playerY > courseHeightAtPlayerIndexInCanvas &&
      playerY <= courseHeightAtPlayerIndexInCanvas + dy)
  ) {
    if (topPressed) {
      playerY += dy * 10;
    } else {
      playerY = course[courseIndex + playerIndexInCanvas];
    }
  } else {
    playerY -= dy;
  }
  drawPlayer(playerX, playerY, 10);

  courseIndex++;
}, 50);
