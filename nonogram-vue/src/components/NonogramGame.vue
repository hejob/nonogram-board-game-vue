<template>
  <div class="component-nonogram-game">
    <h1>Nonogram</h1>
    <div class="board">
      <div v-for="(row, rowIndex) in board" :key="`row-${rowIndex}`" class="row">
        <div v-for="(cell, cellIndex) in row" :key="`cell-${cellIndex}`" class="cell" @click="makeMove(rowIndex, cellIndex)">
          {{ cell === 1 ? "O" : (cell === -1 ? "X" : ".")  }}
        </div>
      </div>
    </div>
    <button v-if="winner || isDraw" @click="resetGame">Restart Game</button>
    <p v-if="isWin">WINS!</p>
    <p v-if="winner">{{ winner }} wins!</p>
    <p v-if="isDraw">It's a draw!</p>
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
   
    const currentPlayer = ref('X');
    const winner = ref(null);
    const isDraw = computed(() => {
      return board.value.every(row => row.every(cell => cell)) && !winner.value;
    });

    const isWin = computed(() => {
      return nonogram.isWin(board.value, targetCounts);
    });

    function makeMove(rowIndex, cellIndex) {

      //// change current cell's value

      const currentValue = board.value[rowIndex][cellIndex];
      // group shift: (-1, 0, 1)
      const nextValue = nonogram.shiftCellValue(currentValue);
      board.value[rowIndex][cellIndex] = nextValue;

      
      //// check row/column statuses
      const { rowChecks, columnChecks } = nonogram.checkRowAndColumns(board.value);
      debugCheckCounts(rowChecks, columnChecks);

      // checkWinner();
      // currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X';
    }

    // util, private
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
      currentPlayer.value = 'X';
      winner.value = null;
    }

    return { board, makeMove, resetGame, isWin, winner, isDraw };
  }
};
</script>

<style scoped>
.component-nonogram-game {
  display: block;

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
