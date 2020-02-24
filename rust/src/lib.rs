use cfg_if::cfg_if;
use js_sys::Uint8Array;
use wasm_bindgen::prelude::*;

cfg_if! {
    if #[cfg(feature = "wee_alloc")] {
        extern crate wee_alloc;
        #[global_allocator]
        static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
    }
}

#[wasm_bindgen(method)]
pub fn solve(js_initial: Uint8Array) -> Vec<u8> {

    let mut initial_state = [0u8; 81];
    js_initial.copy_to(&mut initial_state);
    let mut state: Vec<Cell> = Vec::new();

    for i in 0..initial_state.len() {
        &state.push(build_cell(i, &initial_state));
    }

    let mut current = 0usize;
    let mut direction: Direction = Direction::Forward;
    let mut loops = 0;

    while current < state.len() {
        loops = loops + 1;

        if state[current].constant {
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
                    } else {
                        if value < 9 {
                            state[current].value = Some(value + 1);
                        } else {
                            state[current].value = None;
                            direction = Direction::Reverse;
                            current = current - 1;
                        }
                    }
                }
                None => {
                    state[current].value = Some(1u8);
                }
            },
            Direction::Reverse => match state[current].value {
                Some(value) => {
                    if value < 9 {
                        state[current].value = Some(value + 1);
                        direction = Direction::Forward;
                    } else {
                        state[current].value = None;
                        current = current - 1;;
                    }
                }
                None => {
                    state[current].value = Some(1u8);
                    direction = Direction::Forward;
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
