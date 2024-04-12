<template>
  <div class="component-nonogram-game">
    <h1>Nonogram</h1>
    <div class="canvas">
      <div class="canvas-row">
        <div class="placeholder-block"></div>
        <div class="column-checks-block">
          <div
            v-for="(check, colIndex) in boardCounts.columnChecks"
            :key="`col-${colIndex}`"
            class="column-check"
          >
            <span
              >ST:
              <b>{{
                statuses && statuses.columnStatuses && statuses.columnStatuses[colIndex].status
              }}|</b></span
            >
            <br />{{ showColumnCheck(check) }}
          </div>
        </div>
      </div>
      <div class="canvas-row">
        <div class="row-checks-block">
          <div
            v-for="(check, rowIndex) in boardCounts.rowChecks"
            :key="`row-${rowIndex}`"
            class="row-check"
          >
            <span
              >ST:
              {{ statuses && statuses.rowStatuses && statuses.rowStatuses[rowIndex].status }}|</span
            >
            {{ showRowCheck(check) }}
          </div>
        </div>
        <div class="board">
          <div v-for="(row, rowIndex) in board" :key="`row-${rowIndex}`" class="row">
            <div
              v-for="(cell, cellIndex) in row"
              :key="`cell-${cellIndex}`"
              class="cell" :class="cell === 1 ? 'checked' : ''"
              @click="makeMove(rowIndex, cellIndex)"
            >
              {{ cell === 1 ? 'O' : cell === -1 ? 'X' : '.' }}
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
import { ref, computed } from 'vue'
import nonogram from '../models/nonogram.js'

