// https://discourse.threejs.org/t/how-to-do-text-mask-and-used-three-js-component-as-a-background/49594/3
import * as THREE from "three";
import { TWEEN } from '../tween.module.min';
// console.clear();

let settings = {
	time: { value: 0 },
	mask: { value: getMask()},
	color_1 : '0.0',
	color_2: '0.0',
	color_3: '0.0',
	color_4: '1.8',
	color_5: '0.5',
	color_6: '1.0'
};

let scene = new THREE.Mesh(
	new THREE.PlaneGeometry(2, 2),
	new THREE.MeshBasicMaterial({
		onBeforeCompile: shader => {
			shader.uniforms.time = settings.time;
			shader.uniforms.mask = settings.mask;
			shader.fragmentShader = `
			uniform float time;
			uniform sampler2D mask;
			mat2 rot(float a){
				float c = cos(a);
				float s = sin(a);
				return mat2(c, -s, s ,c);
			}
			
			// https://www.shadertoy.com/view/4dsSzr
			float square(float s) { return s * s; }
			vec3 square(vec3 s) { return s * s; }
			vec3 neonGradient(float t) {
				return clamp(
					vec3(
						square(abs(` + settings.color_3 + ` - t) * ` + settings.color_4 + `),
						square(abs(` + settings.color_3 + ` - t) * ` + settings.color_4 + `),
						t * ` + settings.color_1 + ` + ` + settings.color_2 + `
					), 
					0.0, 
					1.0
				);
			}

			${noise}
			${shader.fragmentShader}
			`.replace(
			`#include <color_fragment>`,
			`#include <color_fragment>
			
			float mask = texture(mask, vUv).g;
			vec2 uvShift = vec2(0, 1) * (mask * 0.1);
			vec2 uvRot = rot(mask * PI2 + time) * uvShift;
			
			vec2 colorUV = ((vUv + vec2(time, 0.)) + uvRot) * vec2(1, 3);
			float n = snoise(vec3(colorUV, time));
			n = clamp(n * 0.5 + 0.5, 0., 1.);
			n = smoothstep(0.2, 0.8, n);
			vec3 col = neonGradient(n);
			diffuseColor.rgb = col;
			`
			);
			//console.log(shader.fragmentShader)
		}/**/
	})
);
scene.material.defines = {"USE_UV": ""};
let camera = new THREE.Camera();
let renderer = new THREE.WebGLRenderer({
	antialias: true
});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0x404040);
document.body.appendChild(renderer.domElement);

let clock = new THREE.Clock();

renderer.setAnimationLoop((_) => {
	let t = clock.getElapsedTime();
	settings.time.value = t * 0.05;
	renderer.render(scene, camera);
});

function getT () {
	const letter_size = 320;
	const corners = 0.75;
	const depth = 1000;

	const corner_multiplier = 0.4 + 0.6 * (1-corners);

	const middle = Math.min (letter_size * corner_multiplier, letter_size);
	const corner = Math.max ((letter_size - middle) * 0.5, 0);
	const offset = letter_size * -0.5;

	const vertices_2d = [
		[corner, 0],
		[corner + middle,  0],
		[corner + middle, corner],
		[letter_size, corner],
		[letter_size, corner + middle],
		[corner + middle, corner + middle],
		[corner + middle, letter_size],
		[corner, letter_size],
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
			v2[0] + offset, v2[1] + offset, -1*depth,

			v2[0] + offset, v2[1] + offset, -1*depth,
			v1[0] + offset, v1[1] + offset, -1*depth,
			v1[0] + offset, v1[1] + offset, 0
		])
	})
}

function getMask(){
	let c = document.createElement("canvas");
	c.width = window.innerWidth;
	c.height = window.innerHeight;
	let ctx = c.getContext("2d");
	for(let i = 0; i < 1; i++){
		let val = Math.floor(Math.random() * 255);
		let color = `rgb(${val}, ${val}, ${val})`;
		let size = Math.floor(Math.random() * 5) * 50;
		ctx.save();
		ctx.translate(Math.floor(Math.random() * c.width), Math.floor(Math.random() * c.height));
		ctx.rotate(Math.random() * Math.PI * 2);
		ctx.fillStyle = color;
		ctx.fillRect(-size * 0.5, -size * 0.5, size, size);
		ctx.restore();
	}

	// getT ();
	let tex = new THREE.CanvasTexture(c);
	return tex;
}

function buildControls () {
}

buildControls ()