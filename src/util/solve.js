import { determinePosition } from "./determinePosition";
import { challenge } from "./challenge";

export function solve(puzzle, animate) {
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
  const animationFrames = [];

  try {
    while (current < state.length) {
      loops++;

      if (animate && loops % animate.loopsPerFrame === 0) {
        animationFrames.push(state.map(({ value }) => value));
      }

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

    if (animationFrames.length) {
      /* add final frame to animation */
      animationFrames.push(state.map(({ value }) => value));
    }
  } catch (error) {
    console.warn("Puzzle is not solvable");
    console.warn(error);
  }

  return {
    answer: state.map(({ value }) => value),
    loops,
    ...(animationFrames.length > 0 ? { animationFrames } : {})
  };
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
