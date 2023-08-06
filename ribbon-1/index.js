import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

let container;
let camera, scene, renderer;
let logoGroup;
let targetRotation = 0;
let targetRotationOnPointerDown = 0;
let pointerX = 0;
let pointerXOnPointerDown = 0;
let windowHalfX = window.innerWidth / 2;
let shapes = [];

let settings = {
	letter_size : 150,
	tracking : 200,
	corners : 0.75,
	depth : 1000,
	background_color : 0xA4E77F,
	foreground_color : 0xFFFFFF,
};

buildScene ();
buildLogo ();
buildControls ();
animate ();

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

	container.style.touchAction = 'none';
	container.addEventListener( 'pointerdown', onPointerDown );

	window.addEventListener( 'resize', onWindowResize );

	logoGroup = new THREE.Group ();
	scene.add (logoGroup);	
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

	const vertices_2d = [
		[corner, 0],
		[corner + middle,  0],
		[corner + middle, corner],
		[settings.letter_size, corner],
		[settings.letter_size, corner + middle],
		[corner + middle, corner + middle],
		[corner + middle, settings.letter_size],
		[corner, settings.letter_size],
		[corner, corner + middle],
		[0, corner + middle],
		[0, corner],
		[corner, corner]
	];

	let vertices_3d = [];

	vertices_2d.forEach ((v, index) => {
		const v1 = v;
		const v2 = vertices_2d [(index + 1) % vertices_2d.length];

		vertices_3d = vertices_3d.concat ([
			v1[0] + offset, v1[1] + offset, 0,
			v2[0] + offset, v2[1] + offset, 0,
			v2[0] + offset, v2[1] + offset, -1*settings.depth,

			v2[0] + offset, v2[1] + offset, -1*settings.depth,
			v1[0] + offset, v1[1] + offset, -1*settings.depth,
			v1[0] + offset, v1[1] + offset, 0
		])
	})

	const geometry = new THREE.BufferGeometry();

	geometry.setAttribute (
		'position', 
		new THREE.BufferAttribute (new Float32Array (vertices_3d), 3) 
	);

	let mesh = new THREE.Mesh ( 
		geometry, 
		new THREE.MeshBasicMaterial ({side: THREE.DoubleSide, color: settings.foreground_color}) 
	);
	
	return mesh
}

function getO () {
	let radius = settings.letter_size * 0.5;
	let vertices_2d = getCircle (radius, 0, 0, 0, 1);

	let vertices_3d = [];

	vertices_2d.forEach ((v, index) => {
		const v1 = v;
		const v2 = vertices_2d [(index + 1) % vertices_2d.length];

		vertices_3d = vertices_3d.concat ([
			v1[0] , v1[1] , 0,
			v2[0] , v2[1] , 0,
			v2[0] , v2[1] , -1*settings.depth,

			v2[0] , v2[1] , -1*settings.depth,
			v1[0] , v1[1] , -1*settings.depth,
			v1[0] , v1[1] , 0
		])
	})

	const geometry = new THREE.BufferGeometry();
	
	geometry.setAttribute (
		'position', 
		new THREE.BufferAttribute (new Float32Array (vertices_3d), 3) 
	);

	let mesh = new THREE.Mesh ( 
		geometry, 
		new THREE.MeshBasicMaterial ({side: THREE.DoubleSide, color: settings.foreground_color}) 
	);
	
	return mesh
}

function getR () {
	const offset = settings.letter_size * -0.5;
	const size = settings.letter_size;

	const vertices_2d = [
		[0, 0],
		[size, 0],
		[size, size],
		[0, size],
		[0, 0]
	];
	
	let vertices_3d = [];

	vertices_2d.forEach ((v, index) => {
		const v1 = v;
		const v2 = vertices_2d [(index + 1) % vertices_2d.length];

		vertices_3d = vertices_3d.concat ([
			v1[0] + offset, v1[1] + offset, 0,
			v2[0] + offset, v2[1] + offset, 0,
			v2[0] + offset, v2[1] + offset, -1*settings.depth,

			v2[0] + offset, v2[1] + offset, -1*settings.depth,
			v1[0] + offset, v1[1] + offset, -1*settings.depth,
			v1[0] + offset, v1[1] + offset, 0
		])
	})

	const geometry = new THREE.BufferGeometry();

	geometry.setAttribute (
		'position', 
		new THREE.BufferAttribute (new Float32Array (vertices_3d), 3) 
	);

	let mesh = new THREE.Mesh ( 
		geometry, 
		new THREE.MeshBasicMaterial ({side: THREE.DoubleSide, color: settings.foreground_color}) 
	);
	
	return mesh
}

