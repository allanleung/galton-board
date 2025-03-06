import { World, Bodies } from "matter-js";

type PegLayout = "triangle" | "rectangle";

interface BoardConfig {
  pegLayout: PegLayout;
  pegRows: number;
  pegCols: number;
  pegTopOffset: number;
  pegVerticalSpacing: number;
  pegSideMargin: number;
  pegSize: number;
  binGap: number;
  binOffset: number;
  binPartitionWidth: number;
  binPartitionHeight: number;
  floorThickness: number;
  wallThickness: number;
}

const DEFAULT_BOARD_CONFIG: BoardConfig = {
  pegLayout: "triangle", // switch to "rectangle" if desired
  pegRows: 10,
  pegCols: 10,
  pegTopOffset: 150,
  pegVerticalSpacing: 50,
  pegSideMargin: 50,
  pegSize: 15,
  binGap: 100,
  binOffset: 20,
  binPartitionWidth: 5,
  binPartitionHeight: 300,
  floorThickness: 40,
  wallThickness: 40,
};

export function createBoard(
  world: World,
  boardWidth: number,
  boardHeight: number,
  config: BoardConfig = DEFAULT_BOARD_CONFIG
) {
  createPegs(world, boardWidth, config);
  createWallsAndFloor(world, boardWidth, boardHeight, config);
  createBinsAndSensors(world, boardWidth, boardHeight, config);
}

/**
 * Creates either a triangular or rectangular arrangement of pegs.
 */
function createPegs(world: World, boardWidth: number, config: BoardConfig) {
  const { pegLayout } = config;
  if (pegLayout === "triangle") {
    createTrianglePegs(world, boardWidth, config);
  } else {
    createRectangularPegs(world, boardWidth, config);
  }
}

/**
 * Triangular peg arrangement, bottom row has `pegRows` pegs,
 * row above has `pegRows-1`, etc.
 */
function createTrianglePegs(
  world: World,
  boardWidth: number,
  {
    pegRows,
    pegTopOffset,
    pegVerticalSpacing,
    pegSideMargin,
    pegSize,
  }: BoardConfig
) {
  const bottomRowPegs = pegRows - 1;
  const bottomRowWidth = boardWidth - 2 * pegSideMargin;
  const bottomPegSpacing = bottomRowWidth / bottomRowPegs;

  for (let row = 0; row < pegRows; row++) {
    const y = pegTopOffset + row * pegVerticalSpacing;
    const pegsInThisRow = row + 1;
    const rowOffset = ((pegRows - 1 - row) * bottomPegSpacing) / 2;

    for (let col = 0; col < pegsInThisRow; col++) {
      const x = pegSideMargin + rowOffset + col * bottomPegSpacing;
      const peg = Bodies.circle(x, y, pegSize, {
        isStatic: true,
        render: { fillStyle: "black" },
      });
      World.add(world, peg);
    }
  }
}

/**
 * Rectangular (grid) peg arrangement with `pegRows` x `pegCols`.
 */
function createRectangularPegs(
  world: World,
  boardWidth: number,
  {
    pegRows,
    pegCols,
    pegTopOffset,
    pegVerticalSpacing,
    pegSideMargin,
    pegSize,
  }: BoardConfig
) {
  const totalWidth = boardWidth - 2 * pegSideMargin;
  const horizontalSpacing = totalWidth / (pegCols - 1);

  for (let row = 0; row < pegRows; row++) {
    const y = pegTopOffset + row * pegVerticalSpacing;
    for (let col = 0; col < pegCols; col++) {
      const x = pegSideMargin + col * horizontalSpacing;
      const peg = Bodies.circle(x, y, pegSize, {
        isStatic: true,
        render: { fillStyle: "black" },
      });
      World.add(world, peg);
    }
  }
}

/**
 * Creates left/right walls and the floor.
 */
function createWallsAndFloor(
  world: World,
  boardWidth: number,
  boardHeight: number,
  { wallThickness, floorThickness }: BoardConfig
) {
  const leftWallX = wallThickness / 2;
  const rightWallX = boardWidth - wallThickness / 2;
  const wallY = boardHeight / 2;

  const leftWall = Bodies.rectangle(
    leftWallX,
    wallY,
    wallThickness,
    boardHeight,
    {
      isStatic: true,
      render: { fillStyle: "gray" },
    }
  );

  const rightWall = Bodies.rectangle(
    rightWallX,
    wallY,
    wallThickness,
    boardHeight,
    {
      isStatic: true,
      render: { fillStyle: "gray" },
    }
  );

  const floorY = boardHeight - floorThickness / 2;
  const floor = Bodies.rectangle(
    boardWidth / 2,
    floorY,
    boardWidth,
    floorThickness,
    {
      isStatic: true,
      render: { fillStyle: "gray" },
    }
  );

  World.add(world, [leftWall, rightWall, floor]);
}

/**
 * Creates bin partitions and invisible sensors to detect objects falling.
 * Now includes a small red line to visualize each sensor.
 */
function createBinsAndSensors(
  world: World,
  boardWidth: number,
  boardHeight: number,
  {
    pegRows,
    pegTopOffset,
    pegVerticalSpacing,
    pegSideMargin,
    binGap,
    binOffset,
    binPartitionWidth,
    binPartitionHeight,
    floorThickness,
  }: BoardConfig
) {
  // For sensor placement, compute spacing between “bins” based on the final peg row.
  const bottomRowY = pegTopOffset + (pegRows - 1) * pegVerticalSpacing;
  const binCount = pegRows + 1;

  const leftmostPegX = pegSideMargin;
  const rightmostPegX = boardWidth - pegSideMargin;
  const totalBinSpan = rightmostPegX - leftmostPegX + binOffset * 2;
  const partitionSpacing = totalBinSpan / binCount;

  // Create vertical partitions (bins).
  for (let i = 0; i <= binCount; i++) {
    const x = leftmostPegX - binOffset + i * partitionSpacing;
    const binPartition = Bodies.rectangle(
      x,
      bottomRowY + binGap + binPartitionHeight / 2,
      binPartitionWidth,
      binPartitionHeight,
      {
        isStatic: true,
        render: { fillStyle: "gray" },
      }
    );
    World.add(world, binPartition);
  }

  // Create sensor bodies.
  const floorY = boardHeight - floorThickness / 2;
  const sensorHeight = 400;
  const sensorY = floorY - floorThickness / 2 - sensorHeight / 2;

  for (let i = 0; i < binCount; i++) {
    const sensorLeft = leftmostPegX - binOffset + i * partitionSpacing;
    const sensorCenterX = sensorLeft + partitionSpacing / 2;

    // 1) The full, invisible sensor area.
    const sensorBody = Bodies.rectangle(
      sensorCenterX,
      sensorY,
      partitionSpacing,
      sensorHeight,
      {
        isStatic: true,
        isSensor: true,
        label: `binSensor_${i}`,
        render: { fillStyle: "transparent", opacity: 0 },
      }
    );
    World.add(world, sensorBody);

    // 2) A thin red line showing where the sensor is horizontally.
    const lineThickness = 1;
    const sensorIndicator = Bodies.rectangle(
      sensorCenterX,
      sensorY, // same center Y
      partitionSpacing,
      lineThickness, // small height for a “line”
      {
        isStatic: true,
        isSensor: true, // so it won't block objects
        render: {
          fillStyle: "red",
          opacity: 1, // fully visible
        },
      }
    );
    World.add(world, sensorIndicator);
  }
}
