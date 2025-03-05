import Matter, { Engine, Render, World, Bodies, Body, Events } from "matter-js";

// Create physics engine and world
const engine = Engine.create();
const world = engine.world;

// Create renderer
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: 800,
    height: 600,
    wireframes: false, // Use solid colors for better visualization
  },
});

// Start the simulation
Engine.run(engine);
Render.run(render);
