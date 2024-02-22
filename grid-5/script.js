import {colours, settings} from './_settings.js';
import {drawT, drawO, drawR, drawU} from './_shapes.js';
import {getRowsAndCols, isMobile, randomInt} from './_utils.js';

const draw = SVG().addTo('#logo-container')
let interval, scoreCount = 0, dir = ''
const blocks = []

const snake = {
	x: settings.sizeCell,
	y: settings.sizeCell,
	dirX: 0,
	dirY: 0,
	
	body: [],
	maxBodySize: 1,
}

const food = { 
	x: 0,
	y: 0,
}

const turnUp = () => {
	restart ()
	// console.log ("U")
	// if ( dir == 'down' ) return
	// dir = 'up';
	// snake.dirY = -settings.sizeCell;
	// snake.dirX = 0;
}

const turnLeft = () => {
	console.log ("L")
	if ( dir == 'right' ) return
	dir = 'left';
	snake.dirX = -settings.sizeCell;
	snake.dirY = 0;
}

const turnDown = () => {
	console.log ("D")
	if ( dir == 'up' ) return
	dir = 'down';
	snake.dirY = settings.sizeCell;
	snake.dirX = 0;
}

const turnRight = () => {
	console.log ("R")
	if ( dir == 'left' ) return
	dir = 'right';
	snake.dirX = settings.sizeCell;
	snake.dirY = 0;
}

// const checkBorder = () => { 
// 	if ( snake.x < 0 ) {
// 		snake.x = canvas.width - settings.sizeCell;
// 	} else if ( snake.x >= canvas.width ) {
// 		snake.x = 0;
// 	}

// 	if ( snake.y < 0 ) {
// 		snake.y = canvas.height - settings.sizeCell;
// 	} else if ( snake.y >= canvas.height ) {
// 		snake.y = 0;
// 	}
// }

const randomPosFood = () => {
	const {num_rows, num_cols} = getRowsAndCols ()
	food.x = randomInt(0, num_rows);
	food.y = randomInt(0, num_cols);
}

const restart = () => {
	// const {num_rows, num_cols} = getRowsAndCols ()

	// settings.stepMax = 6;
	// scoreCount = 0;

	// snake.x = randomInt(0, num_cols);
	// snake.y = randomInt(0, num_rows);
	// snake.body = [];
	// snake.maxBodySize = 1;
	// snake.dirX = 0;
	// snake.dirY = 0;

	// dir = '';

	randomPosFood();
}

const drawBlock = (x, y) => {
	const spacer = settings.padding + settings.size;
	const start = settings.padding;
	let shape_class, shape_index, block

	shape_index = Math.floor(Math.random()  * 4);
	shape_class = ".letter-" + shape_index

	block = draw.use (draw.defs().findOne(shape_class))
		.attr({
			fill: colours[settings.scheme].logo,
			opacity : 0
		})
		.move (
			start + x * spacer, 
			start + y * spacer )

	return{
		x: x,
		y: y,
		block: block,
		chaos: 0
	}
}

const drawGrid = () => {
	const {num_rows, num_cols} = getRowsAndCols ()
	for (let x = 0; x < num_cols; x++) {
		for (let y = 0; y < num_rows; y++) {
			blocks.push (drawBlock (x,y))
		}
	}
}

const setup = () => {
	document.body.style.backgroundColor = colours[settings.scheme].background
	
	draw.clear()
	drawT (draw)
	drawO (draw)
	drawR (draw)
	drawU (draw)
	
	drawGrid()
}

setup()

const update = () => {
	blocks.forEach ((block) => {
		let opacity, colour
		const is_food = block.x == food.x && block.y == food.y

		// change_shape = Math.random() < 0.3 * block.chaos
		opacity = is_food ? 1 : 0.1; //Math.random()*0.3 * block.chaos
		colour = is_food ? "#EDFE06" : "white"

		block.block.opacity (opacity)
		block.block.fill (colour)

		block.chaos = Math.max(0, block.chaos - 0.03)
	})
}

clearInterval (interval)
interval = setInterval (update, 50)

restart()

document.addEventListener('keydown', (e) => {
	if ( e.keyCode == 87 || e.keyCode == 38 ) turnUp()
	if ( e.keyCode == 65 || e.keyCode == 37 ) turnLeft()
	if ( e.keyCode == 83 || e.keyCode == 40 ) turnDown()
	if ( e.keyCode == 68 || e.keyCode == 39 ) turnRight()
	e.preventDefault ()
});

// function gameLoop() {
// 	requestAnimationFrame (gameLoop);

// 	if ( ++config.step < config.stepMax ) return;
// 	config.step = 0;

// 	ctx.clearRect(0, 0, canvas.width, canvas.height);
// 	drawFood();
// 	drawSnake();
// }

// gameLoop();

// function score() {
// 	scoreCount++;
// 	if ( scoreCount > 15 ) config.stepMax = 5;
// 	else if ( scoreCount <= 15 ) config.stepMax = 6;
// }

// function drawSnake() {
// 	snake.x += snake.dirX;
// 	snake.y += snake.dirY;

// 	checkBorder();

// 	snake.body.unshift({x: snake.x, y: snake.y});
// 	if ( snake.body.length > snake.maxBodySize ) {
// 		snake.body.pop();
// 	}

// 	snake.body.forEach((e, index) => {

// 		ctx.fillStyle = '#FFFFFF';
// 		ctx.fillRect(e.x, e.y, config.sizeCell, config.sizeCell);

// 		if ( e.x == food.x && e.y == food.y ) {

// 			score();
// 			randomPosFood();
// 			snake.maxBodySize++;
// 		}

// 		for ( let i = index + 1; i < snake.body.length; i++ ) {
// 			if ( e.x === snake.body[i].x && e.y === snake.body[i].y ) {
// 				restart();
// 			}
// 		}
// 	});
// }
