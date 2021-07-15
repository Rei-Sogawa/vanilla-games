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
  circle.arc(x, canvasHeight - y, radius, 0, 2 * Math.PI);
  const prevFillStyle = ctx.fillStyle;
  ctx.fillStyle = "blue";
  ctx.fill(circle);
  ctx.fillStyle = prevFillStyle;
}

function createCourseBlocks() {
  const maxHeight = canvasHeight * 0.7;
  const minHeight = canvasHeight * 0.1;
  const diffHeight = 5;
  const laps = 10;

  let h = minHeight + diffHeight * 10;
  let dh = [-diffHeight, 0, diffHeight][randomInt(0, 2)];
  const res = [h + dh];

  for (let i = 1; i < laps * courseBlockCountToFillCanvas; i++) {
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

setCanvasSize();

const courseBlocks = createCourseBlocks();
let currentPositionIndex = 0;

setInterval(function () {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  for (let i = 0; i < courseBlockCountToFillCanvas; i++) {
    const courseIndex = (currentPositionIndex + i) % courseBlocks.length;
    drawRect(courseBlockWidth * i, courseBlockWidth, courseBlocks[courseIndex]);
  }
  currentPositionIndex++;
}, 50);
