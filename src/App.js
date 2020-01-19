/** @jsx jsx */
import { jsx } from "@emotion/core";
/* eslint-disable no-unused-vars */
import {
  Fragment,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback
} from "react";

import { solve } from "./util/solve";
import { challenge } from "./util/challenge";
import { determinePosition } from "./util/determinePosition";
import { CreateWorker } from "./util/CreateWorker";
import SolverWorker from "./Solver.worker.js";

import { BoardContainer } from "./components/BoardContainer";

const CELL_SIZE = 50;
const BOARD_SIZE = CELL_SIZE * 9;
const GROUP_DIVIDER_COLOR = "black";
const CELL_DIVIDER_COLOR = "grey";
const PICKER_BACKGROUND_COLOR = "black";
const PICKER_FOREGROUND_COLOR = "white";

function App() {
  const { current: solverWorker } = useRef(SolverWorker());
  const [gameState, setGameState] = useState(
    [...Array(81)].map(() => undefined)
  );

  const handleSolveClick = useCallback(() => {
    import("rust").then(({ solve: solveWithRust }) => {
      const start = performance.now();
      const solution = solveWithRust(gameState);
      const end = performance.now();
      setGameState([...solution]);
      console.log(
        `rust solution in ${Math.floor((end - start) * 100) / 100}ms`,
        solution
      );
    });

    const solvedCallback = ({ data: { puzzle, time } }) => {
      console.log(`worker solution in ${time}ms`, puzzle);
      solverWorker.removeEventListener("message", solvedCallback);
    };
    solverWorker.addEventListener("message", solvedCallback);
    solverWorker.postMessage({ puzzle: gameState });
  }, [gameState, solverWorker]);

  return (
    <Fragment>
      <BoardContainer>
        {gameState.map((_, index) => (
          <Cell
            key={index}
            index={index}
            gameState={gameState}
            setGameState={setGameState}
          />
        ))}
      </BoardContainer>
      <button onClick={handleSolveClick}>Solve</button>
    </Fragment>
  );
}

export default App;

function Cell({ index, gameState, setGameState }) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div
      css={{
        position: "relative",
        boxSizing: "border-box",
        height: CELL_SIZE,
        width: CELL_SIZE,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: '"Helvetica", san-serif',
        borderWidth: 0,
        borderStyle: "solid",
        outline: "none",
        ...borderStyle(index)
      }}
      tabIndex={0}
      onClick={() => setShowPicker(true)}
    >
      {gameState[index]}
      {showPicker && (
        <Picker
          gameState={gameState}
          setGameState={setGameState}
          index={index}
          setShowPicker={setShowPicker}
        />
      )}
    </div>
  );
}

function Picker({ gameState, setGameState, setShowPicker, index }) {
  const [availableNumbers, setAvailableNumbers] = useState([]);

  useEffect(() => {
    const formattedState = gameState.map((value, index) => {
      return {
        value,
        constant: !!value,
        index,
        ...determinePosition(index)
      };
    });

    const nextAvailableNumbers = [];
    for (let i = 1; i <= 9; i++) {
      if (challenge(index, i, formattedState)) {
        nextAvailableNumbers.push(i);
      }
    }
    setAvailableNumbers(nextAvailableNumbers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      css={{
        boxSizing: "border-box",
        height: 3 * CELL_SIZE,
        width: 3 * CELL_SIZE,
        backgroundColor: PICKER_BACKGROUND_COLOR,
        color: PICKER_FOREGROUND_COLOR,
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1,
        display: "flex",
        flexWrap: "wrap"
      }}
    >
      {[...Array(9)].map((_, numberIndex) => {
        const currentValue = gameState[index];
        const currentNumber = numberIndex + 1;
        const isAvailableNumber = availableNumbers.includes(numberIndex + 1);
        return (
          <div
            key={numberIndex}
            css={{
              boxSizing: "border-box",
              width: CELL_SIZE,
              height: CELL_SIZE,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "100%",
              borderColor: PICKER_FOREGROUND_COLOR,
              borderStyle: "solid",
              borderWidth: currentValue === currentNumber ? 1 : 0
            }}
            onClick={
              currentValue === currentNumber
                ? event => {
                    event.stopPropagation();
                    const nextGameState = [...gameState];
                    nextGameState[index] = undefined;
                    setGameState(nextGameState);
                    setShowPicker(false);
                  }
                : isAvailableNumber
                ? event => {
                    event.stopPropagation();
                    const nextGameState = [...gameState];
                    nextGameState[index] = currentNumber;
                    setGameState(nextGameState);
                    setShowPicker(false);
                  }
                : event => {
                    event.stopPropagation();
                    setShowPicker(false);
                  }
            }
          >
            {isAvailableNumber && currentNumber}
          </div>
        );
      })}
    </div>
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
