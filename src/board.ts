import { World, Bodies } from "matter-js";

export function createBoard(world: World, boardWidth: number, boardHeight: number) {
  // -- Adjustable constants --
  const PEG_ROWS = 10;
  const PEG_SPACING = 40;

  const BIN_COUNT = PEG_ROWS + 1;     // e.g. 10 rows => 11 bins
  const BIN_OFFSET = 20;             // horizontal offset from outermost pegs
  const BIN_GAP = 100;               // vertical gap between last peg row & bins
  const BIN_PARTITION_WIDTH = 5;     // thickness of each vertical bin divider
  const BIN_PARTITION_HEIGHT = 100;  // height of each bin divider
  const FLOOR_THICKNESS = 20;        // thickness of the bottom wall

  // --------------------------
  // Create pegs in a triangular arrangement
  // --------------------------
  for (let row = 0; row < PEG_ROWS; row++) {
    const y = 100 + row * PEG_SPACING;
    const cols = row + 1;
    for (let col = 0; col < cols; col++) {
      const x = boardWidth / 2 - (cols / 2) * PEG_SPACING + col * PEG_SPACING;
      const peg = Bodies.circle(x, y, 5, {
        isStatic: true,
        render: { fillStyle: "black" },
      });
      World.add(world, peg);
    }
  }

  // --------------------------
  // Create side walls
  // --------------------------
  const leftWall = Bodies.rectangle(
    10,
    boardHeight / 2,
    20,
    boardHeight,
    {
      isStatic: true,
      render: { fillStyle: "gray" },
    }
  );
  const rightWall = Bodies.rectangle(
    boardWidth - 10,
    boardHeight / 2,
    20,
    boardHeight,
    {
      isStatic: true,
      render: { fillStyle: "gray" },
    }
  );
  World.add(world, [leftWall, rightWall]);

  // --------------------------
  // Identify bottom row of pegs
  // --------------------------
  const bottomRowY = 100 + (PEG_ROWS - 1) * PEG_SPACING;
  const leftmostPegX = boardWidth / 2 - (PEG_ROWS / 2) * PEG_SPACING;
  const rightmostPegX = leftmostPegX + (PEG_ROWS - 1) * PEG_SPACING;

  // --------------------------
  // Create vertical bin partitions below bottom pegs
  // --------------------------
  const totalBinSpan = (rightmostPegX - leftmostPegX) + BIN_OFFSET * 2;
  const partitionSpacing = totalBinSpan / BIN_COUNT;

  // Center the bin partitions at bottomRowY + BIN_GAP
  const binPartitionCenterY = bottomRowY + BIN_GAP + BIN_PARTITION_HEIGHT / 2;

  for (let i = 0; i <= BIN_COUNT; i++) {
    const x = (leftmostPegX - BIN_OFFSET) + i * partitionSpacing;
    const binPartition = Bodies.rectangle(
      x,
      binPartitionCenterY,
      BIN_PARTITION_WIDTH,
      BIN_PARTITION_HEIGHT,
      {
        isStatic: true,
        render: { fillStyle: "gray" },
      }
    );
    World.add(world, binPartition);
  }

  // --------------------------
  // Bottom wall to keep balls from rolling off the screen
  // --------------------------
  const floorY = binPartitionCenterY + BIN_PARTITION_HEIGHT / 2 + 10;
  const floor = Bodies.rectangle(
    boardWidth / 2,
    floorY,
    boardWidth,
    FLOOR_THICKNESS,
    {
      isStatic: true,
      render: { fillStyle: "gray" },
    }
  );
  World.add(world, floor);
}
