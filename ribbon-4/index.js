// https://discourse.threejs.org/t/how-to-do-text-mask-and-used-three-js-component-as-a-background/49594/3
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import * as THREE from "three";

console.clear();

let gu = {
	time: { value: 0 },
	mask: { value: getMask()},
	color_1 : '0.0',
	color_2: '0.0',
	color_3: '0.0',
	color_4: '1.8',
	color_5: '0.5',
	color_6: '1.0',
};

let scene = new THREE.Mesh(
	new THREE.PlaneGeometry(2, 2),
	new THREE.MeshBasicMaterial({
		//map: gu.mask.value,
		onBeforeCompile: shader => {
			shader.uniforms.time = gu.time;
			shader.uniforms.mask = gu.mask;
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
						t * ` + gu.color_1 + ` + ` + gu.color_2 + `, 
						square(abs(` + gu.color_3 + ` - t) * ` + gu.color_4 + `), 
						(` + gu.color_5 + ` - t) * ` + gu.color_6 + `
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
renderer.setSize(1024, 512);
renderer.setClearColor(0x404040);
document.body.appendChild(renderer.domElement);

let clock = new THREE.Clock();

renderer.setAnimationLoop((_) => {
	let t = clock.getElapsedTime();
	gu.time.value = t * 0.05;
	renderer.render(scene, camera);
});

function getMask(){
	let c = document.createElement("canvas");
	c.width = 1024;
	c.height = 512;
	let ctx = c.getContext("2d");
	for(let i = 0; i < 50; i++){
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
	let tex = new THREE.CanvasTexture(c);
	return tex;
}

function buildControls () {
	const gui = new GUI()

	const colorsFolder = gui.addFolder ('Colours')

	colorsFolder.add (gu, 'color_1', 0, 5)
}

buildControls ()