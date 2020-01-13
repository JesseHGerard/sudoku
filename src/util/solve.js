import { determinePosition } from "./determinePosition";
import { challenge } from "./challenge";

export function solve(puzzle) {
  const start = Date.now();
  const state = puzzle.map((value, index) => {
    return {
      value,
      constant: !!value,
      index,
      ...determinePosition(index)
    };
  });

  let current = 0;
  let directionForward = true;
  let loops = 0;

  try {
    while (current < state.length) {
      loops++;

      if (isConstant(state[current])) {
        if (directionForward) {
          current++;
        } else {
          current--;
          checkForUnsolvable(current);
        }
        continue;
      }

      if (directionForward) {
        const options = generateOptions(current, state);
        if (options.length < 1) {
          directionForward = false;
          state[current].value = undefined;
          state[current].options = undefined;
          current--;
          checkForUnsolvable(current);
        } else {
          state[current].value = options.shift();
          state[current].options = options;
          current++;
        }
      } else {
        if (state[current].options.length === 0) {
          state[current].value = undefined;
          state[current].options = undefined;
          current--;
          checkForUnsolvable(current);
        } else {
          state[current].value = state[current].options.shift();
          directionForward = true;
          current++;
        }
      }
    }
  } catch (error) {
    console.warn("Puzzle is not solvable");
    console.warn(error);
  }
  console.log(
    `FINISHED in ${loops} loops`,
    state.length,
    state.map(({ value }) => value).join(", ")
  );
  console.log("Time", (Date.now() - start) / 1000);
  return state.map(({ value }) => value);
}

function generateOptions(index, state) {
  const options = [];
  for (let i = 1; i <= 9; i++) {
    if (challenge(index, i, state)) {
      options.push(i);
    }
  }
  return options;
}

function isConstant(cell) {
  return !!cell.constant;
}

function checkForUnsolvable(current) {
  if (current < 0) {
    throw Error("Reached beginning");
  }
}
