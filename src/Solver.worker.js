import { solve } from "./util/solve";

onmessage = function({ data: { puzzle } }) {
  const start = performance.now();

  const answer = solve(puzzle);
  const end = performance.now();
  this.postMessage({
    puzzle: answer,
    time: Math.floor((end - start) * 100) / 100
  });
};
