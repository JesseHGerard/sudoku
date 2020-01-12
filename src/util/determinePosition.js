export function determinePosition(index) {
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
