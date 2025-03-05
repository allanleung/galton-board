import { World, Bodies } from "matter-js";

export function dropBall(world: World) {
  const x = 400 + (Math.random() - 0.5) * 20; // Drop near center with slight randomness
  const y = 50;
  const ball = Bodies.circle(x, y, 10, { restitution: 0.5, friction: 0.05, render: { fillStyle: "blue" } });
  World.add(world, ball);
}
