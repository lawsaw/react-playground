import { cloneDeep } from "lodash";

export function generateGrid(hor, ver) {
    return Array.from({length: ver}, () => Array.from({length: hor}, () => 0));
}

export function merge(figure, grid, [rowPosition, colPosition]) {
    let table = cloneDeep(grid);
    return table.map((row, rowIndex) => {
        if(rowIndex === rowPosition) {
            figure.forEach((figureRow, figureRowIndex) => {
                let replacement = table[rowIndex + figureRowIndex].splice(colPosition, figureRow.length, ...figureRow);
                replacement.forEach((replacementItem, replacementIndex) => {
                    if(replacementItem !== 0) {
                        let tableRowTarget = rowIndex + figureRowIndex;
                        table[tableRowTarget][colPosition+replacementIndex] = 1;
                    }
                })
            });
        }
        return row.map(col => col);
    });
}

export function renderDemoHouse(table) {
    // let houseHuy = [
    //     [0,0,0,0,1,1,0,0,0,0],
    //     [0,0,0,1,1,1,1,0,0,0],
    //     [0,0,0,1,1,1,1,0,0,0],
    //     [0,0,0,0,1,1,0,0,0,0],
    //     [0,0,0,0,1,1,0,0,0,0],
    //     [0,0,0,0,1,1,0,0,0,0],
    //     [0,0,0,0,1,1,0,0,0,0],
    //     [0,0,0,0,1,1,0,0,0,0],
    //     [0,0,0,0,1,1,0,0,0,0],
    //     [0,0,1,1,1,1,1,1,0,0],
    //     [0,0,1,1,1,1,1,1,0,0],
    //     [0,0,1,1,1,1,1,1,0,0],
    // ];
    let smile = [
        [0,0,1,0,0,0,0,1,0,0],
        [0,1,1,1,0,0,1,1,1,0],
        [0,0,1,0,0,0,0,1,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,1,0,0,0,0,1,0,0],
        [0,0,0,1,0,0,1,0,0,0],
        [0,0,0,0,1,1,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
    ];
    let newGrid = merge(smile, table, [table.length-smile.length, 0]);
    return newGrid;
}