# Sudoku (work in progress)

## Web Assembly vs JavaScript. Which is faster?

### Brute Force Sudoku Solver

Modern JavaScript is very fast, could web assembly really be faster?

**Spoiler alert,** yeah.... it's a lot faster. This experiment solves a Sudoku puzzle with the same algorithm (or at least very similar) written in both Rust, and JavaScript. The two algorithms are run in parallel with worker threads.

To get a little more insight into how the _backtrack_ algorithm solved the puzzle, the interface allows the user to stretch out the solve time from a few milliseconds to 30 seconds.
