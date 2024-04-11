function getBoard(n) {
    // n: number
    const matrix = [];
    for (let i = 0; i < n; i++) {
        const row = [];
        for (let j = 0; j < n; j++) {
            row.push(0);
        }
        matrix.push(row);
    }
    return matrix;
}

function shiftCellValue(value) {
    let newValue = value + 1
    if (newValue > 1) newValue = -1;
    return newValue;
}

// Returns { rowChecks, columnChecks } for line counts
function checkRowAndColumns(matrix) {
    const rowChecks = [];
    const columnChecks = [];

    const nr = matrix.length;
    const nc = matrix[0].length;
    // rows
    for (let i = 0; i < nr; i++) {
        rowChecks.push(checkOneLineAlong(matrix, i, 0, 0, 1, nc));
    }
    // cols
    for (let j = 0; j < nc; j++) {
        columnChecks.push(checkOneLineAlong(matrix, 0, j, 1, 0, nr));
    }
    return { rowChecks, columnChecks };
}

function checkOneLineAlong(matrix, r0, c0, dr, dc, n) {
    const line = [];
    let r = 0, c = 0;
    for (let i = 0; i < n; i++) {
        r = r0 + i * dr;
        c = c0 + i * dc;
        line.push(matrix[r][c]);
    }
    return checkVector(line);
}

// TODO: need a unit test
function checkVector(line) {
    const counts = [];
    let nContinual = 0; // continuous 1's in line
    for (let i = 0; i < line.length; i++) {
        const v = line[i];
        if (v === 1) {
            nContinual += 1;
            continue;
        }
        // shift to next series, but 0 means is a empty place
        if (nContinual > 0) {
            counts.push(nContinual);
            nContinual = 0;
        }
    }
    // the last series may exist
    if (nContinual > 0) {
        counts.push(nContinual);
    }
    // empty case
    if (nContinual.length == 0) {
        nContinual.push(0);
    }
    return counts;
}

// isWin checks board statuses with targetCounts ({ rowChecks, columnChecks })
function isWin(matrix, targetCounts) {
    const currentChecks = checkRowAndColumns(matrix);
    return isEqualChecks(currentChecks.rowChecks, targetCounts.rowChecks) &&
        isEqualChecks(currentChecks.columnChecks, targetCounts.columnChecks);
}

// if 2 array of arrays are equal ([ countArrays... ])
// precondition: structure is correct
function isEqualChecks(left, right) {
    if (left === null || right === null) return false;
    if (left.length !== right.length) return false;
    for (let n = 0; n < left.length; n++) {
        const leftSub = left[n];
        const rightSub = right[n];
        if (leftSub === null || rightSub === null) return false;
        if (leftSub.length !== rightSub.length) return false;
        for (let i = 0; i < leftSub.length; i++) {
            if (leftSub[i] !== rightSub[i]) return false;
        }
    }
    return true;
}

export default { getBoard, shiftCellValue, checkRowAndColumns, isWin }
