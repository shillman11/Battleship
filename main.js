import { BoardDOM } from "./dom.js";
import { activateBoard } from "./dom.js";
import { Display } from "./dom.js";

//builds the ship object
function Ship(length, coordinates) {
  let numberOfHits = 0;
  let isAlive = true;
  const getNumberOfHits = () => numberOfHits;
  const getCoordinates = () => coordinates;

  const hit = () => {
    numberOfHits += 1;
  };

  const isSunk = () => {
    if (getNumberOfHits() >= length) {
      isAlive = false;
      return true;
    } else {
      return false;
    }
  };

  return {
    length,
    getNumberOfHits,
    hit,
    isSunk,
    getCoordinates,
    coordinates,
  };
}

export const Gameboard = (() => {
  let computerAttackMap = [];
  let playerShips = [];
  let enemyShips = [];

  let isplayerTurn = true;

  const reset = () => {
    playerShips = [];
    enemyShips = [];
    placeShips();
    placeEnemyShips();
    computerAttackMap = [];
  };

  const placeEnemyShips = () => {
    let allCoordinates = [];
    let isInBounds = true;

    for (let i = 1; i <= 5; i++) {
      let enemyShipCoordinates = getRandomCoordinates(i);

      isInBounds = CheckCoordinateTaken(enemyShipCoordinates, allCoordinates);

      while (!isInBounds) {
        enemyShipCoordinates = getRandomCoordinates(i);
        isInBounds = CheckCoordinateTaken(enemyShipCoordinates, allCoordinates);
      }

      enemyShipCoordinates.forEach((coordinate) => {
        allCoordinates.push(coordinate);
      });

      enemyShips.push(new Ship(i, enemyShipCoordinates));
    }

    function CheckCoordinateTaken(shipCoordinates, allCoordinates) {
      for (let j = 0; j < shipCoordinates.length; j++) {
        for (let k = 0; k < allCoordinates.length; k++) {
          if (shipCoordinates[j] === allCoordinates[k]) {
            return false;
          }
        }
      }
      return true;
    }
  };

  function getRandomCoordinates(shipLength) {
    //obtains random coordinates for the enemy ships and returns the set of coordinates
    let enemyCoordinates = [];
    let allPossibleEnemyCoordinates = [];
    let possibleEnemyCoordinates = [];

    const X = Math.floor(Math.random() * (10 - 0) + 0);
    const Y = Math.floor(Math.random() * (10 - 0) + 0);

    for (let j = 0; j < 4; j++) {
      possibleEnemyCoordinates.push(X + "-" + Y);
      for (let i = 1; i < shipLength; i++) {
        let newX, newY;

        if (j === 0) {
          newX = X + i;
          newY = Y;
        } else if (j === 1) {
          newX = X - i;
          newY = Y;
        } else if (j === 2) {
          newX = X;
          newY = Y + i;
        } else {
          newX = X;
          newY = Y - i;
        }

        // Check if the new coordinates are in bounds
        if (isInBounds(newX, newY)) {
          possibleEnemyCoordinates.push(newX + "-" + newY);
        }
      }
      allPossibleEnemyCoordinates.push(possibleEnemyCoordinates);
      possibleEnemyCoordinates = [];
    }

    allPossibleEnemyCoordinates.forEach((coordinateSet) => {
      if (coordinateSet.length === shipLength) {
        enemyCoordinates.push(coordinateSet);
      }
    });

    return enemyCoordinates[
      Math.floor(Math.random() * (enemyCoordinates.length - 0) + 0)
    ];

    function isInBounds(x, y) {
      // Check if the coordinates are within the valid range (0 to 9 for a 10x10 board) and also havnt been taken yet.
      return x >= 0 && x < 10 && y >= 0 && y < 10;
    }
  }

  //function for placing the ships at the beginning of the game
  const placeShips = () => {
    let isXAxis = true;
    let isInBounds = true;
    let shipNumber = 5;

    const axisButton = document.querySelector("#axis-button");

    //adds event listener to the axis button
    axisButton.addEventListener("click", (e) => {
      if (isXAxis) {
        axisButton.innerHTML = "Axis: Y";
        isXAxis = false;
      } else {
        axisButton.innerHTML = "Axis: X";
        isXAxis = true;
      }
    });

    //section adds event listeners to the squares to hover the ship and change square color
    const playerSquares = document.querySelectorAll(".player-square");

    playerSquares.forEach((square) => {
      square.addEventListener("mouseenter", mouseEnterHandler);
    });

    playerSquares.forEach((square) => {
      square.addEventListener("mouseleave", mouseLeaveHandler);
    });

    playerSquares.forEach((square) => {
      square.addEventListener("click", clickHandler);
    });

    function mouseEnterHandler(e) {
      e.target.style.cursor = "pointer";

      const squareX = parseInt(e.target.id.charAt(7));
      const squareY = parseInt(e.target.id.charAt(9));

      if (e.target.style.backgroundColor !== "blue") {
        e.target.style.backgroundColor = "lightgreen";
      } else {
        e.target.style.cursor = "not-allowed";
      }

      try {
        if (isXAxis) {
          for (let i = 1; i < shipNumber; i++) {
            const nextSquareX = squareX + i;

            const nextSquare = document.querySelector(
              "#player-" + nextSquareX + "-" + squareY
            );
            if (nextSquare.style.backgroundColor !== "blue") {
              nextSquare.style.backgroundColor = "lightgreen";
            } else {
              e.target.style.cursor = "not-allowed";
            }
          }
        } else {
          for (let i = 1; i < shipNumber; i++) {
            const nextSquareY = squareY + i;

            const nextSquare = document.querySelector(
              "#player-" + squareX + "-" + nextSquareY
            );
            if (nextSquare.style.backgroundColor !== "blue") {
              nextSquare.style.backgroundColor = "lightgreen";
            } else {
              e.target.style.cursor = "not-allowed";
            }
          }
        }
        isInBounds = true;
      } catch (error) {
        e.target.style.cursor = "not-allowed";
        isInBounds = false;
      }
    }

    function mouseLeaveHandler(e) {
      const squareX = parseInt(e.target.id.charAt(7));
      const squareY = parseInt(e.target.id.charAt(9));

      if (e.target.style.backgroundColor !== "blue") {
        e.target.style.backgroundColor = "white";
      }

      if (isXAxis) {
        for (let i = 1; i < shipNumber; i++) {
          const nextSquareX = squareX + i;
          const nextSquare = document.querySelector(
            "#player-" + nextSquareX + "-" + squareY
          );
          if (nextSquare.style.backgroundColor !== "blue") {
            nextSquare.style.backgroundColor = "white";
          }
        }
      } else {
        for (let i = 1; i < shipNumber; i++) {
          const nextSquareY = squareY + i;
          const nextSquare = document.querySelector(
            "#player-" + squareX + "-" + nextSquareY
          );
          if (nextSquare.style.backgroundColor !== "blue") {
            nextSquare.style.backgroundColor = "white";
          }
        }
      }
    }

    function clickHandler(e) {
      let shipCoordinates = [];

      if (isInBounds && e.target.style.cursor !== "not-allowed") {
        const squareX = parseInt(e.target.id.charAt(7));
        const squareY = parseInt(e.target.id.charAt(9));

        e.target.style.backgroundColor = "blue";

        shipCoordinates.push(squareX + "-" + squareY);

        try {
          if (isXAxis) {
            for (let i = 1; i < shipNumber; i++) {
              const nextSquareX = squareX + i;
              const nextSquare = document.querySelector(
                "#player-" + nextSquareX + "-" + squareY
              );
              nextSquare.style.backgroundColor = "blue";
              shipCoordinates.push(nextSquareX + "-" + squareY);
            }
          } else {
            for (let i = 1; i < shipNumber; i++) {
              const nextSquareY = squareY + i;
              const nextSquare = document.querySelector(
                "#player-" + squareX + "-" + nextSquareY
              );
              nextSquare.style.backgroundColor = "blue";
              shipCoordinates.push(squareX + "-" + nextSquareY);
            }
          }
        } catch (e) {}

        e.target.removeEventListener("mouseenter", mouseEnterHandler);
        e.target.removeEventListener("mouseleave", mouseLeaveHandler);
        e.target.removeEventListener("click", clickHandler);
        playerShips.push(new Ship(shipNumber, shipCoordinates));
        shipNumber -= 1;
      }

      if (shipNumber <= 0) {
        playerSquares.forEach((square) => {
          square.removeEventListener("mouseenter", mouseEnterHandler);
          square.removeEventListener("mouseleave", mouseLeaveHandler);
          square.removeEventListener("click", clickHandler);
        });
        activateBoard();
      }
    }

    // const ship = new Ship(shipLength, coordinates);
    //should place ships to specific coordinates by calling the ship factory function.
  };

  const enableAttacks = () => {
    //enables event listeners on the enemy board
    const enemySquares = document.querySelectorAll(".enemy-square");

    enemySquares.forEach((square) => {
      square.addEventListener("click", attackClickHandler);
    });
  };

  function attackClickHandler(e) {
    //runs when an enemy square is clicked
    const attackCoordinates =
      e.target.id.charAt(6) + "-" + e.target.id.charAt(8);
    playerAttack(attackCoordinates, e);
  }

  const playerAttack = (attackCoordinates, e) => {
    //checks if the attack is a hit or not
    //sends a hit function to the correct ship or records the coordinates of the missed shot
    let hitAnyShip = false;

    enemyShips.forEach((ship) => {
      //checks if there's a ship on square, if so it makes the background red and checks if game is over
      if (ship.coordinates.includes(attackCoordinates)) {
        hitAnyShip = true;
        ship.hit();
        Display.hit();
        e.target.style.backgroundColor = "red";
        if (ship.isSunk()) {
          ship.coordinates.forEach((coordinate) => {
            const square = document.querySelector("#enemy-" + coordinate);
            square.innerHTML = "X";
            Display.shipDestroyed();
          });
          isGameOver();
        }
      }
    });

    if (!hitAnyShip) {
      Display.miss();
      // missedAttackMap.push(attackCoordinates);
      e.target.style.backgroundColor = "darkgrey";
    }

    e.target.removeEventListener("click", attackClickHandler);
    computerAttack();
  };

  const computerAttack = () => {
    let computerCoordinates = getRandomComputerCoordinates();

    let isCoordinateAvailable = checkCoordinateAvailable(computerCoordinates);

    while (!isCoordinateAvailable) {
      computerCoordinates = getRandomComputerCoordinates();
      isCoordinateAvailable = checkCoordinateAvailable(computerCoordinates);
    }

    const targetSquare = document.querySelector(
      "#player-" + computerCoordinates
    );

    let hitAnyShip = false;

    playerShips.forEach((ship) => {
      //checks if there's a ship on square, if so it makes the background red and checks if game is over
      if (ship.coordinates.includes(computerCoordinates)) {
        hitAnyShip = true;
        ship.hit();
        Display.hit();

        targetSquare.style.backgroundColor = "rgb(0,0,255,.5)";
        if (ship.isSunk()) {
          ship.coordinates.forEach((coordinate) => {
            const shipsquare = document.querySelector("#player-" + coordinate);
            shipsquare.innerHTML = "X";
            Display.shipDestroyed();
          });
          isGameOver();
        }
      }
    });

    if (!hitAnyShip) {
      Display.miss();
      // missedAttackMap.push(attackCoordinates);
      targetSquare.style.backgroundColor = "darkgrey";
    }

    function getRandomComputerCoordinates() {
      const RANDOMX = Math.floor(Math.random() * (10 - 0) + 0);
      const RANDOMY = Math.floor(Math.random() * (10 - 0) + 0);

      return RANDOMX + "-" + RANDOMY;

      //make a check to see if the coordinate hasnt already been fired on
      //------------------------- ---------------------------------------
    }

    function checkCoordinateAvailable(coordinates) {
      for (let i = 0; i < computerAttackMap.length; i++) {
        if (computerAttackMap[i] === coordinates) {
          return false;
        }
      }
      computerAttackMap.push(coordinates);
      return true;
    }
  };

  const isGameOver = () => {
    //checks if all ships have been destroyed

    let isEnemyShipsSunk = checkEnemyShipsSunk();
    let isAllPlayerShipsSunk = checkPlayerShipsSunk();

    if (isEnemyShipsSunk || isAllPlayerShipsSunk) {
      const enemySquares = document.querySelectorAll(".enemy-square");
      enemySquares.forEach((square) => {
        square.removeEventListener("click", attackClickHandler);
      });
      Display.gameOver();
      BoardDOM.restart();
    }

    function checkEnemyShipsSunk() {
      for (let i = 0; i < enemyShips.length; i++) {
        if (enemyShips[i].isSunk() === false) {
          return false;
        }
      }
      return true;
    }

    function checkPlayerShipsSunk() {
      for (let i = 0; i < playerShips.length; i++) {
        if (playerShips[i].isSunk() === false) {
          return false;
        }
      }
      return true;
    }
  };

  return {
    placeShips,
    playerAttack,
    enableAttacks,
    reset,
    placeEnemyShips,
  };
})();

function Player() {
  return {};
}

BoardDOM.createPlayerBoard();
BoardDOM.createEnemyBoard();
Gameboard.placeShips();
Gameboard.placeEnemyShips();

// module.exports = {
//   Ship: Ship,
//   Gameboard: Gameboard,
// };
