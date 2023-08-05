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

let controlObject = {
	letter_size : 150,
	logo_width : 800
};

init();
animate();

function init() {

	const uRatio = 0.15;
	const tRatio = 0.4;

	const uCorner = controlObject.letter_size * uRatio
	const tMiddle = controlObject.letter_size * tRatio;

	const tCorner = (controlObject.letter_size - tMiddle) * 0.5;

	container = document.createElement ( 'div' );
	document.body.appendChild ( container );

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xf0f0f0 );

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 0, 0, 800 );
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
		.lineTo (tCorner + tMiddle, 0)
		.lineTo (tCorner + tMiddle, tCorner)
		.lineTo (controlObject.letter_size, tCorner)
		.lineTo (controlObject.letter_size, tCorner + tMiddle)
		.lineTo (tCorner + tMiddle, tCorner + tMiddle)
		.lineTo (tCorner + tMiddle, controlObject.letter_size)
		.lineTo (tCorner, controlObject.letter_size)
		.lineTo (tCorner, tCorner + tMiddle)
		.lineTo (0, tCorner + tMiddle)
		.lineTo (0, tCorner)
		.lineTo (tCorner, tCorner)
		.moveTo (tCorner, 0)

	let tGeometry = new THREE.ShapeGeometry ( tShape );
	let mesh = new THREE.Mesh ( 
		tGeometry, 
		new THREE.MeshPhongMaterial( { side: THREE.DoubleSide, map: texture } ) 
	);

	mesh.position.set ( controlObject.logo_width * -0.5 - controlObject.letter_size*0.5, controlObject.letter_size * -0.5, 0 );
	mesh.rotation.set (0, 0, 0);
	mesh.scale.set ( 1, 1, 1 );

	group.add ( mesh );
	
	const geometry = new THREE.CircleGeometry ( controlObject.letter_size * 0.5, 32 ); 
	const oMesh = new THREE.MeshPhongMaterial( { side: THREE.DoubleSide, map: texture } )
	const oShape = new THREE.Mesh (
		geometry,
		oMesh
	);

	oShape.position.set (controlObject.logo_width * -0.5 + (controlObject.logo_width / 3) , 0, 0);
	group.add( oShape );

	const rSize = controlObject.letter_size;
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

	rMesh.position.set ( controlObject.logo_width * -0.5 + (controlObject.logo_width / 3) * 2  - controlObject.letter_size*0.5, controlObject.letter_size * -0.5, 0 );
	rMesh.rotation.set (0, 0, 0);
	rMesh.scale.set ( 1, 1, 1 );

	group.add ( rMesh );

	const uShape = new THREE.Shape()
		.moveTo (controlObject.letter_size - uCorner * 2, 0)
		.lineTo (uCorner * 2, 0)
		.bezierCurveTo (0, 0, 0, uCorner * 2, 0, uCorner * 2)
		.lineTo (0, controlObject.letter_size)
		.lineTo (controlObject.letter_size, controlObject.letter_size)
		.lineTo (controlObject.letter_size, uCorner * 2)
		.bezierCurveTo (controlObject.letter_size, uCorner*2, controlObject.letter_size, 0, controlObject.letter_size - uCorner * 2, 0)

	let uGeometry = new THREE.ShapeGeometry ( uShape );
	let uMesh = new THREE.Mesh ( 
		uGeometry, 
		new THREE.MeshPhongMaterial( { side: THREE.DoubleSide, map: texture } ) 
	);

	uMesh.position.set ( controlObject.logo_width * -0.5 + (controlObject.logo_width / 3) * 3  - controlObject.letter_size*0.5, controlObject.letter_size * -0.5, 0 );
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
	gui.add (controlObject, 'letter_size', 0, 1000)
	gui.add (controlObject, 'logo_width', 0, 1000)
}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onPointerDown( event ) {

	if ( event.isPrimary === false ) return;

	pointerXOnPointerDown = event.clientX - windowHalfX;
	targetRotationOnPointerDown = targetRotation;

	document.addEventListener( 'pointermove', onPointerMove );
	document.addEventListener( 'pointerup', onPointerUp );

}

function onPointerMove( event ) {

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

