const board = document.getElementById("board");

let width;
let height;
let bombAmount;

let initialized = false;
let finished = false;

let timer;

function createBoard() {
  for (let i = 0; i < height; i++) {
    const column = document.createElement("div");
    column.classList.add("column");

    board.appendChild(column);

    for (let j = 0; j < width; j++) {
      const square = document.createElement("div");
      square.classList.add("square", "hidden");
      square.id = `${i}-${j}`;
      column.appendChild(square);
      square.addEventListener("click", function () {
        handleClick(i, j);
      });
    }
  }
}

function setBomb() {
  const bombArray = getBombArray();
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const square = document.getElementById(`${i}-${j}`);
      if (square.classList.contains("blocked")) {
        square.classList.remove("blocked");
      } else {
        if (bombArray.pop() == "bomb") {
          square.classList.add("bomb");
          const text = document.createTextNode("X");
          square.appendChild(text);
        }
      }
    }
  }
}

function setBombAmount() {
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const square = document.getElementById(`${i}-${j}`);
      const bombAmountAround = getBombAmountAround(i, j);
      if (!square.classList.contains("bomb") && bombAmountAround > 0) {
        square.classList.add("danger");
        const text = document.createTextNode(bombAmountAround);
        square.appendChild(text);
      }
    }
  }
}

function blockAround(i, j) {
  for (let neighborI = i - 1; neighborI <= i + 1; neighborI++) {
    for (let neighborJ = j - 1; neighborJ <= j + 1; neighborJ++) {
      const square = document.getElementById(`${neighborI}-${neighborJ}`);
      if (square) {
        square.classList.add("blocked");
      }
    }
  }
}

function getBombArray() {
  const blockAmount = document.getElementsByClassName("blocked").length;
  const onlyBombArray = new Array(bombAmount).fill("bomb");
  const onlyEmptyArray = new Array(width * height - bombAmount - blockAmount).fill("empty");
  const concattedArray = onlyBombArray.concat(onlyEmptyArray);
  const bombArray = _.shuffle(concattedArray);
  return bombArray;
}

function getBombAmountAround(i, j) {
  let bombAmountAround = 0;
  for (let neighborI = i - 1; neighborI <= i + 1; neighborI++) {
    for (let neighborJ = j - 1; neighborJ <= j + 1; neighborJ++) {
      const isSelf = i == neighborI && j == neighborJ;
      const neighborSquare = document.getElementById(`${neighborI}-${neighborJ}`);
      if (!isSelf && neighborSquare && neighborSquare.classList.contains("bomb")) {
        bombAmountAround += 1;
      }
    }
  }
  return bombAmountAround;
}

function handleClick(i, j) {
  if (initialized) {
    click(i, j);
  } else {
    firstClick(i, j);
  }
}

function click(i, j) {
  if (finished) {
    return;
  }

  const square = document.getElementById(`${i}-${j}`);
  if (square.classList.contains("bomb")) {
    window.alert("BOMB!");
    openAll();
    clearInterval(timer);
    finished = true;
    return;
  }
  sweep(i, j);

  if (
    document.getElementsByClassName("hidden").length ==
    document.getElementsByClassName("bomb").length
  ) {
    window.alert("CLEAR!");
    openAll();
    clearInterval(timer);
    finished = true;
    return;
  }
}

function firstClick(i, j) {
  blockAround(i, j);
  setBomb();
  setBombAmount();
  sweep(i, j);
  startTimer();
  initialized = true;
}

function sweep(i, j) {
  const square = document.getElementById(`${i}-${j}`);
  if (!square || square.classList.contains("open")) {
    return;
  }
  square.classList.remove("hidden");
  square.classList.add("open");
  if (square.classList.contains("danger")) {
    return;
  }
  for (let neighborI = i - 1; neighborI <= i + 1; neighborI++) {
    for (let neighborJ = j - 1; neighborJ <= j + 1; neighborJ++) {
      const isSelf = i == neighborI && j == neighborJ;
      const neighborSquare = document.getElementById(`${neighborI}-${neighborJ}`);
      if (!isSelf && neighborSquare) {
        sweep(neighborI, neighborJ);
      }
    }
  }
}

function openAll() {
  const squares = Array.from(document.getElementsByClassName("square"));
  for (const square of squares) {
    square.classList.remove("hidden", "flag");
    square.classList.add("open");
  }
}

function createContextMenu() {
  $.contextMenu({
    selector: ".square",
    callback: function (key, options) {
      const square = options.$trigger[0];
      if (key == "addFlag") {
        square.classList.add("flag");
      } else if (key == "removeFlag") {
        square.classList.remove("flag");
      }
    },
    items: {
      addFlag: { name: "フラグを立てる" },
      removeFlag: { name: "フラグを回収する" },
    },
  });
}

function startTimer() {
  const startTimestamp = new Date().getTime();
  timer = setInterval(function () {
    const currentTimestamp = new Date().getTime();
    const time = Math.floor((currentTimestamp - startTimestamp) / 1000);
    document.getElementById("timer").innerText = `${time} s`;
  }, 1000);
}

function main() {
  createBoard();
  createContextMenu();
}

function setSelectLevelHandler() {
  const buttons = document.getElementById("select-level-buttons");
  const gameBoard = document.getElementById("game-board");

  document.getElementById("beginner").addEventListener("click", function () {
    width = 9;
    height = 9;
    bombAmount = 10;

    main();
    gameBoard.classList.remove("hidden");
    buttons.remove();
  });

  document.getElementById("intermediate").addEventListener("click", function () {
    width = 16;
    height = 16;
    bombAmount = 40;

    main();
    gameBoard.classList.remove("hidden");
    buttons.remove();
  });

  document.getElementById("advanced").addEventListener("click", function () {
    width = 30;
    height = 16;
    bombAmount = 99;

    main();
    gameBoard.classList.remove("hidden");
    buttons.remove();
  });
}

setSelectLevelHandler();
