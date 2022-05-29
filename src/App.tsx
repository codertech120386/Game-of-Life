import React, { useEffect, useState } from "react";

import Grid from "./components/Grid";

const gridRows = 100;
const gridCols = 100;
const gliderLength = 8;

const grid: number[][] = Array(gridRows)
  .fill(0)
  .map(() => Array(gridCols).fill(0));
let startValue = 0;

const App: React.FC = () => {
  const [generation, setGeneration] = useState(0);
  const [gridFull, setGridFull] = useState(grid);
  const [isPlaying, setIsPlaying] = useState(false);

  const updateGrid = (i: number, j: number) => {
    const gridClone = JSON.parse(JSON.stringify(gridFull));
    gridClone[i][j] = gridClone[i][j] === 0 ? 1 : 0;

    setGridFull(gridClone);
  };

  const makeGliders = (
    gridClone: number[][],
    intialValue: number = startValue
  ) => {
    let middleRow = Math.floor(gridRows / 2);

    for (let k = intialValue; k < intialValue + gliderLength; k++) {
      const upperRow = middleRow + k;
      const lowerRow = middleRow - k;

      if (upperRow < gridRows) {
        gridClone[upperRow][upperRow] = 1;
      }
      if (upperRow < gridRows && lowerRow >= 0) {
        gridClone[upperRow][lowerRow] = 1;
      }
      if (lowerRow >= 0) {
        gridClone[lowerRow][lowerRow] = 1;
      }
      if (upperRow < gridRows && lowerRow >= 0) {
        gridClone[lowerRow][upperRow] = 1;
      }
    }
  };

  const initialState = () => {
    let gridClone = JSON.parse(JSON.stringify(grid));
    makeGliders(gridClone, 0);

    setGridFull(gridClone);
  };

  const playButton = () => {
    setIsPlaying(true);
  };

  const getLiveCellsCount = (count: number, i: number, j: number) => {
    if (i > 0) if (gridFull[i - 1][j]) count++;
    if (i > 0 && j > 0) if (gridFull[i - 1][j - 1]) count++;
    if (i > 0 && j < gridCols - 1) if (gridFull[i - 1][j + 1]) count++;
    if (j < gridCols - 1) if (gridFull[i][j + 1]) count++;
    if (j > 0) if (gridFull[i][j - 1]) count++;
    if (i < gridRows - 1) if (gridFull[i + 1][j]) count++;
    if (i < gridRows - 1 && j > 0) if (gridFull[i + 1][j - 1]) count++;
    if (i < gridRows - 1 && j < gridCols - 1)
      if (gridFull[i + 1][j + 1]) count++;

    return count;
  };

  const play = () => {
    let gridClone = JSON.parse(JSON.stringify(gridFull));

    for (let i = 0; i < gridRows; i++) {
      for (let j = 0; j < gridCols; j++) {
        let liveCellsCount = getLiveCellsCount(0, i, j);

        if (gridFull[i][j] && (liveCellsCount < 2 || liveCellsCount > 3))
          gridClone[i][j] = 0;
        if (!gridFull[i][j] && liveCellsCount === 3) gridClone[i][j] = 1;
      }
    }

    makeGliders(gridClone);

    startValue++;
    setGridFull(gridClone);
    setGeneration((prevGeneration) => prevGeneration + 1);
  };

  const pauseButton = () => {
    setIsPlaying(false);
  };

  const saveToPersistentStorage = () => {
    localStorage.setItem("current_grid", JSON.stringify(gridFull));
    localStorage.setItem("startValue", startValue.toString());
  };

  const loadFromPersistentStorage = () => {
    const gridFullFromStorageString = localStorage.getItem("current_grid");
    if (gridFullFromStorageString) {
      const gridFullFromStorageArray = JSON.parse(gridFullFromStorageString);
      setGridFull(gridFullFromStorageArray);
      startValue = localStorage.getItem("startValue")
        ? +localStorage.getItem("startValue")!
        : 0;
    }
  };

  useEffect(() => {
    initialState();
  }, []);

  useEffect(() => {
    if (isPlaying) {
      let id = setInterval(() => {
        play();
      }, 50);
      return () => {
        clearInterval(id);
      };
    }
  });

  return (
    <div>
      <div className='flex justify-center'>
        <div className='my-4'>
          <button
            onClick={playButton}
            className='mr-16 py-2 px-4 bg-green-500 text-white'
          >
            Play
          </button>
          <button
            onClick={pauseButton}
            className='mr-16 py-2 px-4 bg-red-500 text-white'
          >
            Pause
          </button>

          <button
            onClick={saveToPersistentStorage}
            className='mr-16 py-2 px-4 bg-green-500 text-white'
          >
            Save to Persistent Storage
          </button>
          <button
            onClick={loadFromPersistentStorage}
            className='mr-16 py-2 px-4 bg-blue-500 text-white'
          >
            Load from Persistent Storage
          </button>

          <button
            onClick={initialState}
            className='py-2 px-4 bg-yellow-500 text-white'
          >
            Set To Initial State
          </button>
        </div>
      </div>
      <Grid grid={gridFull} updateGrid={updateGrid} />
      <div className='text-center mt-4 mb-16'>
        <h1 className='text-xl'>
          Generation <span className='text-2xl bold italic'>{generation}</span>
        </h1>
      </div>
    </div>
  );
};

export default App;
