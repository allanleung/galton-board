import { World, Bodies } from "matter-js";

export function createBoard(world: World) {
  const pegRows = 10;
  const pegSpacing = 50;
  const boardWidth = 800;
  const boardHeight = 600;

  // Create pegs
  for (let row = 0; row < pegRows; row++) {
    const y = 100 + row * pegSpacing;
    const cols = row + 1;
    for (let col = 0; col < cols; col++) {
      const x = (boardWidth / 2) - (cols / 2) * pegSpacing + col * pegSpacing;
      const peg = Bodies.circle(x, y, 5, { isStatic: true, render: { fillStyle: "black" } });
      World.add(world, peg);
    }
  }

  // Create side walls
  const leftWall = Bodies.rectangle(10, boardHeight / 2, 20, boardHeight, { isStatic: true });
  const rightWall = Bodies.rectangle(boardWidth - 10, boardHeight / 2, 20, boardHeight, { isStatic: true });
  World.add(world, [leftWall, rightWall]);

  // Create bins at the bottom
  const binWidth = pegSpacing;
  for (let i = 0; i < pegRows + 1; i++) {
    const bin = Bodies.rectangle(i * binWidth, boardHeight - 20, 5, 100, { isStatic: true });
    World.add(world, bin);
  }
}
