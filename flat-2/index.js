import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';

let container;
let camera, scene, renderer;
let logoGroup;
let shapes = [];

let settings = {
	letter_size : 70,
	tracking : 110,
	corners : 0.75,
	background_color : 0x5FD1F0,
	foreground_color_1 : 0xFFFFFF,
	foreground_color_2 : 0x000000,
	scale_speed : 0.01,
	tween: TWEEN.Easing.Elastic.Out,
	speed: 1900,
	delay: 500,
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
	
	return new THREE.ShapeGeometry (shape);
}

function getO () {
	let radius = settings.letter_size * 0.5;
	let segments = 32;
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
		shape.moveTo(0, 0);
		shape.lineTo(x, y);
		shape.lineTo(x_next, y_next);
		shape.lineTo(0, 0);
	}

	return new THREE.ShapeGeometry (shape);
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

	return new THREE.ShapeGeometry (shape);
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

	return new THREE.ShapeGeometry ( shape );
}

function buildGrid () {
	const col_count = 2 * Math.round (window.innerWidth * 2 / settings.tracking / 2)
	const row_count = 2 * Math.round (window.innerHeight * 2 / settings.tracking / 2) + 1

	const letters = [ getT (), getO (), getR (), getU ()]

	shapes.forEach (shape => {logoGroup.remove (shape.mesh)})
	shapes = [];

	const x_start = (col_count - 1) * settings.tracking * -0.5;
	const y_start = (row_count - 1) * settings.tracking * -0.5;
	let is_middle_row, col_logo_offset, distance_fromCenter_x, distance_fromCenter_y, delay
	let geometry, color, opacity

	for (let i = 0; i < col_count; i++) {
		for (let j = 0; j < row_count; j++) {
			is_middle_row = j == Math.floor (row_count / 2)
			col_logo_offset = is_middle_row ? i - Math.floor (col_count / 2) + 2 : -1

			distance_fromCenter_x = Math.abs (i - Math.floor (col_count / 2) + 2)
			distance_fromCenter_y = Math.abs (j - Math.floor (row_count / 2))

			delay = Math.max (
				distance_fromCenter_x, 
				distance_fromCenter_y
			) * 0.2 + Math.random() * 0.2

			if (col_logo_offset >= 0 && col_logo_offset < 4) {
				color = settings.foreground_color_2
				geometry = letters [col_logo_offset].clone ()
				opacity = 1
			} else {
				color = settings.foreground_color_1
				geometry = letters [Math.floor (Math.random () * letters.length)].clone ()
				opacity = Math.random () * 0.8 + 0.8
			}

			let material = new THREE.MeshBasicMaterial ({color: color, transparent : true, opacity})
			let mesh = new THREE.Mesh (geometry, material);
			mesh.position.set (x_start + i * settings.tracking, y_start + j * settings.tracking, 0)
			mesh.scale.set (0, 0, 0);
			
			shapes.push ({
				mesh,
				scale: 0,
				delay,
			})

			logoGroup.add (mesh)
		}
	}

	shapes.forEach (shape => {
		new TWEEN.Tween(shape)
				.to ( { scale:1 }, settings.speed)
				.delay (shape.delay * settings.delay)
				.easing (settings.tween)
				.start ()
	})
}

function buildControls () {
	const gui = new GUI ()

	const colorsFolder = gui.addFolder ('Colours')

	colorsFolder.addColor (settings, 'background_color')
	colorsFolder.addColor (settings, 'foreground_color_1')
	colorsFolder.addColor (settings, 'foreground_color_2')

	colorsFolder.close ()

	const shapeFolder = gui.addFolder ('Shape')

	shapeFolder.add (settings, 'letter_size', 0, 300)
	shapeFolder.add (settings, 'tracking', 0, 300)
	shapeFolder.add (settings, 'corners', 0, 1)

	shapeFolder.close ()

	const animationFolder = gui.addFolder ('Animation')

	animationFolder.add (settings, 'tween', constants.tween )
	animationFolder.add (settings, 'speed', 10, 3000)
	animationFolder.add (settings, 'delay', 0, 2000)

	animationFolder.close ()

	var obj = { go:startAnimation};
	gui.add (obj,'go');
}

function render() {
	renderer.render( scene, camera );
}

function animate () {

	shapes.forEach (shape => {
		shape.mesh.scale.set (shape.scale, shape.scale, shape.scale)
	})

	requestAnimationFrame(animate)
	render()

	TWEEN.update();
}

function startAnimation () {
	scene.background = new THREE.Color(settings.background_color)
	buildGrid ();
	render ()
}

buildControls ();
buildScene ();
scene.background = new THREE.Color(settings.background_color)
animate ()