import {colours, settings} from './_settings.js';
import {drawT, drawO, drawR, drawU} from './_shapes.js';
import {getRowsAndCols} from './_utils.js';

const draw = SVG().addTo('#logo-container')
let interval
const blocks = []

const drawBlock = (x, y) => {
	const spacer = settings.padding + settings.size;
	const start = settings.padding;
	let shape_class, shape_index, is_main_logo, block

	is_main_logo = y == 0 && x < 4
	shape_index = is_main_logo ? x : Math.floor(Math.random()  * 4);
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
		is_main_logo: is_main_logo
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
		let change_shape = Math.random() < 0.1
		if (! block.is_main_logo && change_shape) {
			let shape_class = ".letter-" + Math.floor(Math.random()  * 4)
			block.block.use (draw.defs().findOne(shape_class))
		}

		if (block.is_main_logo) {
			block.block.opacity (1)
		} else {
			block.block.opacity (Math.random()*0.12)
		}
	})
}

clearInterval (interval)
interval = setInterval (update, 50)
