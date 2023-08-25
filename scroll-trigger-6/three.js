import * as THREE from "three";
import gsap from "gsap";

THREE.ColorManagement.enabled = false;
let settings = {
  letter_size: 150,
  tracking: 200,
  corners: 1,
  depth: 30,
  background_color: 0x000000,
  foreground_color: 0xffffff,
};

/**
 * Debug
 */
const parameters = {
  materialColor: "#EDFE06",
};
let startWobbling = false;

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl-logo");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */

// logo
let logoGroup;
let shapes = [];
function getCircle(radius, offset_x, offset_y, start, end) {
  let segments = 64;
  let theta, x1, y1;
  let theta_next, x2, y2, j;
  let arr = [];

  const start_index = segments * start;
  const end_index = segments * end;

  function getPoints(i) {
    theta = ((i + 1) / segments) * Math.PI * 2.0;
    x1 = radius * Math.cos(theta) + offset_x;
    y1 = radius * Math.sin(theta) + offset_y;
    j = i + 2;
    if (j - 1 === segments) j = 1;
    theta_next = (j / segments) * Math.PI * 2.0;
    x2 = radius * Math.cos(theta_next) + offset_x;
    y2 = radius * Math.sin(theta_next) + offset_y;
    return [x1, y1], [x2, y2];
  }

  if (start < end) {
    for (let i = start_index; i < end_index; i++) {
      arr.push(getPoints(i));
    }
  } else {
    for (let i = start_index - 1; i >= end_index; i--) {
      arr.push(getPoints(i));
    }
  }

  return arr;
}

function getT() {
  const corner_multiplier = 0.4 + 0.6 * (1 - settings.corners);

  const middle = Math.min(
    settings.letter_size * corner_multiplier,
    settings.letter_size
  );
  const corner = Math.max((settings.letter_size - middle) * 0.5, 0);
  const offset = settings.letter_size * -0.5;

  const vertices_2d = [
    [corner, 0],
    [corner + middle, 0],
    [corner + middle, corner],
    [settings.letter_size, corner],
    [settings.letter_size, corner + middle],
    [corner + middle, corner + middle],
    [corner + middle, settings.letter_size],
    [corner, settings.letter_size],
    [corner, corner + middle],
    [0, corner + middle],
    [0, corner],
    [corner, corner],
  ];

  let vertices_3d = [];

  vertices_2d.forEach((v, index) => {
    const v1 = v;
    const v2 = vertices_2d[(index + 1) % vertices_2d.length];

    vertices_3d = vertices_3d.concat([
      v1[0] + offset,
      v1[1] + offset,
      0,
      v2[0] + offset,
      v2[1] + offset,
      0,
      v2[0] + offset,
      v2[1] + offset,
      -1 * settings.depth,

      v2[0] + offset,
      v2[1] + offset,
      -1 * settings.depth,
      v1[0] + offset,
      v1[1] + offset,
      -1 * settings.depth,
      v1[0] + offset,
      v1[1] + offset,
      0,
    ]);
  });

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(vertices_3d), 3)
  );

  let mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      color: settings.foreground_color,
    })
  );
  mesh.scale.set(0.01, 0.01, 0.01);
  return mesh;
}

function getO() {
  let radius = settings.letter_size * 0.5;
  let vertices_2d = getCircle(radius, 0, 0, 0, 1);

  let vertices_3d = [];

  vertices_2d.forEach((v, index) => {
    const v1 = v;
    const v2 = vertices_2d[(index + 1) % vertices_2d.length];

    vertices_3d = vertices_3d.concat([
      v1[0],
      v1[1],
      0,
      v2[0],
      v2[1],
      0,
      v2[0],
      v2[1],
      -1 * settings.depth,

      v2[0],
      v2[1],
      -1 * settings.depth,
      v1[0],
      v1[1],
      -1 * settings.depth,
      v1[0],
      v1[1],
      0,
    ]);
  });

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(vertices_3d), 3)
  );

  let mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      color: settings.foreground_color,
    })
  );
  mesh.scale.set(0.01, 0.01, 0.01);
  return mesh;
}

function getR() {
  const offset = settings.letter_size * -0.5;
  const size = settings.letter_size;

  const vertices_2d = [
    [0, 0],
    [size, 0],
    [size, size],
    [0, size],
    [0, 0],
  ];

  let vertices_3d = [];

  vertices_2d.forEach((v, index) => {
    const v1 = v;
    const v2 = vertices_2d[(index + 1) % vertices_2d.length];

    vertices_3d = vertices_3d.concat([
      v1[0] + offset,
      v1[1] + offset,
      0,
      v2[0] + offset,
      v2[1] + offset,
      0,
      v2[0] + offset,
      v2[1] + offset,
      -1 * settings.depth,

      v2[0] + offset,
      v2[1] + offset,
      -1 * settings.depth,
      v1[0] + offset,
      v1[1] + offset,
      -1 * settings.depth,
      v1[0] + offset,
      v1[1] + offset,
      0,
    ]);
  });

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(vertices_3d), 3)
  );

  let mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      color: settings.foreground_color,
    })
  );
  mesh.scale.set(0.01, 0.01, 0.01);
  return mesh;
}

