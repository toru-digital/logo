import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';

let container;
let camera, scene, renderer;
let logoGroup;
let letter_size = 50
let shapes = [];

let settings = {
	tracking : 100,
	corners : 0.75,
	background_color : 0xf0f0f0,
	foreground_color_1 : 0xCCCCCC,
	foreground_color_2 : 0x000000,
	scale_speed : 0.01
};

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

	const middle = Math.min (letter_size * corner_multiplier, letter_size);
	const corner = Math.max ((letter_size - middle) * 0.5, 0);
	const offset = letter_size * -0.5;

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
			letter_size + offset,
			corner + offset
		)
		.lineTo (
			letter_size + offset,
			corner + middle + offset
		)
		.lineTo (
			corner + middle + offset,
			corner + middle + offset
		)
		.lineTo (
			corner + middle + offset,
			letter_size + offset
		)
		.lineTo (
			corner + offset,
			letter_size + offset
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
	let radius = letter_size * 0.5;
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
	const offset = letter_size * -0.5;

	const size = letter_size;
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

	const corner = Math.min (letter_size * corner_multiplier, letter_size * 0.25)
	const offset = letter_size * -0.5;

	const shape = new THREE.Shape()
		.moveTo (letter_size - corner * 2 + offset, 0 + offset)
		.lineTo (corner * 2 + offset, 0 + offset)
		.bezierCurveTo (
			0 + offset, 0 + offset, 
			0 + offset, corner * 2 + offset, 
			0 + offset, corner * 2 + offset
		)
		.lineTo (0 + offset, letter_size + offset)
		.lineTo (letter_size + offset, letter_size + offset)
		.lineTo (letter_size + offset, corner * 2 + offset)
		.bezierCurveTo (
			letter_size + offset, corner*2 + offset, 
			letter_size + offset, 0 + offset, 
			letter_size - corner * 2 + offset, 0 + offset
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
	let geometry, color, yoyo

	for (let i = 0; i < col_count; i++) {
		for (let j = 0; j < row_count; j++) {
			is_middle_row = j == Math.floor (row_count / 2)
			col_logo_offset = is_middle_row ? i - Math.floor (col_count / 2) + 2 : -1

			distance_fromCenter_x = Math.abs (i - Math.floor (col_count / 2) + 2)
			distance_fromCenter_y = Math.abs (j - Math.floor (row_count / 2))

			delay = Math.max (distance_fromCenter_x, distance_fromCenter_y) * 0.2 + Math.random() * 0.2

			if (col_logo_offset >= 0 && col_logo_offset < 4) {
				color = settings.foreground_color_2
				geometry = letters [col_logo_offset].clone ()
			} else {
				color = settings.foreground_color_1
				geometry = letters [Math.floor (Math.random () * letters.length)].clone ()
			}

			let mesh = new THREE.Mesh ( 
				geometry, 
				new THREE.MeshBasicMaterial ({color: color})
			);

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
				.to ( { scale:1 }, 1000)
				.delay (shape.delay * 400)
				.easing (TWEEN.Easing.Elastic.Out)
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

animate ()