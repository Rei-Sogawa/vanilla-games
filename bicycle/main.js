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

const courseDiffTotalCount = 100 * 100;
const courseDiffCountToFillCanvas = 200;
const courseDiffWidth = canvasWidth / courseDiffCountToFillCanvas;

/**
 * @type {Array<{ h: number }>}
 */
const courseDiffs = [];

function setCanvasSize() {
  canvasWrapper.style.width = `${canvasWidth}px`;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
}

function fillRectOnGround(x, w, h) {
  const y = canvasHeight - h;
  ctx.fillRect(x, y, w, h);
}

function setCourse() {
  let h = 100;
  let prevHDiff = 0;
  for (let i = 0; i < courseDiffTotalCount; i++) {
    const hDiff = [-5, 0, 5][randomInt(0, 2)];
    if (h + hDiff > canvasHeight / 10 && h + hDiff < canvasHeight / 2 && prevHDiff * hDiff >= 0) {
      h += hDiff;
      prevHDiff = hDiff;
    }
    courseDiffs.push({ h });
  }
}

setCanvasSize();
setCourse();

let i = 0;
setInterval(function () {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  for (let j = 0; j < courseDiffCountToFillCanvas; j++) {
    const idx = (j + i) % courseDiffs.length;
    const { h } = courseDiffs[idx];
    fillRectOnGround(courseDiffWidth * j, courseDiffWidth, h);
  }
  drawPlayer(0, canvasHeight - courseDiffs[i].h - 10, 10);
  i++;
}, 50);

function randomInt(min, max) {
  const size = max - min + 1;
  return Math.floor(Math.random() * size) + min;
}

function drawPlayer(x, y, size) {
  const circle = new Path2D();
  circle.arc(x, y, size, 0, 2 * Math.PI);
  const fillStyle = ctx.fillStyle;
  ctx.fillStyle = "blue";
  ctx.fill(circle);
  ctx.fillStyle = fillStyle;
}
