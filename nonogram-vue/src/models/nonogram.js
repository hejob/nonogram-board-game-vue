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
function isWin(currentChecks, targetCounts) {
    // const currentChecks = checkRowAndColumns(matrix);
    return isEqualChecks(currentChecks.rowChecks, targetCounts.rowChecks) &&
        isEqualChecks(currentChecks.columnChecks, targetCounts.columnChecks);
}

// if 2 array of arrays are equal ([ countArrays... ])
// precondition: structure is correct
function isEqualChecks(left, right) {
    if (left === null || right === null) return false;
    if (left.length !== right.length) return false;
    for (let n = 0; n < left.length; n++) {
        if (!isEqualArray(left[n], right[n])) return false;
    }
    return true;
}

function isEqualArray(leftSub, rightSub) {
    if (leftSub === null || rightSub === null) return false;
    if (leftSub.length !== rightSub.length) return false;
    for (let i = 0; i < leftSub.length; i++) {
        if (leftSub[i] !== rightSub[i]) return false;
    }
    return true;
}

function debugCheckCounts(rowChecks, columnChecks) {
    console.log('\n');
    console.log('---------------');
    console.log('ROW counts:');
    for (let i = 0; i < rowChecks.length; i++) {
        console.log(i, rowChecks[i]);
    }
    console.log('COL counts:');
    for (let i = 0; i < columnChecks.length; i++) {
        console.log(i, columnChecks[i]);
    }
}

// TODO: solve one line, update one line only... (as one move may only affect 2 lines, in assisted mode)

// returns { rowStatuses, columnStauses }, statuses are arrays of status =>
// status: { status, solutions } =>
//   status: { "OK", "NG", "CHANGED", "POSSIBLE"} <-:: { completed line, impossible line, new solution found some cells, not changed but still possible}
//   solutions: arrays of cells of { 0, 1, -1 }
function solveRowColumnStatuses(matrix, targetCounts) {
    // split into lines
    const nr = matrix.length;
    const nc = matrix[0].length;
    const { rowChecks, columnChecks } = targetCounts;
    // rows
    const rowStatuses = [];
    console.log('\n---------\n');
    for (let i = 0; i < nr; i++) {
        console.log('sol row ' + i);
        rowStatuses.push(solveLineStatus(matrix[i], rowChecks[i]));
    }
    // columns
    const columnStatuses = [];
    for (let j = 0; j < nc; j++) {
        const line = [];
        // TODO: functional
        for (let i = 0; i < nr; i++) {
            line.push(matrix[i][j]);
        }
        console.log('sol col ' + j);
        columnStatuses.push(solveLineStatus(line, columnChecks[j]));
    }
    return { rowStatuses, columnStatuses };
}

function solveLineStatus(line, checks) {
    let status = "POSSIBLE";
    const n = line.length;
    const solutions = line.slice(0, n);

    // checks for a stat of line
    const currentLineChecks = checkVector(line);
    // SIMPLE check if check count matches target checks
    if (isEqualArray(currentLineChecks, checks)) {
        status = "OK";
    } else {
        const { sum, r, l } = statCombinationCheck(checks, n);
        // special counts, knows the solution
        if (sum === 0) {
            // all x solution, sum|r == 0
            for (let i = 0; i < n; i++) solutions[i] = -1;
            // check solution here
            console.log('ALL0');
        } else if (l < 0) {
            // bad solution, something went wrong, target check is wrong
            status = "NG";
        } else {
            if (l === 0) {
                // unique solution, but we can still use generating solution below
                console.log('UNIQUE');
            }             
            // generate all possible configurations
            // loop and check status and solution through possible configurations along the way
            //   1. check if NG or possible (NG means no possible configuration matches) - special: if UNIQUE then only OK/NG by checking init configuration is enough
            //   2. TODO: check if can solve more cells by checking all possible configurations if have common fixed cells
            let matchAny = false;
            const t = r + 1
            const combination = generateCombinationInit(l, t);
            let candidate = generateCombination(n, checks, l, r, combination);
            console.log('CANDINIT', combination, candidate);
            if (matchCombination(line, candidate, n)) {
                console.log('match', line, candidate);
                matchAny = true;
                if (l == 0) {
                    status = "POSSIBLE"; // as only one solution exists
                }
            } else {
                if (l == 0) {
                    status = "NG"; // as only one solution exists
                } else {
                    while (generateCombinationNext(combination, l, t)) {
                        candidate = generateCombination(n, checks, l, r, combination);
                        console.log('CAND', combination, candidate);
                        if (matchCombination(line, candidate, n)) {
                            matchAny = true;
                            break;
                        }
                    }
                    if (!matchAny) {
                        status = "NG";
                    }
                }
            }
        }
    }
    // debug
    console.log(status, line.toString(), checks, solutions.toString());
    return { status, solutions };
}

