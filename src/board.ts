import { World, Bodies } from "matter-js";

export function createBoard(
  world: World,
  boardWidth: number,
  boardHeight: number
) {
  // -- Configuration Constants --
  const PEG_ROWS = 10;
  const PEG_TOP_OFFSET = 150;
  const PEG_VERTICAL_SPACING = 50;
  const PEG_SIDE_MARGIN = 50;
  const PEG_SIZE = 5;

  const BIN_GAP = 100;
  const BIN_OFFSET = 20;
  const BIN_PARTITION_WIDTH = 5;
  const BIN_PARTITION_HEIGHT = 100;
  const FLOOR_THICKNESS = 20;
  const WALL_THICKNESS = 40;

  // For the bottom row of pegs, leftmost at PEG_SIDE_MARGIN, rightmost at boardWidth - PEG_SIDE_MARGIN
  const bottomPegSpacing = (boardWidth - 2 * PEG_SIDE_MARGIN) / (PEG_ROWS - 1);

  // --- Create pegs in a triangular arrangement ---
  for (let row = 0; row < PEG_ROWS; row++) {
    const pegCount = row + 1;
    const y = PEG_TOP_OFFSET + row * PEG_VERTICAL_SPACING;
    const rowOffset = ((PEG_ROWS - 1 - row) * bottomPegSpacing) / 2;
    for (let col = 0; col < pegCount; col++) {
      const x = PEG_SIDE_MARGIN + rowOffset + col * bottomPegSpacing;
      const peg = Bodies.circle(x, y, PEG_SIZE, {
        isStatic: true,
        render: { fillStyle: "black" },
      });
      World.add(world, peg);
    }
  }

  const leftWall = Bodies.rectangle(
    WALL_THICKNESS / 2,
    boardHeight / 2,
    WALL_THICKNESS,
    boardHeight,
    { isStatic: true, render: { fillStyle: "gray" } }
  );
  const rightWall = Bodies.rectangle(
    boardWidth - WALL_THICKNESS / 2,
    boardHeight / 2,
    WALL_THICKNESS,
    boardHeight,
    { isStatic: true, render: { fillStyle: "gray" } }
  );

  const floorY = boardHeight - FLOOR_THICKNESS / 2;
  const floor = Bodies.rectangle(
    boardWidth / 2,
    floorY,
    boardWidth,
    FLOOR_THICKNESS,
    { isStatic: true, render: { fillStyle: "gray" } }
  );
  World.add(world, [leftWall, rightWall, floor]);

  // --- Create bins below the bottom row of pegs ---
  const bottomRowY = PEG_TOP_OFFSET + (PEG_ROWS - 1) * PEG_VERTICAL_SPACING;
  const BIN_COUNT = PEG_ROWS + 1;
  const leftmostPegX = PEG_SIDE_MARGIN;
  const rightmostPegX = boardWidth - PEG_SIDE_MARGIN;
  const totalBinSpan = rightmostPegX - leftmostPegX + BIN_OFFSET * 2;
  const partitionSpacing = totalBinSpan / BIN_COUNT;
  const binPartitionCenterY = bottomRowY + BIN_GAP + BIN_PARTITION_HEIGHT / 2;

  // for (let i = 0; i <= BIN_COUNT; i++) {
  //   const x = leftmostPegX - BIN_OFFSET + i * partitionSpacing;
  //   const binPartition = Bodies.rectangle(
  //     x,
  //     binPartitionCenterY,
  //     BIN_PARTITION_WIDTH,
  //     BIN_PARTITION_HEIGHT,
  //     {
  //       isStatic: true,
  //       render: { fillStyle: "gray" },
  //     }
  //   );
  //   World.add(world, binPartition);
  // }

  // ------------------------------------------------------------------
  // ADD BIN SENSORS
  // ------------------------------------------------------------------
  // We'll place a short, invisible rectangle in each bin to detect collisions.
  // We'll label them "binSensor_i" to identify which bin was hit.
  const sensorHeight = 10;
  const sensorY = floorY - FLOOR_THICKNESS / 2 - sensorHeight / 2; // just above the floor

  for (let i = 0; i < BIN_COUNT; i++) {
    // The sensor covers the horizontal region between partition i and partition i+1.
    const sensorLeft = leftmostPegX - BIN_OFFSET + i * partitionSpacing;
    const sensorCenter = sensorLeft + partitionSpacing / 2;

    const sensor = Bodies.rectangle(
      sensorCenter,
      sensorY,
      partitionSpacing,
      sensorHeight,
      {
        isStatic: true,
        isSensor: true, // <--- Important
        label: `binSensor_${i}`, // label to identify this bin in collisions
        render: {
          fillStyle: "transparent", // invisible
          opacity: 0,
        },
      }
    );

    World.add(world, sensor);
  }
}
