import {colours, settings} from './_settings.js';
import {drawT, drawO, drawR, drawU} from './_shapes.js';

const draw = SVG().addTo('#logo-container')

const drawGrid = () => {

	const container_width = document.getElementById("logo-container").getElementsByTagName("svg")[0].clientWidth
	const container_height = document.getElementById("logo-container").getElementsByTagName("svg")[0].clientHeight
	
	const start = settings.padding;
	const spacer = settings.padding + settings.size;
	
	const num_cols = Math.ceil (container_width / (settings.size + settings.padding))
	const num_rows = Math.ceil (container_height / (settings.size + settings.padding))

	let shape_class
	let shape_index
	let shape_colour
	let is_main_logo
	for (let x = 0; x < num_cols; x++) {
		for (let y = 0; y < num_rows; y++) {
			is_main_logo = y == 0 && x < 4
			shape_index = is_main_logo ? x : Math.floor(Math.random()  * 4);
			shape_class = ".letter-" + shape_index
			shape_colour = is_main_logo ? colours[settings.scheme].logo : colours[settings.scheme].logo_background

			draw.use (draw.defs().findOne(shape_class))
			.attr({fill: shape_colour})
			.move (
				start + x * spacer, 
				start + y * spacer )
		}
	}
}

const setColours = s => {
	settings.scheme = s
	document.body.style.backgroundColor = colours[settings.scheme].background
	document.getElementById("controls-container").style.backgroundColor = colours[settings.scheme].controls
	Array.from(document.getElementsByClassName("text")).forEach(e => e.style.color = colours[settings.scheme].text)

	draw.clear()
	drawT (draw)
	drawO (draw)
	drawR (draw)
	drawU (draw)
	drawGrid()
}

setColours(settings.scheme)