export default {
  name: 'NonogramGame',
  setup() {
    // configurations
    /*
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
    */
    /*
    const num = 15
    const targetCounts = {
      rowChecks: [[1], [3], [5], [7], [9], [11], [13], [13], [15], [15], [15], [6, 1, 6], [4, 1, 4], [3], [5]],
      columnChecks: [[4], [7], [8], [9], [10], [10, 1], [10, 2], [15], [10, 2], [10, 1], [10], [9], [8], [7], [4]],
    }
    */
    /* kanokari 1
    const num = 40
    const targetCounts = {
      rowChecks: [
        [20],
        [22],
        [3, 24],
        [5, 27],
        [34],
        [8, 26],
        [1, 3, 8, 2, 2, 5],
        [2, 7, 15, 2],
        [9, 16, 3],
        [2, 5, 18, 3],
        [3, 3, 16, 3, 2],
        [4, 2, 11, 4, 4, 2],
        [5, 2, 12, 4, 5, 2],
        [8, 12, 4, 4, 3],
        [21, 4, 8],
        [20, 4, 10],
        [4, 13, 3, 1, 8],
        [3, 2, 6, 6, 3, 8],
        [3, 1, 4, 1, 1, 3, 8],
        [3, 1, 4, 2, 11],
        [3, 2, 3, 4, 1, 11],
        [3, 2, 6, 3, 2, 9],
        [4, 4, 1, 3, 5, 1],
        [5, 3, 2, 5, 1],
        [6, 2, 5],
        [7, 1, 1, 5],
        [7, 1, 5],
        [7, 5],
        [8, 5],
        [8, 7, 6],
        [8, 2, 1, 2, 7],
        [9, 3, 2, 5, 3],
        [10, 3, 5, 1, 2, 3],
        [10, 5, 6, 2, 5],
        [11, 13, 4, 2],
        [3, 10, 10, 4, 1, 4],
        [2, 6, 2, 5, 3, 4, 2],
        [1, 6, 2, 4, 3, 2, 3],
        [5, 2, 3, 3, 3],
        [5, 2, 3, 4, 4],
      ],
      columnChecks: [
        [4, 6],
        [4, 6],
        [4, 8],
        [4, 24],
        [32],
        [34],
        [3, 1, 7, 18],
        [3, 3, 4, 1, 17],
        [2, 6, 3, 5, 16],
        [15, 2, 15],
        [10, 6, 6],
        [10, 10, 1],
        [9, 12, 1, 2],
        [8, 14, 2, 3],
        [7, 10, 2, 1, 2, 2],
        [7, 8, 2, 4, 2],
        [6, 8, 2, 4, 1],
        [6, 11, 1, 1, 5],
        [6, 11, 2, 2, 5],
        [18, 1, 1, 1, 7],
        [19, 1, 1, 1, 6],
        [6, 11, 1, 2, 7],
        [6, 9, 1, 2, 3],
        [6, 8, 1, 8],
        [13, 4, 8],
        [11, 6, 2, 9],
        [6, 12, 4, 1],
        [6, 10, 2, 3],
        [6, 9, 4, 3, 3],
        [6, 7, 1, 4, 11],
        [6, 3, 1, 2, 6, 5],
        [12, 1, 3, 9, 3],
        [31, 1],
        [4, 25, 1],
        [4, 16, 4, 1],
        [4, 13, 2, 1, 2],
        [3, 9, 1, 1, 1],
        [13, 2, 1, 2],
        [13, 1, 1, 1],
        [7, 1, 1, 1, 1],
      ],
    }
    */
    const num = 48
    const targetCounts = {
      rowChecks: [
        [5, 1],
        [4, 1],
        [3, 4, 3],
        [14],
        [3, 6, 4],

        [3, 10, 3],
        [2, 14, 2],
        [2, 16, 2],
        [2, 11, 4, 2],
        [2, 3, 8, 4, 2],

        [2, 3, 8, 4, 3],
        [1, 3, 3, 3, 3, 2],
        [2, 1, 1, 1, 2, 1, 1, 1, 3],
        [1, 3, 8, 4, 2],
        [2, 22, 3],

        [3, 4, 8, 4, 3],
        [2, 3, 8, 4, 2],
        [3, 4, 8, 5, 3],
        [4, 4, 8, 5, 2],
        [4, 2, 3, 3, 3, 2],

        [4, 1, 1, 3],
        [1, 3, 1, 4, 5, 1, 3],
        [1, 3, 1, 7, 8, 1, 3],
        [2, 3, 3, 1, 1, 1, 4, 3],
        [2, 3, 2, 1, 2, 1, 2, 1, 1, 4],

        [1, 3, 2, 4, 4, 1, 1, 4],
        [1, 4, 3, 4, 4, 1, 1, 2, 1],
        [2, 4, 3, 1, 1, 1, 1, 1, 1, 2, 2],
        [1, 4, 2, 4, 1, 3, 2, 2, 1],
        [1, 4, 2, 1, 2, 2, 2],

        [4, 2, 1, 1, 1, 1, 1, 1, 2, 3, 1],
        [4, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1],
        [3, 1, 1, 1, 1, 1, 3],
        [3, 1, 3, 1, 1, 3, 3],
        [3, 1, 4, 3, 3, 4],
        
        [2, 1, 5, 4, 4],
        [2, 1, 7, 6, 1, 2],
        [2, 1, 10, 6, 4, 1, 2],
        [2, 1, 1, 10, 9, 4, 1, 2],
        [1, 1, 1, 10, 8, 4, 1, 3],

        [1, 1, 1, 10, 8, 4, 1, 3],
        [1, 1, 1, 8, 1, 1, 6, 3, 1, 2],
        [1, 1, 1, 2, 4, 2, 1, 5, 2, 1, 2],
        [1, 1, 1, 2, 4, 4, 9, 1, 2],
        [1, 1, 8, 3, 1, 2, 1, 2],

        [1, 2, 1, 4, 1, 1, 1, 2, 1, 1],
        [1, 2, 1, 2, 2, 1, 3, 1, 1, 1],
        [1, 1, 1, 1, 1, 3, 2, 1, 1, 1],
      ],
      columnChecks: [
        [3],
        [4],
        [2, 16],
        [3, 11],
        [3, 9],

        [15, 1],
        [28, 2],
        [14, 5],
        [4],
        [3, 14],

        [2, 6, 5, 4],
        [2, 12, 12],
        [2, 3, 5, 1, 11],
        [2, 5, 2, 2, 7, 1],
        [2, 7, 1, 12],

        [1, 2, 6, 2, 5, 2, 11],
        [2, 3, 3, 1, 2, 2, 1, 9],
        [1, 6, 1, 1, 6, 1, 2, 7, 2],
        [2, 4, 1, 1, 2, 5, 5, 2],
        [2, 3, 1, 1, 3, 1],

        [2, 14, 5, 2],
        [1, 2, 7, 6, 1, 2, 1],
        [2, 9, 6, 1, 2],
        [11, 7, 2, 1, 2],
        [11, 7, 1, 2],

        [12, 6, 1, 1, 1],
        [10, 6, 4, 2],
        [1, 16, 3, 2],
        [1, 2, 3, 1, 1, 4, 2],
        [2, 4, 1, 1, 8, 6, 1],

        [3, 5, 1, 1, 2, 2, 1, 2, 7],
        [2, 9, 1, 6, 1, 7],
        [2, 5, 6, 2, 4, 2, 7],
        [2, 3, 6, 2, 8],
        [2, 8, 2, 2, 3, 1],

        [2, 6, 6, 1, 2, 1],
        [2, 5, 1, 4, 8, 1],
        [3, 9, 13],
        [4, 17],
        [6, 5],

        [6],
        [8, 18],
        [19],
        [21],
        [4, 11],
        
        [4, 9],
        [3],
        [3],
      ],
    }

    // props
    const board = ref(nonogram.getBoard(num))
    const boardCounts = ref(targetCounts)
    const statuses = ref(null) // is not computed, we manually compute update this

    const winner = ref(null)
    const isDraw = computed(() => {
      return board.value.every((row) => row.every((cell) => cell)) && !winner.value
    })

    const currentRowColumnChecks = computed(() => {
      return nonogram.checkRowAndColumns(board.value)
    })

    const isWin = computed(() => {
      // NOW: matrix line checks are duplicated with line solution checks, can do once only
      return nonogram.isWin(currentRowColumnChecks.value, targetCounts)
    })

    function makeMove(rowIndex, cellIndex) {
      //// change current cell's value

      const currentValue = board.value[rowIndex][cellIndex]
      // group shift: (-1, 0, 1)
      const nextValue = nonogram.shiftCellValue(currentValue)
      board.value[rowIndex][cellIndex] = nextValue

      //// check row/column statuses
      // const { rowChecks, columnChecks } = currentRowColumnChecks.value;
      // nonogram.debugCheckCounts(rowChecks, columnChecks);
      // TODO: we only need to update 2 lines: current line/column
      const { rowStatuses, columnStatuses } = nonogram.solveRowColumnStatuses(
        board.value,
        targetCounts
      )
      statuses.value = { rowStatuses, columnStatuses }

      //// auto fill operations

      var isAutoChanged = false

      // TODO: auto solve mode: should have buttons to do this?
      // check against solutions -> if any new changed, fill them automatically
      const autoSolveMode = true
      if (autoSolveMode) {
        // collect new auto solved cells' indexes and values
        const solvedCells = [] // in { row, column, value } of only 100/-100 values
        for (let i = 0; i < num; i++) {
          const status = rowStatuses[i]
          console.log("AUTO r ", i, status.status, status.solutions);
          for (let j = 0; j < num; j++) {
            const solved = status.solutions[j]
            if (solved == 100 || solved == -100) {
              solvedCells.push({ row: i, column: j, value: solved })
            }
          }
        }
        for (let j = 0; j < num; j++) {
          const status = columnStatuses[j]
          console.log("AUTO r ", j, status.status, status.solutions);
          for (let i = 0; i < num; i++) {
            const solved = status.solutions[i]
            if (solved == 100 || solved == -100) {
              solvedCells.push({ row: i, column: j, value: solved })
            }
          }
        }
        console.log('SOLEDCELLS', solvedCells)
        // set them
        if (solvedCells.length > 0) {
          isAutoChanged = true
          for (const { row, column, value } of solvedCells) {
            const current = board.value[row][column]
            const toValue = value == 100 ? 1 : -1
            if ((current == 1 || current == -1) && current != toValue) {
              console.log('CONFLICT?', current, row, column, value)
              break
            }
            console.log('AUTO FILL SOLUTION: ', row, column, value)
            board.value[row][column] = toValue
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
        if (rowStatuses[i].status === 'OK') {
          // fill 0 -> -1 cells
          for (let j = 0; j < num; j++) {
            if (board.value[i][j] === 0) {
              board.value[i][j] = -1
              isAutoChanged = true
            }
          }
        }
      }
      for (let j = 0; j < num; j++) {
        if (columnStatuses[j].status === 'OK') {
          // fill 0 -> -1 cells
          for (let i = 0; i < num; i++) {
            if (board.value[i][j] === 0) {
              board.value[i][j] = -1
              isAutoChanged = true
            }
          }
        }
      }
      if (isAutoChanged) {
        statuses.value = nonogram.solveRowColumnStatuses(board.value, targetCounts)
      }
    }

    function showRowCheck(checks) {
      return checks.join(',')
    }

    function showColumnCheck(checks) {
      return checks.join('\n')
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
      board.value = nonogram.getBoard(num)
      statuses.value = nonogram.solveRowColumnStatuses(board.value, targetCounts)
    }

    return {
      board,
      boardCounts,
      statuses,
      makeMove,
      resetGame,
      isWin,
      showRowCheck,
      showColumnCheck,
      winner,
      isDraw
    }
  }
}
</script>

<style lang="scss" scoped>
$cell-width: 50px;
$block-width: 2 * $cell-width;

.component-nonogram-game {
  display: block;
  font-size: 1em;

  .canvas {
    display: flex;
    flex-direction: column;

    .canvas-row {
      display: flex;
      flex-direction: row;
    }
    .placeholder-block {
      width: 2 * $block-width; // 200px;
    }
    .row-checks-block {
      display: flex;
      flex-direction: column;
      width: 2 * $block-width; // 200px;
      text-align: left;
    }
    .row-check {
      height: $cell-width;
      line-height: $cell-width;
      vertical-align: middle;
    }
    .column-checks-block {
      display: flex;
      flex-direction: row;
    }
    .column-check {
      width: $cell-width;
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
    width: $cell-width;
    height: $cell-width;
    border: 1px solid #000;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2em;
    cursor: pointer;
    &.checked {
      background-color:blue;
      color: white;
    }
  }
}
</style>
