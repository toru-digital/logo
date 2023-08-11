import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { TWEEN } from '../tween.module.min';

let container;
let camera, scene, renderer;
let logoGroup;
let shapes = [];

let settings = {
	letter_size : 190,
	tracking : 240,
	corners : 0.75,
	depth : 20,
	current_depth : 0,
	background_color : 0xA4E77F,
	foreground_color : 0xFFFFFF,
	t:true,
	o:true,
	r:true,
	u:true,
	tween: TWEEN.Easing.Exponential.Out,
	forwards: true,
	speed: 2000
};

const extrudeSettings = {
	steps: 1,
	bevelEnabled: true,
	bevelThickness: 0,
	bevelOffset: 0,
	bevelSegments: 1,
	depth : 1000
};

const constants = {
	tween: {
			"Linear.In" : TWEEN.Easing.Linear.In,
			"Linear.Out" : TWEEN.Easing.Linear.Out,
			"Linear.InOut" : TWEEN.Easing.Linear.InOut,
			"Quadratic.In" : TWEEN.Easing.Quadratic.In,
			"Quadratic.Out" : TWEEN.Easing.Quadratic.Out,
			"Quadratic.InOut" : TWEEN.Easing.Quadratic.InOut,
			"Cubic.In" : TWEEN.Easing.Cubic.In,
			"Cubic.Out" : TWEEN.Easing.Cubic.Out,
			"Cubic.InOut" : TWEEN.Easing.Cubic.InOut,
			"Quartic.In" : TWEEN.Easing.Quartic.In,
			"Quartic.Out" : TWEEN.Easing.Quartic.Out,
			"Quartic.InOut" : TWEEN.Easing.Quartic.InOut,
			"Quintic.In" : TWEEN.Easing.Quintic.In,
			"Quintic.Out" : TWEEN.Easing.Quintic.Out,
			"Quintic.InOut" : TWEEN.Easing.Quintic.InOut,
			"Sinusoidal.In" : TWEEN.Easing.Sinusoidal.In,
			"Sinusoidal.Out" : TWEEN.Easing.Sinusoidal.Out,
			"Sinusoidal.InOut" : TWEEN.Easing.Sinusoidal.InOut,
			"Exponential.In" : TWEEN.Easing.Exponential.In,
			"Exponential.Out" : TWEEN.Easing.Exponential.Out,
			"Exponential.InOut" : TWEEN.Easing.Exponential.InOut,
			"Circular.In" : TWEEN.Easing.Circular.In,
			"Circular.Out" : TWEEN.Easing.Circular.Out,
			"Circular.InOut" : TWEEN.Easing.Circular.InOut,
			"Elastic.In" : TWEEN.Easing.Elastic.In,
			"Elastic.Out" : TWEEN.Easing.Elastic.Out,
			"Elastic.InOut" : TWEEN.Easing.Elastic.InOut,
			"Back.In" : TWEEN.Easing.Back.In,
			"Back.Out" : TWEEN.Easing.Back.Out,
			"Back.InOut" : TWEEN.Easing.Back.InOut,
			"Bounce.In" : TWEEN.Easing.Bounce.In,
			"Bounce.Out" : TWEEN.Easing.Bounce.Out,
			"Bounce.InOut" : TWEEN.Easing.Bounce.InOut,
	}
}

function buildScene () {
	container = document.createElement ('div');
	document.body.appendChild (container);

	scene = new THREE.Scene();

	camera = new THREE.OrthographicCamera
	(
		window.innerWidth / - 2, 
		window.innerWidth / 2, 
		window.innerHeight / 2, 
		window.innerHeight / - 2,
		1, 
		10000
	);

	camera.position.set (0, 0, 1200);
	scene.add (camera);

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	logoGroup = new THREE.Group ();
	scene.add (logoGroup);	

	console.log (settings.background_color)
	scene.background = new THREE.Color( settings.background_color );
}

