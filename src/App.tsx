import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { Engine, Render, Runner } from "matter-js";
import { createBoard } from "./board";
import { dropBall } from "./ball";

const App: React.FC = () => {
  const simulationRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const renderRef = useRef<Render | null>(null);
  const runnerRef = useRef<Runner | null>(null);

  const [numBalls, setNumBalls] = useState<number>(100);

  // Simulation dimensions
  const WIDTH = 700;
  const HEIGHT = 970;

  const initSimulation = () => {
    // Clean up previous simulation if it exists
    if (renderRef.current) {
      Render.stop(renderRef.current);
      renderRef.current.canvas.remove();
      renderRef.current.textures = {};
    }
    if (runnerRef.current) {
      Runner.stop(runnerRef.current);
    }

    const engine = Engine.create();
    engine.gravity.y = 1;
    engine.gravity.scale = 0.01;
    engineRef.current = engine;

    const render = Render.create({
      element: simulationRef.current!,
      engine: engine,
      options: {
        width: WIDTH,
        height: HEIGHT,
        wireframes: false,
        background: "#1A1A1A",
      },
    });
    renderRef.current = render;

    // Create board with the provided dimensions.
    createBoard(engine.world, WIDTH, HEIGHT);

    // Do NOT drop any balls initially; they will be dropped on mouse click.

    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);
    Render.run(render);
  };

  useEffect(() => {
    initSimulation();
    return () => {
      if (renderRef.current) {
        Render.stop(renderRef.current);
        renderRef.current.canvas.remove();
        renderRef.current.textures = {};
      }
      if (runnerRef.current) {
        Runner.stop(runnerRef.current);
      }
    };
  }, []);

  // Handler for restarting the simulation.
  const handleRestart = () => {
    initSimulation();
  };

  // Handler for dropping balls at the mouse click position.
  // Drops "numBalls" balls at the location of the mouse click.
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!engineRef.current || !simulationRef.current) return;
    const rect = simulationRef.current.getBoundingClientRect();
    // Compute coordinates relative to the simulation container.
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    for (let i = 0; i < numBalls; i++) {
      dropBall(engineRef.current.world, x, y);
    }
  };

  return (
    <Container sx={{ py: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Galton Board Simulator
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            label="Number of Balls"
            type="number"
            value={numBalls}
            onChange={(e) => setNumBalls(Number(e.target.value))}
            InputProps={{ inputProps: { min: 1 } }}
          />
          <Button variant="contained" onClick={handleRestart}>
            Restart Simulation
          </Button>
        </Box>
      </Box>
      {/* Click anywhere in this div to drop balls at that position */}
      <div ref={simulationRef} onClick={handleCanvasClick} />
    </Container>
  );
};

export default App;
