import { World, Bodies } from "matter-js";

export function dropBall(world: World, dropX?: number, dropY?: number) {
  // Use provided coordinates if available; otherwise default.
  const x = typeof dropX === 'number' ? dropX : 400 + (Math.random() - 0.5) * 20;
  const y = typeof dropY === 'number' ? dropY : 50;
  
  const ball = Bodies.circle(x, y, 7, {
    restitution: 0.5,
    friction: 0.05,
    render: { fillStyle: "blue" },
  });
  World.add(world, ball);
}
