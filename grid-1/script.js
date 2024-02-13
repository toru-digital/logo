
const colours = {
	"white-on-black": {
		background: "#000",
		controls: "rgb(17,17,17)",
		text: "#FFF",
		logo: "#FFF"
	},
	"black-on-white": {
		background: "#FFF",
		controls: "#FAFAFA",
		text: "#000",
		logo: "#000"
	},
	"black-on-yellow": {
		background: "#EDFE06",
		controls: "#EDFE06",
		text: "#000",
		logo: "#000"
	},
	"dark": {
		background: "#000",
		controls: "#000",
		text: "#000",
		logo_background: "#191919",
		logo: "#FFF"
	},
}

const settings = {
	size: 30,
	padding: 4,
	growth: 1
}

let scheme = "dark"

const draw = SVG().addTo('#logo-container')

const drawT = () => {
	const s1 = settings.size;
	const s2 = settings.size * 0.2 * settings.growth;
	const s3 = s1 - s2;

	draw.defs().group ().addClass('letter-0')
		.path(`M ${s2}  0 L ${s3} 0 L ${s3} ${s2} L ${s1} ${s2} L ${s1} ${s3} L ${s3} ${s3} L ${s3} ${s1} L ${s2} ${s1} L ${s2} ${s3} L 0 ${s3} L 0 ${s2} L ${s2} ${s2} L ${s2} 0`)
		
}

const drawO = () => {
	return draw.defs().group ().addClass('letter-1')
		.rect(settings.size, settings.size)
		.radius(settings.size * 0.5 * settings.growth, settings.size * 0.5 * settings.growth)
}

const drawR = () => {
	draw.defs().group ().addClass('letter-2')
		.rect(settings.size, settings.size)
}

const drawU = () => {
	const s1 = settings.size
	const s2 = s1 / 3
	const s3 = s1 - s2
	const s4 = s1 * 0.15 * settings.growth
	const s5 = s1 - s4

	draw.defs ().group ().addClass('letter-3')
		.path(`
		M 0 0 
		H ${s1} 
		V ${s3} 
		C ${s1} ${s5} ${s5} ${s1} ${s3} ${s1} 
		H ${s2} 
		C ${s4} ${s1} 0 ${s5} 0 ${s3}`
	)
}

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
			shape_colour = is_main_logo ? colours[scheme].logo : colours[scheme].logo_background

			draw.use (draw.defs().findOne(shape_class))
			.attr({fill: shape_colour})
			.move (
				start + x * spacer, 
				start + y * spacer )
		}
	}
}

const setColours = s => {
	scheme = s
	document.body.style.backgroundColor = colours[scheme].background
	document.getElementById("controls-container").style.backgroundColor = colours[scheme].controls
	Array.from(document.getElementsByClassName("text")).forEach(e => e.style.color = colours[scheme].text)

	draw.clear()
	drawT ()
	drawO ()
	drawR ()
	drawU ()
	drawGrid()
}

setColours(scheme)

const start = () => { 
	settings.size = Math.round(document.getElementById("size").value);
	settings.padding = Math.round(document.getElementById("padding").value);

	scheme = document.getElementById("scheme").value;
	setColours(scheme)
}
