import {colours, settings} from './_settings.js';
import {drawT, drawO, drawR, drawU} from './_shapes.js';
import {getRowsAndCols} from './_utils.js';

const draw = SVG().addTo('#logo-container')
let interval
const blocks = []

const drawGrid = () => {
	const {num_rows, num_cols} = getRowsAndCols ()
	const spacer = settings.padding + settings.size;
	const start = settings.padding;
	let shape_class, shape_index, is_main_logo, block

	for (let x = 0; x < num_cols; x++) {
		for (let y = 0; y < num_rows; y++) {
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

			blocks.push ({
				x: x,
				y: y,
				block: block,
				is_main_logo: is_main_logo
			})
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
	console.log ("hi")
}

clearInterval (interval)
interval = setInterval (update, 50)
