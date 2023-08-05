import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

let container;
let camera, scene, renderer;
let group;
let targetRotation = 0;
let targetRotationOnPointerDown = 0;
let pointerX = 0;
let pointerXOnPointerDown = 0;
let windowHalfX = window.innerWidth / 2;

let settings = {
	letter_size : 150,
	logo_width : 800,
	u_ratio: 0.15,
	t_ratio: 0.4,

};

init ();
animate ();

function init () {

	const u_corner = settings.letter_size * settings.u_ratio
	const t_middle = settings.letter_size * settings.t_ratio;
	const tCorner = (settings.letter_size - t_middle) * 0.5;

	container = document.createElement ( 'div' );
	document.body.appendChild ( container );

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
	scene.add( camera );

	const light = new THREE.PointLight( 0xffffff, 2.5, 0, 0 );
	camera.add( light );

	group = new THREE.Group();
	scene.add( group );

	const loader = new THREE.TextureLoader();
	const texture = loader.load( 'textures/uv_grid_opengl.jpg' );
	texture.colorSpace = THREE.SRGBColorSpace;

	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 0.008, 0.008 );	

	const tShape = new THREE.Shape()
		.moveTo (tCorner, 0)
		.lineTo (tCorner + t_middle, 0)
		.lineTo (tCorner + t_middle, tCorner)
		.lineTo (settings.letter_size, tCorner)
		.lineTo (settings.letter_size, tCorner + t_middle)
		.lineTo (tCorner + t_middle, tCorner + t_middle)
		.lineTo (tCorner + t_middle, settings.letter_size)
		.lineTo (tCorner, settings.letter_size)
		.lineTo (tCorner, tCorner + t_middle)
		.lineTo (0, tCorner + t_middle)
		.lineTo (0, tCorner)
		.lineTo (tCorner, tCorner)
		.moveTo (tCorner, 0)

	let tGeometry = new THREE.ShapeGeometry ( tShape );
	let mesh = new THREE.Mesh ( 
		tGeometry, 
		new THREE.MeshPhongMaterial( { side: THREE.DoubleSide, map: texture } ) 
	);

	mesh.position.set ( settings.logo_width * -0.5 - settings.letter_size*0.5, settings.letter_size * -0.5, 0 );
	mesh.rotation.set (0, 0, 0);
	mesh.scale.set ( 1, 1, 1 );

	group.add ( mesh );
	
	const geometry = new THREE.CircleGeometry ( settings.letter_size * 0.5, 32 ); 
	const oMesh = new THREE.MeshPhongMaterial( { side: THREE.DoubleSide, map: texture } )
	const oShape = new THREE.Mesh (
		geometry,
		oMesh
	);

	oShape.position.set (settings.logo_width * -0.5 + (settings.logo_width / 3) , 0, 0);
	group.add( oShape );

	const rSize = settings.letter_size;
	const rShape = new THREE.Shape()
		.moveTo (0, 0)
		.lineTo (rSize, 0)
		.lineTo (rSize, rSize)
		.lineTo (0, rSize)
		.lineTo (0, 0)

	let rGeometry = new THREE.ShapeGeometry ( rShape );
	let rMesh = new THREE.Mesh ( 
		rGeometry, 
		new THREE.MeshPhongMaterial( { side: THREE.DoubleSide, map: texture } ) 
	);

	rMesh.position.set ( settings.logo_width * -0.5 + (settings.logo_width / 3) * 2  - settings.letter_size*0.5, settings.letter_size * -0.5, 0 );
	rMesh.rotation.set (0, 0, 0);
	rMesh.scale.set ( 1, 1, 1 );

	group.add ( rMesh );

	const uShape = new THREE.Shape()
		.moveTo (settings.letter_size - u_corner * 2, 0)
		.lineTo (u_corner * 2, 0)
		.bezierCurveTo (0, 0, 0, u_corner * 2, 0, u_corner * 2)
		.lineTo (0, settings.letter_size)
		.lineTo (settings.letter_size, settings.letter_size)
		.lineTo (settings.letter_size, u_corner * 2)
		.bezierCurveTo (settings.letter_size, u_corner*2, settings.letter_size, 0, settings.letter_size - u_corner * 2, 0)

	let uGeometry = new THREE.ShapeGeometry ( uShape );
	let uMesh = new THREE.Mesh ( 
		uGeometry, 
		new THREE.MeshPhongMaterial( { side: THREE.DoubleSide, map: texture } ) 
	);

	uMesh.position.set ( settings.logo_width * -0.5 + (settings.logo_width / 3) * 3  - settings.letter_size*0.5, settings.letter_size * -0.5, 0 );
	uMesh.rotation.set (0, 0, 0);
	uMesh.scale.set ( 1, 1, 1 );

	group.add ( uMesh );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	container.style.touchAction = 'none';
	container.addEventListener( 'pointerdown', onPointerDown );

	window.addEventListener( 'resize', onWindowResize );

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
	group.rotation.y += ( targetRotation - group.rotation.y ) * 0.05;
	renderer.render( scene, camera );
}
