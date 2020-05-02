/** @jsx jsx */
import { jsx } from "@emotion/core";
import { GROUP_DIVIDER_COLOR } from "../style/tokens";

export function Button({ children, padStart, ...rest }) {
  return (
    <button
      {...rest}
      css={{
        boxSizing: "border-box",
        position: "relative",
        appearance: "none",
        backgroundColor: "transparent",
        border: `1px solid ${GROUP_DIVIDER_COLOR}`,
        fontSize: 16,
        padding: "8px 16px 8px 16px",
        ...(padStart && { marginLeft: 16 }),
        marginTop: 16,
        marginBottom: 16,
        borderRadius: 6,
        minWidth: 100,
        transition: "opacity .3s",
        "&:focus": {
          outline: "none",
          boxShadow: "0 0 0 2px magenta",
        },
        "&:hover": {
          color: "rgba(0, 0, 0, .6)",
          borderColor: "rgba(0, 0, 0, .6)",
        },
        "&:disabled": {
          color: "rgba(0, 0, 0, .4)",
          borderColor: "rgba(0, 0, 0, .4)",
        },
      }}
    >
      {children}
    </button>
  );
}
