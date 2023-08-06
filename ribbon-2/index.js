import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';

let container;
let camera, scene, renderer;
let logoGroup;
let shapes = [];

let settings = {
	letter_size : 300,
	tracking : 400,
	corners : 0.75,
	depth : 15,
	current_depth : 0,
	background_color : 0xf0f0f0,
	foreground_color : 0x000000,
	t:true,
	o:false,
	r:false,
	u:false,
	tween: TWEEN.Easing.Quadratic.Out,
	forwards: true,
	speed: 1000
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
			v2[0] + offset, v2[1] + offset, -1*1000,

			v2[0] + offset, v2[1] + offset, -1*1000,
			v1[0] + offset, v1[1] + offset, -1*1000,
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
			v2[0] , v2[1] , -1*1000,

			v2[0] , v2[1] , -1*1000,
			v1[0] , v1[1] , -1*1000,
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
			v2[0] + offset, v2[1] + offset, -1*1000,

			v2[0] + offset, v2[1] + offset, -1*1000,
			v1[0] + offset, v1[1] + offset, -1*1000,
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
			v2[0] + offset, v2[1] + offset, -1*1000,

			v2[0] + offset, v2[1] + offset, -1*1000,
			v1[0] + offset, v1[1] + offset, -1*1000,
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
	animationFolder.add (settings, 'speed' )

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