import React from "react";

type GridProps = {
  grid: number[][];
  updateGrid: (i: number, j: number) => void;
};

const Grid: React.FC<GridProps> = ({ grid, updateGrid }) => {
  return (
    <div>
      {grid.map((row, i: number) => (
        <div className='flex w-full justify-center' key={i}>
          {row.map((col, j: number) => {
            const backgroundColor = col === 1 ? "black" : "";
            return (
              <div
                className='w-2 h-2 p-1 border-2 border-solid border-gray-200'
                style={{
                  backgroundColor: backgroundColor,
                }}
                key={j}
                onClick={() => updateGrid(i, j)}
              ></div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Grid;
