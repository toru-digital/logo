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

let settings = {
	letter_size : 150,
	logo_width : 800,
	u_ratio: 0.15,
	t_ratio: 0.4,
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

	camera = new THREE.PerspectiveCamera
	(
		50, 
		window.innerWidth / window.innerHeight, 
		1,
		4000 
	);

	camera.position.set (0, 0, 1200);
	scene.add (camera);

	const light = new THREE.PointLight (0xffffff, 2.5, 0, 0);
	camera.add (light);

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	container.style.touchAction = 'none';
	container.addEventListener( 'pointerdown', onPointerDown );

	window.addEventListener( 'resize', onWindowResize );

	logoGroup = new THREE.Group ();
	scene.add (logoGroup);

	const loader = new THREE.TextureLoader ();
	logoTexture = loader.load ('textures/uv_grid_opengl.jpg');
	logoTexture.colorSpace = THREE.SRGBColorSpace;

	logoTexture.wrapS = logoTexture.wrapT = THREE.RepeatWrapping;
	logoTexture.repeat.set( 0.008, 0.008 );	
}

function getT () {
	const middle = settings.letter_size * settings.t_ratio;
	const corner = (settings.letter_size - middle) * 0.5;

	const shape = new THREE.Shape()
		.moveTo (corner, 0)
		.lineTo (corner + middle, 0)
		.lineTo (corner + middle, corner)
		.lineTo (settings.letter_size, corner)
		.lineTo (settings.letter_size, corner + middle)
		.lineTo (corner + middle, corner + middle)
		.lineTo (corner + middle, settings.letter_size)
		.lineTo (corner, settings.letter_size)
		.lineTo (corner, corner + middle)
		.lineTo (0, corner + middle)
		.lineTo (0, corner)
		.lineTo (corner, corner)
		.moveTo (corner, 0)
	
	let geometry = new THREE.ShapeGeometry (shape);
	let mesh = new THREE.Mesh ( 
		geometry, 
		new THREE.MeshPhongMaterial ({side: THREE.DoubleSide, map: logoTexture}) 
	);

	return mesh
}

function getO () {
	const geometry = new THREE.CircleGeometry ( settings.letter_size * 0.5, 32 ); 
	const mesh = new THREE.MeshPhongMaterial( { side: THREE.DoubleSide, map: logoTexture } )
	const shape = new THREE.Mesh (
		geometry,
		mesh
	);

	return shape
}

function getR () {
	const size = settings.letter_size;
	const shape = new THREE.Shape()
		.moveTo (0, 0)
		.lineTo (size, 0)
		.lineTo (size, size)
		.lineTo (0, size)
		.lineTo (0, 0)

	let rGeometry = new THREE.ShapeGeometry ( shape );
	let mesh = new THREE.Mesh ( 
		rGeometry, 
		new THREE.MeshPhongMaterial( { side: THREE.DoubleSide, map: logoTexture } ) 
	);
	return mesh
}

function getU () {
	const corner = settings.letter_size * settings.u_ratio

	const shape = new THREE.Shape()
		.moveTo (settings.letter_size - corner * 2, 0)
		.lineTo (corner * 2, 0)
		.bezierCurveTo (0, 0, 0, corner * 2, 0, corner * 2)
		.lineTo (0, settings.letter_size)
		.lineTo (settings.letter_size, settings.letter_size)
		.lineTo (settings.letter_size, corner * 2)
		.bezierCurveTo (settings.letter_size, corner*2, settings.letter_size, 0, settings.letter_size - corner * 2, 0)

	let geometry = new THREE.ShapeGeometry ( shape );
	let mesh = new THREE.Mesh ( 
		geometry, 
		new THREE.MeshPhongMaterial( { side: THREE.DoubleSide, map: logoTexture } ) 
	);

	return mesh
}

function buildLogo () {

	const t = getT ();
	t.position.set (
		settings.logo_width * -0.5 - settings.letter_size * 0.5,
		settings.letter_size * -0.5, 
		0
	);
	logoGroup.add (t);

	const o = getO ();
	o.position.set (
		settings.logo_width * -0.5 + (settings.logo_width / 3) , 
		0, 
		0
	);
	logoGroup.add (o);

	const r = getR ();
	r.position.set (
		settings.logo_width * -0.5 + (settings.logo_width / 3) * 2  - settings.letter_size*0.5,
		settings.letter_size * -0.5, 
		0 
	);
	logoGroup.add (r);

	const u = getU ();
	u.position.set (
		settings.logo_width * -0.5 + (settings.logo_width / 3) * 3  - settings.letter_size*0.5,
		settings.letter_size * -0.5,
		0 
	);
	logoGroup.add (u);
}

function buildControls () {
	const gui = new GUI()
	gui.add (settings, 'letter_size', 0, 1000)
	gui.add (settings, 'logo_width', 0, 1000)
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
	logoGroup.rotation.y += ( targetRotation - logoGroup.rotation.y ) * 0.05;
	renderer.render( scene, camera );

	buildLogo ();
}
