import { World, Bodies } from "matter-js";

export function createBoard(world: World, boardWidth: number, boardHeight: number) {
  // -- Adjustable Constants --
  const PEG_ROWS = 10;
  const PEG_TOP_OFFSET = 150;       // 150 pixels gap from the top for the first row
  const PEG_VERTICAL_SPACING = 50;  // Vertical spacing between peg rows
  const PEG_SIDE_MARGIN = 50;       // Ensure bottom-most pegs are 50 px from left/right walls

  // Compute spacing for the bottom row so that the leftmost peg is at PEG_SIDE_MARGIN
  // and the rightmost peg is at boardWidth - PEG_SIDE_MARGIN.
  const bottomPegSpacing = (boardWidth - 2 * PEG_SIDE_MARGIN) / (PEG_ROWS - 1);

  // --- Create pegs in a triangular arrangement ---
  for (let row = 0; row < PEG_ROWS; row++) {
    const pegCount = row + 1;
    const y = PEG_TOP_OFFSET + row * PEG_VERTICAL_SPACING;
    // Center each row relative to the full width.
    // The row offset shifts each row so that the bottom row spans exactly from PEG_SIDE_MARGIN to boardWidth - PEG_SIDE_MARGIN.
    const rowOffset = ((PEG_ROWS - 1) - row) * bottomPegSpacing / 2;
    for (let col = 0; col < pegCount; col++) {
      const x = PEG_SIDE_MARGIN + rowOffset + col * bottomPegSpacing;
      const peg = Bodies.circle(x, y, 5, {
        isStatic: true,
        render: { fillStyle: "black" },
      });
      World.add(world, peg);
    }
  }

  // --- Create side walls ---
  // Increase wall thickness to prevent balls from escaping.
  const wallThickness = 40;
  const leftWall = Bodies.rectangle(
    -wallThickness / 2,
    boardHeight / 2,
    wallThickness,
    boardHeight,
    {
      isStatic: true,
      render: { fillStyle: "gray" },
    }
  );
  const rightWall = Bodies.rectangle(
    boardWidth + wallThickness / 2,
    boardHeight / 2,
    wallThickness,
    boardHeight,
    {
      isStatic: true,
      render: { fillStyle: "gray" },
    }
  );
  World.add(world, [leftWall, rightWall]);

  // --- Create bins below the bottom row of pegs ---
  const bottomRowY = PEG_TOP_OFFSET + (PEG_ROWS - 1) * PEG_VERTICAL_SPACING;
  const BIN_COUNT = PEG_ROWS + 1;
  const BIN_OFFSET = 20;             // Extra horizontal offset for bins
  const BIN_GAP = 100;               // Vertical gap between bottom pegs and bins
  const BIN_PARTITION_WIDTH = 5;     // Thickness of each bin divider
  const BIN_PARTITION_HEIGHT = 400;  // Height of bin dividers
  const FLOOR_THICKNESS = 20;        // Thickness of the bottom wall

  // For bins, the leftmost peg is at PEG_SIDE_MARGIN and the rightmost at boardWidth - PEG_SIDE_MARGIN.
  const leftmostPegX = PEG_SIDE_MARGIN;
  const rightmostPegX = boardWidth - PEG_SIDE_MARGIN;
  const totalBinSpan = (rightmostPegX - leftmostPegX) + BIN_OFFSET * 2;
  const partitionSpacing = totalBinSpan / BIN_COUNT;
  const binPartitionCenterY = bottomRowY + BIN_GAP + BIN_PARTITION_HEIGHT / 2;

  for (let i = 0; i <= BIN_COUNT; i++) {
    const x = leftmostPegX - BIN_OFFSET + i * partitionSpacing;
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

  // --- Bottom wall to keep balls on screen ---
  // Position the floor so its bottom edge aligns with the simulation height.
  const floor = Bodies.rectangle(
    boardWidth / 2,
    boardHeight - FLOOR_THICKNESS / 2,
    boardWidth,
    FLOOR_THICKNESS,
    {
      isStatic: true,
      render: { fillStyle: "gray" },
    }
  );
  World.add(world, floor);
}
