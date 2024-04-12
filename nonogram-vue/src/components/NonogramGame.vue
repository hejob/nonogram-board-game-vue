<template>
  <div class="component-nonogram-game">
    <h1>Nonogram</h1>
    <div class="canvas">
      <div class="canvas-row">
        <div class="placeholder-block"></div>
        <div class="column-checks-block">
          <div v-for="(check, colIndex) in boardCounts.columnChecks" :key="`col-${colIndex}`" class="column-check">
            <span>ST: {{ statuses && statuses.columnStatuses && statuses.columnStatuses[colIndex].status }}|</span>
            <br/>{{ showColumnCheck(check) }}
          </div>
        </div>
      </div>
      <div class="canvas-row">
        <div class="row-checks-block">
          <div v-for="(check, rowIndex) in boardCounts.rowChecks" :key="`row-${rowIndex}`" class="row-check">
            <span>ST: {{ statuses && statuses.rowStatuses && statuses.rowStatuses[rowIndex].status }}|</span>
            {{ showRowCheck(check) }}
          </div>
        </div>
        <div class="board">
          <div v-for="(row, rowIndex) in board" :key="`row-${rowIndex}`" class="row">
            <div v-for="(cell, cellIndex) in row" :key="`cell-${cellIndex}`" class="cell" @click="makeMove(rowIndex, cellIndex)">
              {{ cell === 1 ? "O" : (cell === -1 ? "X" : ".")  }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <button @click="resetGame">Restart Game</button>
    <p v-if="isWin">WINS!</p>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import nonogram from '../models/nonogram.js';

export default {
  name: 'NonogramGame',
  setup() {
    // configurations
    const num = 5;
    const targetCounts = {
      rowChecks: [
        [1, 1, 1],
        [1, 1],
        [1],
        [3],
        [1],
      ],
      columnChecks: [
        [1],
        [1, 1],
        [1, 3],
        [1, 1],
        [1],
      ],
    }

    // props
    const board = ref(nonogram.getBoard(num));
    const boardCounts = ref(targetCounts);
    const statuses = ref(null); // is not computed, we manually compute update this
   
    const winner = ref(null);
    const isDraw = computed(() => {
      return board.value.every(row => row.every(cell => cell)) && !winner.value;
    });

    const currentRowColumnChecks = computed(() => {
      return nonogram.checkRowAndColumns(board.value);
    });

    const isWin = computed(() => {
      // NOW: matrix line checks are duplicated with line solution checks, can do once only
      return nonogram.isWin(currentRowColumnChecks.value, targetCounts);
    });

    function makeMove(rowIndex, cellIndex) {

      //// change current cell's value

      const currentValue = board.value[rowIndex][cellIndex];
      // group shift: (-1, 0, 1)
      const nextValue = nonogram.shiftCellValue(currentValue);
      board.value[rowIndex][cellIndex] = nextValue;

      
      //// check row/column statuses
      // const { rowChecks, columnChecks } = currentRowColumnChecks.value;
      // nonogram.debugCheckCounts(rowChecks, columnChecks);
      // TODO: we only need to update 2 lines: current line/column
      const { rowStatuses, columnStatuses } = nonogram.solveRowColumnStatuses(board.value, targetCounts);
      statuses.value = { rowStatuses, columnStatuses };

      //// auto fill operations

      var isAutoChanged = false;

      // TODO: auto solve mode: should have buttons to do this?
      // check against solutions -> if any new changed, fill them automatically
      const autoSolveMode = true;
      if (autoSolveMode) {
        // collect new auto solved cells' indexes and values
        const solvedCells = []; // in { row, column, value } of only 100/-100 values
        for (let i = 0; i < num; i++) {
          const status = rowStatuses[i];
          for (let j = 0; j < num; j++) {
            const solved = status.solutions[j];
            if (solved == 100 || solved == -100) {
              solvedCells.push({ row: i, column: j, value: solved });
            }
          }
        }
        for (let j = 0; j < num; j++) {
          const status = columnStatuses[j];
          for (let i = 0; i < num; i++) {
            const solved = status.solutions[i];
            if (solved == 100 || solved == -100) {
              solvedCells.push({ row: i, column: j, value: solved });
            }
          }
        }
        console.log("SOLEDCELLS", solvedCells);
        // set them
        if (solvedCells.length > 0) {
          isAutoChanged = true;
          for (const { row, column, value } of solvedCells) {
            const current = board.value[row][column];
            const toValue = (value == 100) ? 1 : -1;
            if ((current == 1 || current == -1) && current != toValue) {
              console.log("CONFLICT?", current, row, column, value);
              break;
            }
            console.log("AUTO FILL SOLUTION: ", row, column, value);
            board.value[row][column] = toValue;
          }
        }
      }

      // TODO: automatically set UNIQUE SOLUTION LINES: but only at the begginning? or else no meaning (should have redos?)
      // TODO: smarter sataus: UNIQUE solution at the current state -> auto fill? (but should have redos?)

      // automatically updates OK lines (fill them) (SHOULD have redos?)
      // SIDE EFFECT AND BUG:
      // TODO: this prevents a OK line to be edited again except for the 1 cells (X -> 0 is automatically filled again)
      //       AND would be BUG if statuses not refreshed after this (IF ANY CHANGED) -> can we do better performance than this?
      for (let i = 0; i < num; i++) {
        if (rowStatuses[i].status === "OK") {
          // fill 0 -> -1 cells
          for (let j = 0; j < num; j++) {
            if (board.value[i][j] === 0) {
              board.value[i][j] = -1;
              isAutoChanged = true;
            }
          }
        }
      }
      for (let j = 0; j < num; j++) {
        if (columnStatuses[j].status === "OK") {
          // fill 0 -> -1 cells
          for (let i = 0; i < num; i++) {
            if (board.value[i][j] === 0) {
              board.value[i][j] = -1;
              isAutoChanged = true;
            }
          }
        }
      }
      if (isAutoChanged) {
        statuses.value = nonogram.solveRowColumnStatuses(board.value, targetCounts);
      }
    }

    function showRowCheck(checks) {
      return checks.join(',');
    }

    function showColumnCheck(checks) {
      return checks.join('\n');
    }

    // util, private

    /*
    function checkWinner() {
      // Define winning combinations
      const lines = [
        // Rows
        [board.value[0][0], board.value[0][1], board.value[0][2]],
        [board.value[1][0], board.value[1][1], board.value[1][2]],
        [board.value[2][0], board.value[2][1], board.value[2][2]],
        // Columns
        [board.value[0][0], board.value[1][0], board.value[2][0]],
        [board.value[0][1], board.value[1][1], board.value[2][1]],
        [board.value[0][2], board.value[1][2], board.value[2][2]],
        // Diagonals
        [board.value[0][0], board.value[1][1], board.value[2][2]],
        [board.value[0][2], board.value[1][1], board.value[2][0]],
      ];

      // Check for a winner
      lines.forEach(line => {
        if (line[0] && line[0] === line[1] && line[0] === line[2]) {
          winner.value = line[0];
        }
      });
    }
    */

    function resetGame() {
      board.value = nonogram.getBoard(num);
      statuses.value = nonogram.solveRowColumnStatuses(board.value, targetCounts);
    }

    return { board, boardCounts, statuses, makeMove, resetGame, isWin, showRowCheck, showColumnCheck, winner, isDraw };
  }
};
</script>

<style scoped>
.component-nonogram-game {
  display: block;

  .canvas {
    display: flex;
    flex-direction: column;

    .canvas-row {
      display: flex;
      flex-direction: row;
    }
    .placeholder-block {
      width: 200px;
    }
    .row-checks-block {
      display: flex;
      flex-direction: column;
      width: 200px;
      text-align: right;
    }
    .row-check {
      height: 100px;
      line-height: 100px;
      vertical-align: middle;
    }
    .column-checks-block {
      display: flex;
      flex-direction: row;
    }
    .column-check {
      width: 100px;
      text-align: center;
      white-space: pre;
    }
  }

  .board {
    /* display: grid; */
    /* grid-template-columns: repeat(3, 100px); */
    /* gap: 5px; */
    display: flex;
    flex-direction: column;
  }
  .row {
    display: flex;
  }
  .cell {
    width: 100px;
    height: 100px;
    border: 1px solid #000;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2em;
    cursor: pointer;
  }
}
</style>
