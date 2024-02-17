import {colours, settings} from './_settings.js';
import {drawT, drawO, drawR, drawU} from './_shapes.js';
import {getRowsAndCols} from './_utils.js';

const draw = SVG().addTo('#logo-container')
let interval, max_distance = 1000
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
		chaos: 0,
		is_main_logo: is_main_logo
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

		if (block.is_main_logo) {
			block.block.opacity (1)
			return
		}

		change_shape = Math.random() < 0.3 * block.chaos
		opacity = Math.random()*0.3 * block.chaos
		
		block.block.opacity (opacity)
		if (change_shape) {
			let shape_class = ".letter-" + Math.floor(Math.random()  * 4)
			block.block.use (draw.defs().findOne(shape_class))
		}

		// block.chaos = Math.max(0, block.chaos - 0.0000001)
	})
}

clearInterval (interval)
interval = setInterval (update, 50)



const onMouseMove = e => {
	blocks.forEach ((block) => {
		let distance = Math.sqrt(
			Math.pow(e.clientX - block.block.x(), 2) + 
			Math.pow(e.clientY - block.block.y(), 2)
		)

		let new_chaos = (1 - distance / max_distance*2.5)
		block.chaos = Math.min(1, new_chaos);
	})
}

window.removeEventListener ("mousemove", onMouseMove);
window.addEventListener ("mousemove", onMouseMove);