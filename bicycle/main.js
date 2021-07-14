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
const courseDiffCountToFillCanvas = 50;
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
  for (let i = 0; i < courseDiffTotalCount; i++) {
    const hDiff = Math.random() > 0.5 ? 5 : -5;
    if (h + hDiff > canvasHeight / 10 && h + hDiff < canvasHeight / 2) {
      h += hDiff;
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
  i++;
}, 50);

function randomInt(start, end) {
  const size = end - start + 1;
  return Math.floor(Math.random() * size) + start;
}