function getCircle (radius, offset_x, offset_y, start, end) {
	let segments = 64;
	let theta, x1, y1
	let theta_next, x2, y2, j;
	let arr = []

	const start_index = segments * start;
	const end_index = segments * end;

	function getPoints (i) {
		theta = ((i + 1) / segments) * Math.PI * 2.0;
		x1 = radius * Math.cos(theta) + offset_x;
		y1 = radius * Math.sin(theta) + offset_y;
		j = i + 2;
		if( (j - 1) === segments ) j = 1;
		theta_next = (j / segments) * Math.PI * 2.0;
		x2 = radius * Math.cos(theta_next) + offset_x;
		y2 = radius * Math.sin(theta_next) + offset_y;
		return [x1, y1], [x2, y2]
	}

	if (start < end) {
		for (let i = start_index; i < end_index; i++) {
			arr.push (getPoints(i));
		}
	} else {
		for (let i = start_index-1; i >= end_index; i--) {
			arr.push (getPoints(i));
		}
	}

	return arr;
}

function getT () {
	const corner_multiplier = 0.4 + 0.6 * (1-settings.corners);

	const middle = Math.min (settings.letter_size * corner_multiplier, settings.letter_size);
	const corner = Math.max ((settings.letter_size - middle) * 0.5, 0);
	const offset = settings.letter_size * -0.5;

	const shape = new THREE.Shape()
		.moveTo (
			corner + offset,
			0 + offset
		)
		.lineTo (
			corner + middle + offset, 
			0 + offset
		)
		.lineTo (
			corner + middle + offset, 
			corner + offset
		)
		.lineTo (
			settings.letter_size + offset,
			corner + offset
		)
		.lineTo (
			settings.letter_size + offset,
			corner + middle + offset
		)
		.lineTo (
			corner + middle + offset,
			corner + middle + offset
		)
		.lineTo (
			corner + middle + offset,
			settings.letter_size + offset
		)
		.lineTo (
			corner + offset,
			settings.letter_size + offset
		)
		.lineTo (
			corner + offset,
			corner + middle + offset
		)
		.lineTo (
			0 + offset,
			corner + middle + offset
		)
		.lineTo (
			0 + offset,
			corner + offset
		)
		.lineTo (
			corner + offset,
			corner + offset
		)
		.moveTo (
			corner + offset,
			0 + offset
		)
	
	let geometry = new THREE.ExtrudeGeometry (shape, {...extrudeSettings, bevelSize: settings.bevelSize});
	let mesh = new THREE.Mesh ( 
		geometry, 
		[
			new THREE.MeshBasicMaterial ({color: settings.background_color}),
			new THREE.MeshBasicMaterial ({color: settings.foreground_color})
		]
	);

	return mesh
}

function getO () {
	let radius = settings.letter_size * 0.5;
	let segments = 64;
	let theta, x, y
	let theta_next, x_next, y_next, j;
	let shape = new THREE.Shape()

	for (let i = 0; i < segments; i++) {
		theta = ((i + 1) / segments) * Math.PI * 2.0;
		x = radius * Math.cos(theta);
		y = radius * Math.sin(theta);
		j = i + 2;
		if( (j - 1) === segments ) j = 1;
		theta_next = (j / segments) * Math.PI * 2.0;
		x_next = radius * Math.cos(theta_next);
		y_next = radius * Math.sin(theta_next);

		// console.log (x, y, x_next, y_next)

		shape.moveTo(0, 0);
		shape.lineTo(x, y);
		shape.lineTo(x_next, y_next);
	}

	let geometry = new THREE.ExtrudeGeometry (shape, {...extrudeSettings, bevelSize: settings.bevelSize});
	let mesh = new THREE.Mesh ( 
		geometry, 
		[
			new THREE.MeshBasicMaterial ({color: settings.background_color}),
			new THREE.MeshBasicMaterial ({color: settings.foreground_color})
		]
	);
	return mesh
}

function getR () {
	const offset = settings.letter_size * -0.5;

	const size = settings.letter_size;
	const shape = new THREE.Shape()
		.moveTo (
			0 + offset, 
			0 + offset
		)
		.lineTo (
			size + offset, 
			0 + offset
		)
		.lineTo (
			size + offset, 
			size + offset
		)
		.lineTo (
			0 + offset, 
			size + offset
		)
		.lineTo (
			0 + offset, 
			0 + offset
		)

	let geometry = new THREE.ExtrudeGeometry (shape, {...extrudeSettings, bevelSize: settings.bevelSize});
	let mesh = new THREE.Mesh ( 
		geometry, 
		[
			new THREE.MeshBasicMaterial ({color: settings.background_color}),
			new THREE.MeshBasicMaterial ({color: settings.foreground_color})
		]
	);
	return mesh
}

