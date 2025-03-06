import { World, Bodies } from "matter-js";

export function dropBall(world: World, dropX?: number, dropY?: number) {
  const x = typeof dropX === "number" ? dropX : 350;
  const y = typeof dropY === "number" ? dropY : 50;

  const ball = Bodies.circle(x, y, 7, {
    label: "ball", // <--- so we know it's a ball
    restitution: 0.5,
    friction: 0.05,
    render: { fillStyle: "blue" },
  });
  World.add(world, ball);
}
