import * as THREE from 'three'
import gsap from 'gsap'

THREE.ColorManagement.enabled = false
let settings = {
    letter_size: 150,
    tracking: 200,
    corners: 1,
    depth: 50,
    background_color: 0x000000,
    foreground_color: 0xffffff,
  };


/**
 * Debug
 */
const parameters = {
    materialColor: '#EDFE06'
}


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl-logo')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */

// Texture
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('static/textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter

// Material
const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture,
    side: THREE.DoubleSide
})

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
  
    return mesh;
  }
  
  function buildLogo() {
    shapes.forEach((shape) => {
      logoGroup.remove(shape);
    });
  
    shapes = [getT(), getO(), getR(), getU()];
    const x_start = (shapes.length - 1) * settings.tracking * -0.5;
  
    shapes.forEach((shape, index) => {
      shape.position.set(x_start + index * settings.tracking, 0, 0);
      logoGroup.add(shape);
    });
  }



// Objects
const objectsDistance = 5

const mesh1 = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1, 0),
    material
)
const mesh2 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)



mesh1.position.x = 2
mesh2.position.x = - 2
mesh3.position.x = 2

mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2


scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [mesh1, mesh2, mesh3 ]

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

/**
 * Particles
 */
// Geometry
// const particlesCount = 200
// const positions = new Float32Array(particlesCount * 3)

// for(let i = 0; i < particlesCount; i++)
// {
//     positions[i * 3 + 0] = (Math.random() - 0.5) * 10
//     positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
//     positions[i * 3 + 2] = (Math.random() - 0.5) * 10
// }

// const particlesGeometry = new THREE.BufferGeometry()
// particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: textureLoader,
    size: 0.03
})

// Points
// const particles = new THREE.Points(particlesGeometry, particlesMaterial)
// scene.add(particles)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 10
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () =>
{
    scrollY = window.scrollY
    const newSection = Math.round(scrollY / sizes.height)

    if(newSection != currentSection)
    {
        currentSection = newSection

        gsap.to(
            sectionMeshes[currentSection].rotation,
            {
                duration: .75,
                ease: 'power2.inOut',
                x: '+=2',
                y: '+=3',
                z: '+=1.5'
            }
        )
    }
})

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.9
    cursor.y = event.clientY / sizes.height - 0.9
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Animate camera
    camera.position.y = - scrollY / sizes.height * objectsDistance

    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    // Animate meshes
    for(const mesh of sectionMeshes)
    {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()