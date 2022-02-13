var GLOBAL_ROW = 8;
var GLOBAL_COL = 8;
var GLOBAL_TRIES = 0;
var GLOBAL_WIN = false;
var GLOBAL_qToWin = 5;
var GLOBAL_qToWinAM = 4;

const handlerBuild = () => {
  GLOBAL_TRIES = 0;
  toggleStatus(false);

  GLOBAL_ROW = parseInt(document.getElementById("row").value);
  GLOBAL_COL = parseInt(document.getElementById("col").value);
  GLOBAL_qToWin = parseInt(document.getElementById("qwin").value);
  GLOBAL_qToWinAM = GLOBAL_qToWin - 1;

  const container = document.getElementById("game");
  container.style.gridTemplateRows = `repeat(${GLOBAL_ROW}, 40px)`;
  container.style.gridTemplateColumns = `repeat(${GLOBAL_COL}, 40px)`;

  buildMatrix();
  handlerTurn("player2", true);

  return false;
};

const buildMatrix = () => {
  let contenido = "";
  let idcasilla = "";

  for (let rowCursor = 0; rowCursor < GLOBAL_ROW; rowCursor++) {
    for (let colCursor = 0; colCursor < GLOBAL_COL; colCursor++) {
      idcasilla = `casilla_${GLOBAL_ROW - 1 - rowCursor}_${colCursor}`;
      contenido += `<div data-value="0" onclick="handlerClic('${idcasilla}')" id="${idcasilla}"></div>`;
    }
  }
  const contenedor = document.getElementById("game");
  contenedor.innerHTML = contenido;
};

const handlerClic = (id) => {
  if (GLOBAL_WIN) return;
  [rowClicked, colClicked] = id.replace("casilla_", "").split("_");
  rowClicked = parseInt(rowClicked);
  colClicked = parseInt(colClicked);

  putChip(colClicked);
};

const putChip = (col) => {
  for (let i = 0; i < GLOBAL_ROW; i++) {
    casilla = document.getElementById(`casilla_${i}_${col}`);

    // Si la casilla no existe, sigue con la siguiente
    if (!casilla) continue;

    // Si está vacia, pone la ficha
    if (casilla.dataset.value === "0") {
      const player = GLOBAL_TRIES % 2 === 0 ? "player1" : "player2";
      casilla.dataset.value = player;
      GLOBAL_TRIES += 1;

      if (checkWinner(i, col, player)) handlerTurn("winner");
      else handlerTurn(player);

      break;
    }
  }
};

const handlerTurn = (player, reset) => {
  const turno_box = document.getElementById("turno_box");
  const turno_text = document.querySelector(".turno_box p")

  if (reset) turno_box.className = "turno_box player2"

  switch (player) {
    case "player1":
      turno_box.classList.replace("player1", "player2");
      turno_text.innerText = "FICHAS VERDES";
      break;

    case "player2":
      turno_box.classList.replace("player2", "player1");
      turno_text.innerText = "FICHAS ROJAS";
      break;
      
      case "winner":
        turno_box.className = "turno_box turno_winner"
        turno_text.innerText = `PARTIDA FINALIZADA!!!`;
      break;

    default:
      console.log("error");
      break;
  }
};

const checkWinner = (row, col, player) => {
  if (checkArrayWinner(getRangeToCheck(row, 0, col, 1), player)) return true; // HORIZONTAL
  if (checkArrayWinner(getRangeToCheck(row, 1, col, 0), player)) return true; // VERTICAL
  if (checkArrayWinner(getRangeToCheck(row, 1, col, 1), player)) return true; // DIAGONAL 1
  if (checkArrayWinner(getRangeToCheck(row, -1, col, 1), player)) return true; // DIAGONAL 2
};

const getRangeToCheck = (row, rowVar, col, colVar) => {
  const rangeToCheck = [];
  for (let i = -GLOBAL_qToWinAM; i <= GLOBAL_qToWinAM; i++) {
    cursorRow = row + parseInt(rowVar) * i;
    cursorCol = col + parseInt(colVar) * i;
    casilla = document.getElementById(`casilla_${cursorRow}_${cursorCol}`);

    if (!casilla) continue;
    rangeToCheck.push({
      value: casilla.dataset.value,
      row: cursorRow,
      col: cursorCol,
    });
  }
  return rangeToCheck;
};

const checkArrayWinner = (rangeToCheck, player) => {
  let comparador = "";
  let acumulador = 1;
  let winnerRange = [];

  for (let i = 0; i < rangeToCheck.length; i++) {
    let casilla = rangeToCheck[i];

    if (comparador == "") {
      comparador = casilla.value;
      winnerRange = [{ row: casilla.row, col: casilla.col }];
    } else {
      if (casilla.value === "0") continue;
      if (casilla.value == comparador) {
        acumulador++;
        winnerRange.push({ row: casilla.row, col: casilla.col });
        if (acumulador === GLOBAL_qToWin) {
          winner(winnerRange, player);
          return true;
        }
      } else {
        comparador = casilla.value;
        acumulador = 1;
        winnerRange = [{ row: casilla.row, col: casilla.col }];
      }
    }
  }
};

const winner = (winnerRange, player) => {
  toggleStatus(!GLOBAL_WIN);

  winnerRange.forEach((element) => {
    casilla = document.getElementById(`casilla_${element.row}_${element.col}`);
    casilla.classList.add("winner");
  });
};

handlerBuild()
