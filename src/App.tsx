import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { Engine, Events, Render, Runner } from "matter-js";
import { createBoard } from "./board";
import { dropBall } from "./ball";

const App: React.FC = () => {
  const simulationRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const renderRef = useRef<Render | null>(null);
  const runnerRef = useRef<Runner | null>(null);

  // Number of bins = PEG_ROWS + 1 (from board.ts). For 10 rows, that's 11 bins.
  const BIN_COUNT = 11;
  // We'll track how many balls have landed in each bin.
  const [binCounts, setBinCounts] = useState<number[]>(
    Array(BIN_COUNT).fill(0)
  );

  // Number of balls to drop on click
  const [numBalls, setNumBalls] = useState<number>(100);

  // Simulation dimensions
  const WIDTH = 700;
  const HEIGHT = 970;

  // Initialize the Matter.js simulation
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

    // Reset bin counts to zero
    setBinCounts(Array(BIN_COUNT).fill(0));

    // Create engine & renderer
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

    // Create board with sensors
    createBoard(engine.world, WIDTH, HEIGHT);

    // Listen for collisions
    Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;

        // Check if one body is a bin sensor and the other is a ball
        if (bodyA.label.startsWith("binSensor_") && bodyB.label === "ball") {
          handleBinCollision(bodyA.label, bodyB.id);
        } else if (
          bodyB.label.startsWith("binSensor_") &&
          bodyA.label === "ball"
        ) {
          handleBinCollision(bodyB.label, bodyA.id);
        }
      });
    });

    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);
    Render.run(render);
  };

  // Handle bin collision by parsing the bin index from the label.
  const handleBinCollision = (sensorLabel: string, ballId: number) => {
    // Example: "binSensor_3" => binIndex = 3
    const binIndex = parseInt(sensorLabel.replace("binSensor_", ""), 10);

    // Increment that bin's count in state
    setBinCounts((prevCounts) => {
      const newCounts = [...prevCounts];
      newCounts[binIndex] += 1;
      return newCounts;
    });
  };

  // Drop "numBalls" balls at the mouse position
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!engineRef.current || !simulationRef.current) return;
    const rect = simulationRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let i = 0; i < numBalls; i++) {
      dropBall(engineRef.current.world, x, y);
    }
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

  // Restart the simulation
  const handleRestart = () => {
    initSimulation();
  };

  // Simple bar chart
  // We'll assume the largest bin might get up to 200 or so.
  // Scale each bar by a factor for visibility.
  const maxCount = Math.max(...binCounts);
  const scale = maxCount > 0 ? 100 / maxCount : 1; // scale so the tallest bar is ~100px

  return (
    <Container sx={{ py: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Galton Board Simulator
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            label="Number of Balls per Click"
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

      {/* The simulation canvas */}
      <div
        ref={simulationRef}
        onClick={handleCanvasClick}
        style={{ marginBottom: "2rem" }}
      />

      {/* Simple bar chart showing bin counts */}
      <Typography variant="h6">Distribution</Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "end",
          gap: 1,
          height: 120,
        }}
      >
        {binCounts.map((count, i) => (
          <Box
            key={i}
            sx={{
              width: 20,
              backgroundColor: "orange",
              height: `${count * scale}px`,
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
              color: "#000",
            }}
          >
            {/* Label the bar with the count */}
            <Typography
              variant="caption"
              sx={{ transform: "rotate(-90deg)", mb: 1 }}
            >
              {count}
            </Typography>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default App;