function getU () {

	const corner_multiplier = settings.corners * 0.5
	const corner = Math.min (
		settings.letter_size * corner_multiplier, 
		settings.letter_size * 0.5
	)
	const offset = settings.letter_size * -0.5;

	let vertices_2d = [
		[0, settings.letter_size],
		[settings.letter_size, settings.letter_size],
		[settings.letter_size, corner],
	];

	vertices_2d = vertices_2d.concat (
		getCircle (
			corner, 
			settings.letter_size - corner, 
			corner,
			1,
			0.75
		)
	)

	vertices_2d = vertices_2d.concat ([
		[settings.letter_size - corner, 0]
	])

	vertices_2d = vertices_2d.concat (
		getCircle (
			corner, 
			corner, 
			corner,
			0.75,
			0.5
		)
	)

	let vertices_3d = [];

	vertices_2d.forEach ((v, index) => {
		const v1 = v;
		const v2 = vertices_2d [(index + 1) % vertices_2d.length];

		vertices_3d = vertices_3d.concat ([
			v1[0] + offset, v1[1] + offset, 0,
			v2[0] + offset, v2[1] + offset, 0,
			v2[0] + offset, v2[1] + offset, -1*settings.depth,

			v2[0] + offset, v2[1] + offset, -1*settings.depth,
			v1[0] + offset, v1[1] + offset, -1*settings.depth,
			v1[0] + offset, v1[1] + offset, 0
		])
	})

	const geometry = new THREE.BufferGeometry();

	geometry.setAttribute (
		'position', 
		new THREE.BufferAttribute (new Float32Array (vertices_3d), 3) 
	);

	let mesh = new THREE.Mesh ( 
		geometry, 
		new THREE.MeshBasicMaterial ({side: THREE.DoubleSide, color: settings.foreground_color}) 
	);

	return mesh
}

function buildLogo () {

	shapes.forEach (shape => {
		logoGroup.remove (shape);
	})

	shapes = [ getT (), getO (), getR (), getU ()]
	const x_start = (shapes.length - 1) * settings.tracking * -0.5;

	shapes.forEach ((shape, index) => {
		shape.position.set (x_start + index * settings.tracking, 0, 0);
		logoGroup.add (shape);
	})
}

function buildControls () {
	const gui = new GUI()
	gui.add (settings, 'letter_size', 0.1, 400)
	gui.add (settings, 'tracking', 0, 600)
	gui.add (settings, 'corners', 0, 1)
	gui.addColor (settings, 'background_color')
	gui.addColor (settings, 'foreground_color')
	
	
}

function onWindowResize () {
	windowHalfX = window.innerWidth / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix ();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onPointerDown (event) {

	if ( event.isPrimary === false ) return;

	pointerXOnPointerDown = event.clientX - windowHalfX;
	targetRotationOnPointerDown = targetRotation;

	document.addEventListener( 'pointermove', onPointerMove );
	document.addEventListener( 'pointerup', onPointerUp );

}

function onPointerMove (event) {
	if ( event.isPrimary === false ) return;
	pointerX = event.clientX - windowHalfX;
	targetRotation = targetRotationOnPointerDown + ( pointerX - pointerXOnPointerDown ) * 0.02;
}

function onPointerUp() {
	if ( event.isPrimary === false ) return;
	document.removeEventListener( 'pointermove', onPointerMove );
	document.removeEventListener( 'pointerup', onPointerUp );
}

function animate() {
	requestAnimationFrame( animate );
	render();
}

function render() {
	logoGroup.rotation.x += ( targetRotation - logoGroup.rotation.x ) * 0.05;
	logoGroup.rotation.y += ( targetRotation - logoGroup.rotation.y ) * 0.05;
	renderer.render( scene, camera );

	scene.background = new THREE.Color( settings.background_color );

	buildLogo ();
}
