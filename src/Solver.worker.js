import { expose } from "comlink";
import { solve } from "./util/solve";

function solver({ puzzle, animate }) {
  const start = performance.now();

  const answer = solve(puzzle, animate);

  const end = performance.now();

  return {
    ...answer,
    time: Math.floor((end - start) * 100) / 100
  };
}

expose(solver);
