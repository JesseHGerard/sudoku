export function solve(puzzle) {
  const state = puzzle.map((value, index) => {
    return {
      value,
      constant: !!value,
      index,
      ...determinePosition(index)
    };
  });
  console.log(state);

  let current = 0;
  let loops = 0;

  while (current < state.length) {
    loops++;
    console.log(`CURRENT: ${current}, value: ${state[current].value}`);
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
        let next = current - 1;
        while (!hasOptions(state[next])) {
          if (next < 0) {
            throw Error("REACHED BEGINNING");
          } else {
            state[next].value = undefined;
            console.log(`  reset ${next}`);
            next--;
          }
        }
        console.log(`  stepped back to ${next}`);
        state[next].value = state[next].options.shift();
        current = next + 1;
        continue;
      }
    }
  }
  console.log(
    `FINISHED in ${loops} loops`,
    state.length,
    state.map(({ value }) => value).join(", ")
  );
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

function hasOptions(cell) {
  return Array.isArray(cell.options) && cell.options.length > 0;
}

function challenge(index, value, state) {
  const cell = state[index];
  let passedRow = !cell.rowMembers
    .map(rowMemberIndex => state[rowMemberIndex].value)
    .includes(value);
  let passedCol =
    passedRow &&
    !cell.colMembers
      .map(colMemberIndex => state[colMemberIndex].value)
      .includes(value);
  let passedGroup =
    passedRow &&
    passedCol &&
    !cell.groupMembers
      .map(groupMemberIndex => state[groupMemberIndex].value)
      .includes(value);
  return passedRow && passedCol && passedGroup;
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
