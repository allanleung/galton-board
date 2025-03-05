import { World, Bodies } from "matter-js";

export function dropBall(world: World) {
  // Assumed board configuration:
  const boardWidth = 800;
  const pegSpacing = 50;
  
  // Compute x so that the ball drops directly above the first peg.
  const x = boardWidth / 2 - (pegSpacing / 2); // 375 for boardWidth 800 and pegSpacing 50
  
  // Set y high enough so the ball falls onto the peg (adjust as needed)
  const y = 30;
  
  const ball = Bodies.circle(x, y, 7, {
    restitution: 0.5,
    friction: 0.05,
    render: { fillStyle: "blue" }
  });
  World.add(world, ball);
}
