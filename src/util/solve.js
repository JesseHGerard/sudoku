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
  // console.log(state);

  let current = 0;
  let loops = 0;

  try {
    while (current < state.length) {
      loops++;
      console.log(`CURRENT: ${current}, value: ${state[current].value}`);

      if (isConstant(state[current])) {
        current++;
        console.log("  is constant");
        continue;
      }

      if (!state[current].value) {
        const newOptions = generateOptions(current, state);
        if (newOptions.length > 0) {
          state[current].value = newOptions.shift();
          state[current].options = newOptions;
          console.log(`  generated new options`);
          console.log(`  new value ${state[current].value}`);
          current++;
          continue;
        } else {
          console.log("  no options generated");
          let next = current - 1;
          while (!hasOptions(state[next])) {
            while (isConstant(state[next])) {
              next--;
            }

            state[next].value = undefined;
            state[next].options = undefined;
            console.log(`  reset ${next}`);
            next--;
          }
          const nextValue = state[next].options.shift();
          console.log(`  stepped back to ${next} with value ${nextValue}`);
          state[next].value = nextValue;
          current = next + 1;
          continue;
        }
      }
      console.log("BAD EXIT", current);
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

function hasOptions(cell) {
  if (cell === undefined) {
    throw Error(`Puzzle is not solvable`);
  }
  return Array.isArray(cell.options) && cell.options.length > 0;
}
