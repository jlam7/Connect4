/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
	// TODO: set "board" to empty HEIGHT x WIDTH matrix array
	for (let i = 0; i < HEIGHT; i++) {
		board.push([]);
		for (let j = 0; j < WIDTH; j++) {
			board[i].push(null);
		}
	}
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
	// TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
	const htmlBoard = document.querySelector('#board');

	// TODO: create row at the top (which players drop in pieces)
	const top = document.createElement('tr');
	top.setAttribute('id', 'column-top');
	top.addEventListener('click', handleClick);

	// TODO: create individual cells for the row at the top (which players drop in pieces)
	for (let x = 0; x < WIDTH; x++) {
		const headCell = document.createElement('td');
		headCell.setAttribute('id', x);
		top.append(headCell);
	}
	htmlBoard.append(top);

	// TODO: create individual cells for the rest of the board (where the game is played on)
	for (let y = 0; y < HEIGHT; y++) {
		const row = document.createElement('tr');
		for (let x = 0; x < WIDTH; x++) {
			const cell = document.createElement('td');
			cell.setAttribute('id', `${y}-${x}`);
			row.append(cell);
		}
		htmlBoard.append(row);
	}
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
	// TODO: write the real version of this, rather than always returning 0
	for (let i = HEIGHT - 1; i >= 0; i--) {
		if (board[i][x] === null) {
			return i;
		}
	}
	return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

let keyframeObj = {};
function placeInTable(y, x) {
	// TODO: make a div and insert into correct table cell
	const allTds = [ ...document.querySelectorAll('#column-top ~tr td') ];
	const location = `${y}-${x}`;
	let keyFrameNum = keyframeObj[x];

	const onePiece = document.createElement('div');
	onePiece.classList.add('piece', `slide${keyFrameNum}`); //use keyFrameNum to determine start position of where to drop in piece

	if (currPlayer === 1) {
		onePiece.classList.add('p1'); //player1 will be red
	} else {
		onePiece.classList.add('p2'); //player2 will be blue
	}

	const foundTD = allTds.filter((td) => td.getAttribute('id').includes(location))[0]; //to access content inside
	if (foundTD.childElementCount === 0) {
		foundTD.append(onePiece);
	}
}

/** endGame: announce game end */

function endGame(msg) {
	// TODO: pop up alert message
	alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
	// get x from ID of clicked cell
	const x = +evt.target.id;

	// keep track of number of times click event occurs at position 'x'
	if (keyframeObj[x]) {
		keyframeObj[x]++;
	} else {
		keyframeObj[x] = 1;
	}

	// get next spot in column (if none, ignore click)
	const y = findSpotForCol(x);
	if (y === null) {
		return;
	}

	// place piece in board and add to HTML table
	// TODO: add line to update in-memory board
	placeInTable(y, x);
	board[y][x] = Number(`${currPlayer}`);

	// check for win
	if (checkForWin()) {
		return endGame(`Player ${currPlayer} won!`);
	}

	// check for tie
	// TODO: check if all cells in board are filled; if so call, call endGame
	if (board.every((row) => row.every((cell) => cell === 1 || cell === 2))) {
		return endGame('It is a tie!');
	}

	// switch players
	// TODO: switch currPlayer 1 <-> 2
	currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer

		return cells.every(([ y, x ]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer); //???
	}

	// TODO: read and understand this code. Add comments to help you.

	for (var y = 0; y < HEIGHT; y++) {
		for (var x = 0; x < WIDTH; x++) {
			var horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ]; //4 possible matches per row - total : 24 possible matches
			var vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ]; //3 possible matches per column - total : 21 possible matches
			var diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ]; //4,5,6,6,5,4 - total : 12 possible matches
			var diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ]; //4,5,6,6,5,4 - total : 12 possible matches
			//total runtime : 69 possible matches?
			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
}

makeBoard();
makeHtmlBoard();