function getU () {

	const corner_multiplier = settings.corners * 0.3

	const corner = Math.min (settings.letter_size * corner_multiplier, settings.letter_size * 0.25)
	const offset = settings.letter_size * -0.5;

	const shape = new THREE.Shape()
		.moveTo (settings.letter_size - corner * 2 + offset, 0 + offset)
		.lineTo (corner * 2 + offset, 0 + offset)
		.bezierCurveTo (
			0 + offset, 0 + offset, 
			0 + offset, corner * 2 + offset, 
			0 + offset, corner * 2 + offset
		)
		.lineTo (0 + offset, settings.letter_size + offset)
		.lineTo (settings.letter_size + offset, settings.letter_size + offset)
		.lineTo (settings.letter_size + offset, corner * 2 + offset)
		.bezierCurveTo (
			settings.letter_size + offset, corner*2 + offset, 
			settings.letter_size + offset, 0 + offset, 
			settings.letter_size - corner * 2 + offset, 0 + offset
		)

	let geometry = new THREE.ExtrudeGeometry (shape, {...extrudeSettings, bevelSize: settings.bevelSize});
	let mesh = new THREE.Mesh ( 
		geometry, 
		[
			new THREE.MeshBasicMaterial ({color: settings.background_color}),
			new THREE.MeshBasicMaterial ({color: settings.foreground_color})
		]
	);

	return mesh
}

function buildLogo () {

	shapes.forEach (shape => {
		logoGroup.remove (shape);
	})

	shapes = []

	if (settings.t) shapes.push (getT ())
	if (settings.o) shapes.push (getO ())
	if (settings.r) shapes.push (getR ())
	if (settings.u) shapes.push (getU ())

	const x_start = (shapes.length - 1) * settings.tracking * -0.5;

	shapes.forEach ((shape, index) => {
		shape.position.set (x_start + index * settings.tracking, 0, 0);
		logoGroup.add (shape);
	})
}

function buildControls () {
	const gui = new GUI()

	const shapeFolder = gui.addFolder ('Shape')
	
	shapeFolder.add (settings, 'letter_size', 0.1, 400)
	shapeFolder.add (settings, 'tracking', 0, 600)
	shapeFolder.add (settings, 'corners', 0, 1)
	shapeFolder.add (settings, 'depth', 0, 20)

	shapeFolder.close ()

	const colorsFolder = gui.addFolder ('Colours')

	colorsFolder.addColor (settings, 'background_color')
	colorsFolder.addColor (settings, 'foreground_color')

	colorsFolder.close ()

	const lettersFolder = gui.addFolder ('Letters')

	lettersFolder.add (settings, 't')
	lettersFolder.add (settings, 'o')
	lettersFolder.add (settings, 'r')
	lettersFolder.add (settings, 'u')

	lettersFolder.close ()

	const animationFolder = gui.addFolder ('Animation')

	animationFolder.add (settings, 'forwards')
	animationFolder.add (settings, 'tween', constants.tween )
	animationFolder.add (settings, 'speed', 10, 3000)

	animationFolder.close ()

	var obj = { go:startAnimation};
	gui.add (obj,'go');
}

function startAnimation () {
	console.log (settings.background_color)
	scene.background = new THREE.Color( settings.background_color );
	buildLogo ();

	settings.current_depth = 0

	new TWEEN.Tween(settings)
				.to ( { current_depth:settings.depth * (settings.forwards ? 1 : -1) }, settings.speed)
				.easing (settings.tween)
				.start ()
}

function animate() {
	scene.background = new THREE.Color( settings.background_color );
	logoGroup.rotation.x = settings.current_depth / -500;
	logoGroup.rotation.y = settings.current_depth / -500;

	requestAnimationFrame( animate );
	render();
	TWEEN.update();
}

function render() {
	renderer.render( scene, camera );
}

buildControls ();
buildScene ();
animate ()