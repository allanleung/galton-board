import { Engine, Render, Runner } from "matter-js";
import { createBoard } from "./board";
import { dropBall } from "./ball";

// Create the engine
const engine = Engine.create();

// Use engine.gravity (instead of world.gravity) to avoid deprecation warnings
engine.gravity.y = 1;
engine.gravity.scale = 0.01;

// Define width & height for the renderer
const WIDTH = 700;
const HEIGHT = 770;

// Create the renderer
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: WIDTH,
    height: HEIGHT,
    wireframes: false, // Use solid colors
    background: "#1A1A1A",
  },
});

// Add board elements, passing the same width & height
createBoard(engine.world, WIDTH, HEIGHT);

// Drop 100 balls at once (adjust as needed)
for (let i = 0; i < 250; i++) {
  dropBall(engine.world);
}

// Use a Runner to update the engine over time
const runner = Runner.create();
Runner.run(runner, engine);

// Start the renderer
Render.run(render);
