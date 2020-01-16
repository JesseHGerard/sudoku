extern crate cfg_if;
extern crate wasm_bindgen;

use cfg_if::cfg_if;
use std::time;
use wasm_bindgen::prelude::*;

cfg_if! {
    // When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
    // allocator.
    if #[cfg(feature = "wee_alloc")] {
        extern crate wee_alloc;
        #[global_allocator]
        static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
    }
}

#[wasm_bindgen]
pub fn solve() -> Vec<u8> {
    let initial_state = [
        0u8, 9, 8, 0, 6, 1, 0, 0, 0, 0, 0, 3, 0, 5, 0, 8, 9, 6, 7, 0, 6, 0, 3, 8, 0, 0, 2, 0, 7, 0,
        3, 0, 4, 6, 0, 0, 3, 1, 9, 0, 0, 0, 0, 8, 0, 0, 0, 0, 5, 0, 0, 7, 3, 0, 5, 0, 0, 7, 2, 0,
        0, 1, 0, 0, 6, 0, 1, 0, 0, 2, 0, 8, 2, 3, 0, 8, 0, 5, 0, 0, 0,
    ];

    let start_time = time::Instant::now();

    let mut state: Vec<Cell> = Vec::new();

    for i in 0..initial_state.len() {
        &state.push(build_cell(i, &initial_state));
    }

    let mut current = 0usize;
    let mut direction: Direction = Direction::Forward;
    let mut loops = 0;

    while current < state.len() {
        loops = loops + 1;

        // println!(
        //     "current: {}, value: {:?} direction: {:?}, loop: {}",
        //     current, state[current].value, direction, loops
        // );

        if state[current].constant {
            // println!("  constant");
            match &direction {
                Direction::Forward => current = current + 1,
                Direction::Reverse => current = current - 1,
            };
            continue;
        }

        match &direction {
            Direction::Forward => match state[current].value {
                Some(value) => {
                    if state[current].check(&state) {
                        current = current + 1;
                    // println!("  check passed, move forward");
                    } else {
                        if value < 9 {
                            state[current].value = Some(value + 1);
                        // println!("  check failed, increment value");
                        } else {
                            state[current].value = None;
                            direction = Direction::Reverse;
                            current = current - 1;
                            // println!("  check failed, go back");
                        }
                    }
                }
                None => {
                    state[current].value = Some(1u8);
                    // println!("  no value, given value of 1");
                }
            },
            Direction::Reverse => match state[current].value {
                Some(value) => {
                    if value < 9 {
                        state[current].value = Some(value + 1);
                        direction = Direction::Forward;
                    // println!("  increment value");
                    } else {
                        state[current].value = None;
                        current = current - 1;
                        // println!("  out of options, go back");
                    }
                }
                None => {
                    state[current].value = Some(1u8);
                    direction = Direction::Forward;
                    // println!("  no value, given value of 1 (reverse)");
                }
            },
        }
    }

    let mut answer: Vec<u8> = Vec::new();

    for cell in state.iter() {
        answer.push(match cell.value {
            Some(number) => number,
            None => 0u8,
        });
    }

    let elapsed_time = time::Instant::now() - start_time;

    println!("answer in {:?} {} loops: {:?}", elapsed_time, loops, answer);
    answer
}

#[derive(Debug)]
enum Direction {
    Forward,
    Reverse,
}

#[derive(Debug)]
struct Cell {
    value: Option<u8>,
    constant: bool,
    index: usize,
    col: usize,
    row: usize,
    row_members: Vec<usize>,
    col_members: Vec<usize>,
    group_members: Vec<usize>,
    group: usize,
}

impl Cell {
    fn check(&self, state: &Vec<Cell>) -> bool {
        let mut row_pass = true;
        for cell in self.row_members.iter() {
            if &state[cell.clone()].value == &self.value {
                row_pass = false;
                break;
            }
        }

        if !row_pass {
            return row_pass;
        }

        let mut col_pass = true;
        for cell in self.col_members.iter() {
            if &state[cell.clone()].value == &self.value {
                col_pass = false;
                break;
            };
        }
        if !col_pass {
            return col_pass;
        }

        let mut group_pass = true;
        for cell in self.group_members.iter() {
            if &state[cell.clone()].value == &self.value {
                group_pass = false;
                break;
            };
        }
        group_pass
    }
}

fn build_cell(index: usize, initial_state: &[u8; 81]) -> Cell {
    let constant = &initial_state[index] != &0;
    let col = determine_col(index);
    let row = determine_row(index);
    let group = determine_group(index);
    Cell {
        value: if &initial_state[index] == &0 {
            None
        } else {
            Some(initial_state[index].clone())
        },
        constant,
        index: index.clone(),
        col,
        row,
        row_members: determine_row_members(row, index),
        col_members: determine_col_members(col, index),
        group_members: determine_group_members(group, index),
        group,
    }
}

fn determine_row_members(row: usize, index: usize) -> Vec<usize> {
    let mut row_members: Vec<usize> = Vec::new();
    for i in 0..81 {
        if i != index && row == determine_row(i) {
            row_members.push(i)
        }
    }
    row_members
}

fn determine_col_members(col: usize, index: usize) -> Vec<usize> {
    let mut col_members: Vec<usize> = Vec::new();
    for i in 0..81 {
        if i != index && col == determine_col(i) {
            col_members.push(i)
        }
    }
    col_members
}

fn determine_group_members(group: usize, index: usize) -> Vec<usize> {
    let mut group_members: Vec<usize> = Vec::new();
    for i in 0..81 {
        if i != index && group == determine_group(i) {
            group_members.push(i)
        }
    }
    group_members
}

fn determine_col(index: usize) -> usize {
    index as usize % 9
}

fn determine_row(index: usize) -> usize {
    (index as f32 / 9.).floor() as usize
}

fn determine_group(index: usize) -> usize {
    ((determine_col(index) as f32 / 3.).floor() + (determine_row(index) as f32 / 3.).floor() * 3f32)
        as usize
}
