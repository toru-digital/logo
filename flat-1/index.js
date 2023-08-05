import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { SVGRenderer } from 'three/addons/renderers/SVGRenderer.js';

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
	corners : 0.75
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
	// const corner_multiplier = settings.corners * -1 // explore this
	// const corner_multiplier = Math.max ((settings.corners * 1.1) - 0.1, 0) // and this
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
	
	let geometry = new THREE.ShapeGeometry (shape);
	let mesh = new THREE.Mesh ( 
		geometry, 
		new THREE.MeshPhongMaterial ({side: THREE.DoubleSide, map: logoTexture}) 
	);

	return mesh
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

	let geometry = new THREE.ShapeGeometry (shape);
	let mesh = new THREE.Mesh ( 
		geometry, 
		new THREE.MeshPhongMaterial( { side: THREE.DoubleSide, map: logoTexture } ) 
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

	let geometry = new THREE.ShapeGeometry (shape);
	let mesh = new THREE.Mesh ( 
		geometry, 
		new THREE.MeshPhongMaterial( { side: THREE.DoubleSide, map: logoTexture } ) 
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

	let geometry = new THREE.ShapeGeometry ( shape );
	let mesh = new THREE.Mesh ( 
		geometry, 
		new THREE.MeshPhongMaterial( { side: THREE.DoubleSide, map: logoTexture } ) 
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
	gui.add (settings, 'letter_size', 0, 400)
	gui.add (settings, 'tracking', 0, 600)
	gui.add (settings, 'corners', 0, 1)
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

window.btnSVGExportClick = function () {
	function ExportToSVG(rendererSVG, filename) {
		var XMLS = new XMLSerializer();
		var svgfile = XMLS.serializeToString(rendererSVG.domElement);
		var svgData = svgfile;
		var preface = '<?xml version="1.0" standalone="no"?>\r\n';
		var svgBlob = new Blob([preface, svgData], {
		  type: "image/svg+xml;charset=utf-8"
		});
		var svgUrl = URL.createObjectURL(svgBlob);
		var downloadLink = document.createElement("a");
		
		downloadLink.href = svgUrl;
		downloadLink.download = filename;
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
	 }
	 
	var rendererSVG = new SVGRenderer();
	
	rendererSVG.setSize(window.innerWidth, window.innerHeight);
	rendererSVG.render(scene, camera);
	ExportToSVG(rendererSVG, "logo.svg");
 }
 
