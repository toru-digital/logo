import {colours, settings} from './_settings.js';
import {drawT, drawO, drawR, drawU} from './_shapes.js';
import {getRowsAndCols} from './_utils.js';

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

const turnUp = () => {
	console.log ("U")
	if ( dir == 'down' ) return
	dir = 'up';
	snake.dirY = -settings.sizeCell;
	snake.dirX = 0;
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

const checkBorder = () => { 
	if ( snake.x < 0 ) {
		snake.x = canvas.width - settings.sizeCell;
	} else if ( snake.x >= canvas.width ) {
		snake.x = 0;
	}

	if ( snake.y < 0 ) {
		snake.y = canvas.height - settings.sizeCell;
	} else if ( snake.y >= canvas.height ) {
		snake.y = 0;
	}
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
		let change_shape, opacity

		change_shape = Math.random() < 0.3 * block.chaos
		opacity = 0.2; //Math.random()*0.3 * block.chaos
		
		block.block.opacity (opacity)
		if (change_shape) {
			let shape_class = ".letter-" + Math.floor(Math.random()  * 4)
			block.block.use (draw.defs().findOne(shape_class))
		}

		block.chaos = Math.max(0, block.chaos - 0.03)
	})
}

clearInterval (interval)
interval = setInterval (update, 50)

document.addEventListener('keydown', (e) => {
	if ( e.keyCode == 87 || e.keyCode == 38 ) turnUp()
	if ( e.keyCode == 65 || e.keyCode == 37 ) turnLeft()
	if ( e.keyCode == 83 || e.keyCode == 40 ) turnDown()
	if ( e.keyCode == 68 || e.keyCode == 39 ) turnRight()
	e.preventDefault ()
});