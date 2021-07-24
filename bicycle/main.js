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
const courseLaps = 10;
const courseMaxHeight = 300;
const courseMinHeight = 50;
const courseDiffHeight = 5;

const playerIndexInCanvas = 20;
const playerX = canvasDivisionWidth * playerIndexInCanvas + canvasDivisionWidth / 2;
let playerY = canvasHeight;

function dy(time) {
  const v0 = 30;
  const g = 3;
  return v0 - g * time;
}
const timeAtMaxHeight = 10;
let timeAfterJump = timeAtMaxHeight;

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
  let h = courseMinHeight;
  let dh = [-courseDiffHeight, 0, courseDiffHeight][randomInt(0, 2)];
  const course = [h + dh];

  for (let i = 1; i < courseLaps * canvasDivisionLength; i++) {
    if (course[i - 1] > 0) {
      if (randomInt(0, 99) < 5) {
        course.push(0);
        continue;
      }
    } else {
      if (randomInt(0, 99) < 80) {
        course.push(0);
        continue;
      }
    }

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

  course[course.length - 1] = 0;
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

  const prevPlayerY = playerY;
  let nextPlayerY;

  const prevCourseHeight = course[(courseIndex + playerIndexInCanvas - 1) % course.length];
  const nextCourseHeight = course[(courseIndex + playerIndexInCanvas) % course.length];

  if (
    // ジャンプ中の場合
    prevPlayerY > prevCourseHeight
  ) {
    if (prevPlayerY > nextCourseHeight) {
      if (prevPlayerY + dy(timeAfterJump) > nextCourseHeight) {
        nextPlayerY = prevPlayerY + dy(timeAfterJump);
        timeAfterJump++;
      } else {
        nextPlayerY = nextCourseHeight;
      }
    } else {
      if (prevPlayerY + courseDiffHeight === nextCourseHeight) {
        nextPlayerY = nextCourseHeight;
      } else {
        window.location.reload();
      }
    }
  } else if (
    // コース上を走っている場合
    prevPlayerY === prevCourseHeight
  ) {
    if (prevPlayerY === 0) {
      window.location.reload();
    } else if (
      // 連続の場合
      prevPlayerY === nextCourseHeight ||
      prevPlayerY + courseDiffHeight === nextCourseHeight ||
      prevPlayerY - courseDiffHeight === nextCourseHeight
    ) {
      if (topPressed) {
        nextPlayerY = prevPlayerY + dy((timeAfterJump = 0));
        timeAfterJump++;
      } else {
        nextPlayerY = nextCourseHeight;
      }
    } else {
      // 連続でない場合
      nextPlayerY = prevPlayerY + dy((timeAfterJump = timeAtMaxHeight));
      timeAfterJump++;
    }
  }

  drawPlayer(playerX, (playerY = nextPlayerY), 10);
  courseIndex++;
}, 50);
