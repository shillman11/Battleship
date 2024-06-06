import { Gameboard } from "./main.js";

export const BoardDOM = (() => {
  const restartButton = document.querySelector("#restart-button");
  const playerBoard = document.querySelector(".player-board");
  const enemyBoard = document.querySelector(".enemy-board");
  const axisButton = document.querySelector("#axis-button");

  const createPlayerBoard = () => {
    for (let i = 0; i < 10; i++) {
      const playerRowContainer = document.createElement("div");
      playerRowContainer.className = "player-row";
      playerRowContainer.id = "player-row-" + i;
      playerBoard.appendChild(playerRowContainer);

      for (let j = 0; j < 10; j++) {
        const playerSquare = document.createElement("div");
        playerSquare.className = "player-square";
        playerSquare.id = "player-" + i + "-" + j;
        playerRowContainer.appendChild(playerSquare);
      }
    }
  };

  const createEnemyBoard = () => {
    for (let i = 0; i < 10; i++) {
      const enemyRowContainer = document.createElement("div");
      enemyRowContainer.className = "enemy-row";
      enemyRowContainer.id = "enemy-row-" + i;
      enemyBoard.appendChild(enemyRowContainer);

      for (let j = 0; j < 10; j++) {
        const enemySquare = document.createElement("div");
        enemySquare.className = "enemy-square";
        enemySquare.id = "enemy-" + i + "-" + j;
        enemyRowContainer.appendChild(enemySquare);
      }
    }
  };

  const restart = () => {
    restartButton.className = "restart-active";

    restartButton.addEventListener("click", () => {
      clearBoards();
      createPlayerBoard();
      createEnemyBoard();
      Display.placeShips();
      axisButton.className = "axis-button-active";
      restartButton.className = "restart-hidden";
      const enemyBoardContainer = document.querySelector(
        "#enemy-board-container"
      );
      const boardTitle = document.querySelector("#board-title-friendly");
      enemyBoardContainer.className = "enemy-board-container-hidden";
      boardTitle.className = "board-title-hidden";
      Gameboard.reset();
    });

    function clearBoards() {
      while (playerBoard.firstChild && enemyBoard.firstChild) {
        playerBoard.removeChild(playerBoard.firstChild);
        enemyBoard.removeChild(enemyBoard.firstChild);
      }
    }
  };

  return { createPlayerBoard, createEnemyBoard, restart };
})();

export function activateBoard() {
  const enemyBoard = document.querySelector(".enemy-board-container-hidden");
  const boardTitle = document.querySelector(".board-title-hidden");
  const axisButton = document.querySelector(".axis-button-active");
  boardTitle.className = "board-title-active";
  axisButton.className = "axis-button-hidden";
  enemyBoard.className = "enemy-board-container-active";
  Display.gameStart();
  Gameboard.enableAttacks();
}

export const Display = (() => {
  const display = document.querySelector("#text");

  const placeShips = () => {
    display.className = "display-text";
    setTimeout(function () {
      display.innerHTML = "Place your ships Captain.";
      display.className = "display-text-show";
    }, 500);
  };

  const gameStart = () => {
    display.className = "display-text";

    setTimeout(function () {
      display.innerHTML = "Captain! Enemies are incoming!";
      display.className = "display-text-show";
      setTimeout(function () {
        display.className = "display-text";
        setTimeout(function () {
          display.innerHTML = "Open fire!";
          display.className = "display-text-show";
        }, 1000);
      }, 500);
    }, 500);
  };

  const hit = () => {
    display.className = "display-text";
    setTimeout(function () {
      display.innerHTML = "Enemy hit!";
      display.className = "display-text-show";
    }, 500);
  };

  const miss = () => {
    display.className = "display-text";
    setTimeout(function () {
      display.innerHTML = "Shot Missed!";
      display.className = "display-text-show";
    }, 500);
  };

  const shipDestroyed = () => {
    display.className = "display-text";
    setTimeout(function () {
      display.innerHTML = "Enemy Ship Destroyed!";
      display.className = "display-text-show";
    }, 500);
  };

  const gameOver = () => {
    display.className = "display-text";
    setTimeout(function () {
      display.innerHTML = "Game Over!";
      display.className = "display-text-show";
    }, 500);
  };

  return { gameStart, hit, miss, shipDestroyed, gameOver, placeShips };
})();
