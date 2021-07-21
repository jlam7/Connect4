/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
const WIDTH = 9;
const HEIGHT = 8;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

// Javascript code to add keyframes
// https://www.geeksforgeeks.org/how-to-dynamically-create-keyframe-css-animations/
let animationHeight;
let styleSheet = null;
dynamicAnimation = (name, animationHeight) => {
	// Creating a style element
	// To add the keyframes
	if (!styleSheet) {
		styleSheet = document.createElement('style');
		styleSheet.type = 'text/css';
		document.head.appendChild(styleSheet);
	}
	// Adding The Keyframes
	styleSheet.sheet.insertRule(
		`@keyframes ${name} {
		from {
			top : ${animationHeight}px;
		}
		to {
			top: 0px;
		}
	}`,
		styleSheet.length
	);
};

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

	// from the x position, the num of clicks will give you the rowNum
	let rowNum = keyframeObj[x];
	// not including the lowest row because animationHeight already starts at the highest row with the dashed line
	let totalPixel = (rowNum - 1) * 50;
	// animationHeight starts off as a negative number, so will add totalPixel for new starting position
	animationHeight = (HEIGHT + 1) * -50 + totalPixel;

	const onePiece = document.createElement('div');
	onePiece.classList.add('piece', `p${currPlayer}`);

	// will make a number of different slide (which should be the same count as the game HEIGHT)
	dynamicAnimation(`slide${rowNum}`, animationHeight);
	onePiece.style.animation = `slide${rowNum} 1s forwards`;

	const foundTD = document.getElementById(`${y}-${x}`);
	foundTD.append(onePiece);
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
	board[y][x] = currPlayer;

	// check for a win or a tie
	const foundTD = document.getElementById(`${y}-${x}`);
	if (checkForWin()) {
		const top = document.querySelector('#column-top');
		top.removeEventListener('click', handleClick, false);

		foundTD.firstChild.addEventListener('animationend', function() {
			return endGame(`Player ${currPlayer} won!`);
		});
	} else if (board.every((row) => row.every((cell) => cell))) {
		foundTD.firstChild.addEventListener('animationend', function() {
			return endGame(`It is a tie!`);
		});
	} else {
		// switch players
		// TODO: switch currPlayer 1 <-> 2
		currPlayer = currPlayer === 1 ? 2 : 1;
	}
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
