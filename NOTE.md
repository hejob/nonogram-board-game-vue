Nonogram Player & Solver
====

Vue3.0 Env
----

> npm create vue@3.9

(vue@latest needs node >= 16.20.0, now 16.15.1)

> npm install
> npm run format
> npm run dev

NOTICE: some optional modules: test, state pinia, router, typescript, JSX, eslint, prettier?


Development
----

* basic board game
* show row/column counts and target counts
* row/column count helper: show completed row/columns and automatically fills cells
* row/column count helper: show wrong (not able to get correct answer from now on) row/columns. (have simple and smarter implementations)
* simple solver button: half-brute-force solver for looping through all row/columns with all possible patterns in a line, without multiple solutions
* better/quicker solver
* UI enhancements: css
* changeable Number and sizes, inputs
* better input methods: files or clicks
* python: recognize picture for inputs
