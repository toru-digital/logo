import {colours, settings} from './_settings.js';
import {drawT, drawO, drawR, drawU} from './_shapes.js';
import {getRowsAndCols} from './_utils.js';

const draw = SVG().addTo('#logo-container')
let interval, max_distance = 1000
const blocks = []

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
	const {num_rows, num_cols, hypot} = getRowsAndCols ()
	max_distance = hypot
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
		opacity = 0.2;//Math.random()*0.3 * block.chaos
		
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