// check if one line matches the candidate line (only -1/1 cells matter), (candidate line do not have -1 cells)
// TODO: smarter checks for special cases
function matchCombination(line, candidate, n) {
    for (let i = 0; i < n; i++) {
        if (line[i] == -1 && candidate[i] == 1) return false; // wrong -1 cell
        if (line[i] == 1 && candidate[i] == 0) return false; // not to match
    }
    return true; // possible match
}
//// combinations: total number of l balls, in t positions
//// generates all possible configurations from smallest to largest in [0, ..., l] to [l, ..., 0]
function generateCombination(n, checks, l, r, combination) {
    // generate a full line of n cells, with target checks of length r
    // current generated combination (length t=r+1) of l free cells (l = n - sum(checks) - r + 1) distributed to t positions
    // in fact its only a alternatively merge of continuous 0 and 1 cells
    const t = r + 1;
    // validate: n == l + sum(checks) + r - 1?
    const line = [];

    // corner case r = 0, all 0
    if (r == 0) {
        for (let j = 0; j < n; j++) line[j] = 0;
        return line;
    }

    // head 0 cells
    for (let j = 0; j < combination[0]; j++) line.push(0);
    // middle cells
    for (let i = 0; i < r; i++) {
        // then continous 1 cells from checks
        for (let j = 0; j < checks[i]; j++) line.push(1);
        if (i == r - 1) break;
        // middle separating cells: continuous 0 cells from combination i + 1 , but last (r + 1) position do not need extra 1 cell
        for (let j = 0; j < combination[i + 1] + 1; j++) line.push(0);
    }
    for (let j = 0; j < combination[t - 1]; j++) line.push(0);
    return line;
}
function statCombinationCheck(checks, n) {
    // get the stats of checks array: sum, length, remaining empty cell count l
    let r = checks.length;
    let sum = 0;
    let l = 0;
    for (let i = 0; i < r; i++) {
        sum += checks[i];
    }
    if (sum === 0) {
        // only one solution: all 0, no free cells
        r = 0;
        l = 0;
    } else {
        l = n - sum - r + 1; // free cell counts
    }
    // returns { sum, count length r, free cells l }
    return { sum, r, l };
}
function generateCombinationInit(l, t) {
    const combination = [];
    for (let i = 0; i < t - 1; i++) {
        combination.push(0);
    }
    combination.push(l);
    return combination;
}
// generates next possible configuration, directly changes line input
// returns false if is the last one
function generateCombinationNext(combination, l, t) {
    // just find from right all the continuous 0s
    // for a tail of [a, b, 0, ..., 0] -> [a+1, 0, 0, ..., b-1]
    let i;
    for (i = t - 1; i > 0; i--) {
        if (combination[i] !== 0) break;
    }
    if (i == 0) return false; // is [a, 0, ..., 0], finished. a >= 0
    const b = combination[i];
    combination[i - 1]++;
    for (let j = i; j < t - 1; j++) combination[j] = 0;
    combination[t - 1] = b - 1;
    return true;
}

export default { getBoard, shiftCellValue, checkRowAndColumns, isWin, debugCheckCounts, solveRowColumnStatuses }
