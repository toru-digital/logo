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
let logoTexture
let shapes = [];

let settings = {
	letter_size : 150,
	tracking : 200,
	corners : 0.75,
	depth : 100,
};

buildScene ();
buildLogo ();
buildControls ();
animate ();

function buildScene () {
	container = document.createElement ('div');
	document.body.appendChild (container);

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xf0f0f0 );

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
		new THREE.MeshBasicMaterial ({side: THREE.DoubleSide, color: 0xFF00FF}) 
	);
	
	return mesh
}

function getO () {
	let radius = settings.letter_size * 0.5;
	let segments = 64;
	let theta, x1, y1
	let theta_next, x2, y2, j;
	let vertices_3d = [];

	for (let i = 0; i < segments; i++) {
		theta = ((i + 1) / segments) * Math.PI * 2.0;
		x1 = radius * Math.cos(theta);
		y1 = radius * Math.sin(theta);
		j = i + 2;
		if( (j - 1) === segments ) j = 1;
		theta_next = (j / segments) * Math.PI * 2.0;
		x2 = radius * Math.cos(theta_next);
		y2 = radius * Math.sin(theta_next);

		vertices_3d = vertices_3d.concat ([
			x1, y1, 0,
			x2, y2, 0,
			x2, y2, -1*settings.depth,

			x2, y2, -1*settings.depth,
			x1, y1, -1*settings.depth,
			x1, y1, 0
		])
	}

	const geometry = new THREE.BufferGeometry();
	
	geometry.setAttribute (
		'position', 
		new THREE.BufferAttribute (new Float32Array (vertices_3d), 3) 
	);

	let mesh = new THREE.Mesh ( 
		geometry, 
		new THREE.MeshBasicMaterial ({side: THREE.DoubleSide, color: 0xFF00FF}) 
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
		new THREE.MeshBasicMaterial ({side: THREE.DoubleSide, color: 0xFF00FF}) 
	);
	
	return mesh
}

function buildLogo () {

	shapes.forEach (shape => {
		logoGroup.remove (shape);
	})

	shapes = [ getT (), getO (), getR ()]
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
	gui.add (settings, 'depth', 0, 500)
	
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

	buildLogo ();
}
