export function challenge(index, value, state) {
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
