/** @jsx jsx */
import { jsx } from "@emotion/core";
import tokens from "../style/tokens";

const boardContainerStyle = {
  width: tokens.boardSize,
  height: tokens.boardSize,
  padding: tokens.cellSize,
  display: "flex",
  flexWrap: "wrap",
  userSelect: "none",
  flexShrink: 0,
};

/** Holds Cells */
export function BoardContainer({ children }) {
  return <div css={boardContainerStyle}>{children}</div>;
}
