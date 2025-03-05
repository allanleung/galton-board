import { Engine, Render, World } from "matter-js";
import { createBoard } from "./board";
import { dropBall } from "./ball";

// Create engine and world
const engine = Engine.create();
const world = engine.world;

// Create the renderer
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: 800,
    height: 600,
    wireframes: false, // Use solid colors for better visualization
  },
});

// Add board elements
createBoard(world);

// Drop a ball every second
setInterval(() => dropBall(world), 1000);

// Run the physics engine and renderer
Engine.run(engine);
Render.run(render);
