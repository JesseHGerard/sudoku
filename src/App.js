/** @jsx jsx */
import { jsx } from "@emotion/core";
/* eslint-disable no-unused-vars */
import { Fragment, useContext, useState } from "react";
import { solve } from "./solve";
/* eslint-enable no-unused-vars */

const CELL_SIZE = 50;
const BOARD_SIZE = CELL_SIZE * 9;
const GROUP_DIVIDER_COLOR = "black";
const CELL_DIVIDER_COLOR = "grey";

function App() {
  const [gameState, setGameState] = useState([...Array(81)]);
  return (
    <Fragment>
      <div
        css={{
          width: BOARD_SIZE,
          height: BOARD_SIZE,
          display: "flex",
          flexWrap: "wrap"
        }}
      >
        {[...Array(81)].map((_, index) => (
          <Cell
            key={index}
            index={index}
            gameState={gameState}
            setGameState={setGameState}
          />
        ))}
      </div>
      <button onClick={() => setGameState(solve(gameState))}>Solve</button>
    </Fragment>
  );
}

export default App;

function Cell({ index, gameState, setGameState }) {
  return (
    <div
      css={{
        boxSizing: "border-box",
        height: CELL_SIZE,
        width: CELL_SIZE,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: '"Helvetica", san-serif',
        borderWidth: 0,
        borderStyle: "solid",
        ...borderStyle(index)
      }}
      tabIndex={0}
      onClick={() => {
        const newState = [...gameState];
        if (!newState[index]) {
          newState[index] = 1;
        } else if (newState[index] >= 9) {
          newState[index] = undefined;
        } else {
          newState[index]++;
        }
        setGameState(newState);
      }}
    >
      {gameState[index]}
    </div>
  );
}

function determinePosition(index) {
  const col = determineCol(index);
  const row = determineRow(index);
  const group = determineGroup(index);

  const range = [...Array(81)].map((_, nextRowIndex) => nextRowIndex);

  return {
    group,
    col,
    row,
    colMembers: range.filter(
      (_, colIndex) => colIndex !== index && determineCol(colIndex) === col
    ),
    rowMembers: range.filter(
      (_, rowIndex) => rowIndex !== index && determineRow(rowIndex) === row
    ),
    groupMembers: range.filter(
      (_, groupIndex) =>
        groupIndex !== index && determineGroup(groupIndex) === group
    )
  };
}

function determineCol(index) {
  return index % 9;
}
function determineRow(index) {
  return Math.floor(index / 9);
}
function determineGroup(index) {
  return (
    Math.floor(determineCol(index) / 3) +
    Math.floor(determineRow(index) / 3) * 3
  );
}

function borderStyle(index) {
  return {
    ...borderTop(index),
    ...borderLeft(index)
  };
}

function borderTop(index) {
  if (index <= 8) {
    /* board top */
    return { borderTopWidth: 0 };
  } else if ((index >= 27 && index <= 35) || (index >= 54 && index <= 62)) {
    /* group top */
    return {
      borderTopWidth: 2,
      borderTopColor: GROUP_DIVIDER_COLOR
    };
  } else {
    return {
      borderTopWidth: 1,
      borderTopColor: CELL_DIVIDER_COLOR
    };
  }
}

function borderLeft(index) {
  const remainder = index % 9;
  if (remainder === 0) {
    /* board left */
    return { borderLeftWidth: 0 };
  } else if (remainder === 3 || remainder === 6) {
    /* group left */
    return {
      borderLeftWidth: 2,
      borderLeftColor: GROUP_DIVIDER_COLOR
    };
  } else {
    return {
      borderLeftWidth: 1,
      borderLeftColor: CELL_DIVIDER_COLOR
    };
  }
}
