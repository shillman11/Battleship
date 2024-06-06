const { Ship } = require("./main");

test("Ship factory creates a ship with the correct length", () => {
  const ship = Ship(3);
  expect(ship.length).toBe(3);
});

test("Ship factory initializes with zero hits", () => {
  const ship = Ship(4);
  expect(ship.getNumberOfHits()).toBe(0);
});

test("Ship factory initializes as alive", () => {
  const ship = Ship(2);
  expect(ship.isAlive).toBe(true);
});

test("Hit method increases the number of hits", () => {
  const ship = Ship(5);
  ship.hit();
  expect(ship.getNumberOfHits()).toBe(1);
});

test("isSunk method correctly determines if the ship is sunk", () => {
  const ship = Ship(3);
  ship.hit();
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});

test("isSunk method correctly determines if the ship is not sunk", () => {
  const ship = Ship(2);
  ship.hit();
  expect(ship.isSunk()).toBe(false);
});
