import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

let container;
let camera, scene, renderer;
let logoGroup;
let letter_size
let shapes = [];

let settings = {
	letter_size : 45,
	tracking : 200,
	corners : 0.75,
	background_color : 0xf0f0f0,
	foreground_color_1 : 0x000000,
	foreground_color_2 : 0xFF0000,
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
	
	let geometry = new THREE.ShapeGeometry (shape);
	let mesh = new THREE.Mesh ( 
		geometry, 
		new THREE.MeshBasicMaterial ({color: settings.foreground_color_1})
	);

	return mesh
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

	let geometry = new THREE.ShapeGeometry (shape);
	let mesh = new THREE.Mesh ( 
		geometry, 
		new THREE.MeshBasicMaterial ({color: settings.foreground_color_1})
	);
	return mesh
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

	let geometry = new THREE.ShapeGeometry (shape);
	let mesh = new THREE.Mesh ( 
		geometry, 
		new THREE.MeshBasicMaterial ({color: settings.foreground_color_1})
	);
	return mesh
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

	let geometry = new THREE.ShapeGeometry ( shape );
	let mesh = new THREE.Mesh ( 
		geometry, 
		new THREE.MeshBasicMaterial ({color: settings.foreground_color_1})
	);

	return mesh
}

function buildGrid () {
	const col_count = 2 * Math.round (window.innerWidth * 2 / settings.tracking / 2) + 1
	const row_count = 2 * Math.round (window.innerHeight * 2 / settings.tracking / 2) + 1

	const letters = [ getT (), getO (), getR (), getU ()]

	shapes.forEach (shape => {logoGroup.remove (shape)})

	const x_start = (col_count - 1) * settings.tracking * -0.5;
	const y_start = (row_count - 1) * settings.tracking * -0.5;

	for (let i = 0; i < col_count; i++) {
		for (let j = 0; j < row_count; j++) {
			const shape = letters [Math.floor (Math.random () * letters.length)].clone ()
			shapes.push (shape)
			shape.position.set (x_start + i * settings.tracking, y_start + j * settings.tracking, 0)
			logoGroup.add (shape)
		}
	}
}

function buildControls () {
	const gui = new GUI ()

	const settingsFolder = gui.addFolder ('Settings')

	settingsFolder.add (settings, 'letter_size', 0, 400)
	settingsFolder.add (settings, 'tracking', 50, 600)
	settingsFolder.add (settings, 'corners', 0, 1)
	settingsFolder.addColor (settings, 'background_color')
	settingsFolder.addColor (settings, 'foreground_color_1')
	settingsFolder.addColor (settings, 'foreground_color_2')

	settingsFolder.close ()

	var obj = { go:function () { console.log("clicked") }};
	gui.add (obj,'go');

	gui.onChange (render)
}

function render() {
	letter_size = Math.min (settings.letter_size, settings.tracking)

	scene.background = new THREE.Color(settings.background_color);
	buildGrid ();
	
	renderer.render( scene, camera );
}

buildScene ();
buildGrid ();
buildControls ();
render ();