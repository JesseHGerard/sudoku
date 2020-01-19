/** Finds row, col, and group on game board.
 * @typedef {number} Index position in array (0-81)
 
 * @param {Index} index position of cell to position

 * @typedef {object} Position
 * @property {index[]} groupMembers includes Index's of other cells in same Group
 * @property {Index[]} rowMembers includes Index's of other cells in same Row
 * @property {Index[]} colMembers includes Index's of other cells in same Col
 * @property {Index}
 * @property {number} group group number (0-8)
 * @property {number} row row number (0-8)
 * @property {number} col col number (0-8)
 * @returns {Position}
 */
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
