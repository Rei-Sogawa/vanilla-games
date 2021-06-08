const grid = document.querySelector(".grid");

const width = 9;
const bombAmount = 10;

function createBoard() {
  const shuffledBombArray = getShuffledBombArray();

  for (let i = 0; i < width; i++) {
    const col = document.createElement("div");
    col.className = "col";

    for (let j = 0; j < width; j++) {
      const square = document.createElement("div");
      square.classList.add("square", "hidden");
      square.id = `${i}${j}`;

      const isBomb = shuffledBombArray.pop() == "bomb";
      if (isBomb) {
        square.classList.add("bomb");
        const text = document.createTextNode("X");
        square.appendChild(text);
      }

      square.addEventListener("click", function (_e) {
        click(square);
      });

      col.appendChild(square);
    }

    grid.appendChild(col);
  }

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < width; j++) {
      const id = `${i}${j}`;
      const square = document.getElementById(id);

      const hasBombSelf = square.classList.contains("bomb");
      const bombAmountAround = getBombAmountAround(i, j);

      if (!hasBombSelf && bombAmountAround > 0) {
        square.classList.add("danger");
        const text = document.createTextNode(bombAmountAround);
        square.appendChild(text);
      }
    }
  }
}

function getShuffledBombArray() {
  const onlyBombArray = new Array(bombAmount).fill("bomb");
  const onlyEmptyArray = new Array(width * width - bombAmount).fill("empty");
  const bombArray = onlyBombArray.concat(onlyEmptyArray);
  const shuffledBombArray = _.shuffle(bombArray);
  return shuffledBombArray;
}

function getBombAmountAround(i, j) {
  let bombAmountAround = 0;
  for (let neighborI = i - 1; neighborI < i + 2; neighborI++) {
    for (let neighborJ = j - 1; neighborJ < j + 2; neighborJ++) {
      const isSelf = i == neighborI && j == neighborJ;
      const neighborSquare = document.getElementById(
        `${neighborI}${neighborJ}`
      );
      const hasBomb = neighborSquare
        ? neighborSquare.classList.contains("bomb")
        : false;

      if (!isSelf && neighborSquare && hasBomb) {
        bombAmountAround += 1;
      }
    }
  }
  return bombAmountAround;
}

function click(square) {
  const i = Number(square.id[0]);
  const j = Number(square.id[1]);
  const hasBomb = square.classList.contains("bomb");

  if (hasBomb) {
    window.alert("BOMB!");
  }
}

function main() {
  createBoard();
}

main();
