export const CELL_SIZE = 50;
export const BOARD_SIZE = CELL_SIZE * 9;
export const GROUP_DIVIDER_COLOR = "black";
export const CELL_DIVIDER_COLOR = "grey";
export const PICKER_BACKGROUND_COLOR = "black";
export const PICKER_FOREGROUND_COLOR = "white";

export const FRAMES_PER_SECOND = 30;
export const MAX_ANIMATION_RUNTIME = 30; /* seconds */

const tokens = {
  cellSize: CELL_SIZE,
  boardSize: BOARD_SIZE,
  groupDividerColor: GROUP_DIVIDER_COLOR,
  cellDividerColor: CELL_DIVIDER_COLOR,
  PickerBackgroundColor: PICKER_BACKGROUND_COLOR,
  PickerForegroundColor: PICKER_FOREGROUND_COLOR,
  framesPerSecond: FRAMES_PER_SECOND,
  maxAnimationRuntime: MAX_ANIMATION_RUNTIME
};
export default tokens;
