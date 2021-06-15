const board = document.getElementById("board");

const width = 9;
const height = 9;
const bombAmount = 10;

function createBoard() {
  for (let i = 0; i < height; i++) {
    const column = document.createElement("div");
    column.classList.add("column");

    board.appendChild(column);

    for (let j = 0; j < width; j++) {
      const square = document.createElement("div");
      square.classList.add("square", "hidden");
      square.id = `${i}-${j}`;
      square.addEventListener("click", function () {
        click(i, j);
      });

      column.appendChild(square);
    }
  }
}

function setBomb() {
  const bombArray = getBombArray();
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (bombArray.pop() == "bomb") {
        const square = document.getElementById(`${i}-${j}`);
        square.classList.add("bomb");
        const text = document.createTextNode("X");
        square.appendChild(text);
      }
    }
  }
}

function setBombAmountAround() {
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

function getBombArray() {
  const onlyBombArray = new Array(bombAmount).fill("bomb");
  const onlyEmptyArray = new Array(width * height - bombAmount).fill("empty");
  const concattedArray = onlyBombArray.concat(onlyEmptyArray);
  const bombArray = _.shuffle(concattedArray);
  return bombArray;
}

function getBombAmountAround(i, j) {
  let bombAmountAround = 0;
  for (let neighborI = i - 1; neighborI < i + 2; neighborI++) {
    for (let neighborJ = j - 1; neighborJ < j + 2; neighborJ++) {
      const isSelf = i == neighborI && j == neighborJ;
      const neighborSquare = document.getElementById(
        `${neighborI}-${neighborJ}`
      );
      if (
        !isSelf &&
        neighborSquare &&
        neighborSquare.classList.contains("bomb")
      ) {
        bombAmountAround += 1;
      }
    }
  }
  return bombAmountAround;
}

function click(i, j) {
  const square = document.getElementById(`${i}-${j}`);
  if (square.classList.contains("bomb")) {
    window.alert("BOMB!");
    openAll();
    return;
  }
  sweep(i, j);
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
  for (let neighborI = i - 1; neighborI < i + 2; neighborI++) {
    for (let neighborJ = j - 1; neighborJ < j + 2; neighborJ++) {
      const isSelf = i == neighborI && j == neighborJ;
      const neighborSquare = document.getElementById(
        `${neighborI}-${neighborJ}`
      );
      if (!isSelf && neighborSquare) {
        sweep(neighborI, neighborJ);
      }
    }
  }
}

function openAll() {
  const squares = document.getElementsByClassName("square");
  for (const square of squares) {
    square.classList.remove("hide");
    square.classList.add("open");
  }
}

function main() {
  createBoard();
  setBomb();
  setBombAmountAround();
}

main();

// 再起関数の例
function fn(n) {
  if (n > 10) {
    return;
  }
  console.log(n);
  fn(n + 1);
}