function getU() {
  const corner_multiplier = settings.corners * 0.5;
  const corner = Math.min(
    settings.letter_size * corner_multiplier,
    settings.letter_size * 0.5
  );
  const offset = settings.letter_size * -0.5;

  let vertices_2d = [
    [0, settings.letter_size],
    [settings.letter_size, settings.letter_size],
    [settings.letter_size, corner],
  ];

  vertices_2d = vertices_2d.concat(
    getCircle(corner, settings.letter_size - corner, corner, 1, 0.75)
  );

  vertices_2d = vertices_2d.concat([[settings.letter_size - corner, 0]]);

  vertices_2d = vertices_2d.concat(
    getCircle(corner, corner, corner, 0.75, 0.5)
  );

  let vertices_3d = [];

  vertices_2d.forEach((v, index) => {
    const v1 = v;
    const v2 = vertices_2d[(index + 1) % vertices_2d.length];

    vertices_3d = vertices_3d.concat([
      v1[0] + offset,
      v1[1] + offset,
      0,
      v2[0] + offset,
      v2[1] + offset,
      0,
      v2[0] + offset,
      v2[1] + offset,
      -1 * settings.depth,

      v2[0] + offset,
      v2[1] + offset,
      -1 * settings.depth,
      v1[0] + offset,
      v1[1] + offset,
      -1 * settings.depth,
      v1[0] + offset,
      v1[1] + offset,
      0,
    ]);
  });

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(vertices_3d), 3)
  );

  let mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      color: settings.foreground_color,
    })
  );
  mesh.scale.set(0.01, 0.01, 0.01);
  return mesh;
}



// Objects
const objectsDistance = 5;

const mesh1 = getT();
const mesh12 = getO();
const mesh13 = getR();
const mesh14 = getU();
const mesh2 = getU();
const mesh3 = getT();

mesh1.position.x = -3;
mesh12.position.x = -1;
mesh13.position.x = 1;
mesh14.position.x = 3;
mesh2.position.x = 4;
mesh3.position.x = 2;

mesh1.position.y = -objectsDistance * 0;
mesh12.position.y = -objectsDistance * 0;
mesh13.position.y = -objectsDistance * 0;
mesh14.position.y = -objectsDistance * 0;
mesh2.position.y = -objectsDistance * 1;
mesh3.position.y = -objectsDistance * 2;

scene.add(mesh1, mesh12, mesh13, mesh14, mesh2, mesh3);

const sectionMeshes = [mesh1, mesh12, mesh13, mesh14, mesh2, mesh3];

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

/**
 * Particles
 */

/**
 * Change colour of each shape
 */
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(-1, -1);
var raycastThreshold = 0.5;

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener("mousemove", onMouseMove, false);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 10;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Scroll
 */
let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;

  const newSection = Math.round(scrollY / sizes.height);
  if(scrollY > 0){
    if (!startWobbling) {
      startWobbling = true; 
  }
  }
  if (newSection != currentSection) {
    currentSection = newSection;



    gsap.to(sectionMeshes[currentSection].rotation, {
      duration: 0.75,
      ease: "power2.inOut",
      x: "+=2",
      y: "+=3",
      z: "+=1.5",
    });
  }
});
console.log(startWobbling);
/**
 * Cursor
 */
const cursor = {};
cursor.x = 0;
cursor.y = 0;

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.9;
  cursor.y = event.clientY / sizes.height - 0.9;
});



/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;
  
  camera.position.y = (-scrollY / sizes.height) * objectsDistance;

  const parallaxX = cursor.x * 0.5;
  const parallaxY = -cursor.y * 0.5;
  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * 8 * deltaTime;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * 8 * deltaTime;

  const wobbleFrequencyX = 0.5;
  const wobbleAmplitudeX = 0.5;

  const wobbleFrequencyY = 0.3;
  const wobbleAmplitudeY = 0.5;
  for (const mesh of sectionMeshes) {
    if (startWobbling) {
    mesh.rotation.x =
      Math.sin(elapsedTime * wobbleFrequencyX) * wobbleAmplitudeX;
    mesh.rotation.y =
      Math.cos(elapsedTime * wobbleFrequencyY) * wobbleAmplitudeY;
    }
  }

  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    intersects[0].object.material.color.set(0x83ddb6);
  } else {
    scene.traverse(function (child) {
      if (child.type == "Mesh") {
        child.material.color.set(0xffffff);
      }
    });
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
