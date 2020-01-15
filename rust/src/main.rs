fn main() {
    let initial_state = [
        0u8, 2, 3, 4, 0, 6, 7, 8, 9, 4, 5, 6, 7, 8, 9, 1, 2, 3, 7, 8, 9, 1, 2, 3, 4, 5, 6, 2, 1, 4,
        3, 6, 5, 8, 9, 7, 3, 6, 5, 8, 9, 7, 2, 1, 4, 8, 9, 7, 2, 1, 4, 3, 6, 5, 5, 3, 1, 6, 4, 2,
        9, 7, 8, 6, 4, 2, 9, 7, 8, 5, 3, 1, 9, 7, 8, 5, 3, 1, 6, 4, 2,
    ];

    let mut state: Vec<Cell> = Vec::new();

    for i in 0..initial_state.len() {
        &state.push(build_cell(i, &initial_state));
    }

    let mut current = 0usize;
    let mut direction: Direction = Direction::Forward;

    while current < state.len() {
        if state[current].constant {
            match &direction {
                Forward => current = current + 1,
                Reverse => current = current - 1,
            };
            continue;
        }

        // match &direction {
        //     Forward =>
        // }
    }
    println!("state: {:?}", state);
}

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
