import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import CANNON from 'cannon'

THREE.ColorManagement.enabled = false

/**
 * Settings
 */
let settings = {
    letter_size: 150,
    tracking: 200,
    corners: 0.75,
    depth: 100,
    background_color: 0x0000,
    foreground_color: 0xffffff,
  };

/**
 * Debug
 */
const gui = new dat.GUI()
const debugObject = {}

debugObject.createSphere = () =>
{
    createSphere(
        Math.random() * 0.5,
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3
        }
    )


}

gui.add(debugObject, 'createSphere')




/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/**
 * Physics
 * THis is needed to create the physics world
 */
const world = new CANNON.World()
world.gravity.set(0, - 9.82, 0)


// materaials for physics world, this is needed to make the objects interact with each other
const defaultMaterial = new CANNON.Material('default')

const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 1.0,
        restitution: 0.9
    }
)

world.addContactMaterial( defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial




// physics floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0  // this can be ommitted since it is the default value
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5) // this is done since the default rotation is straight
world.addBody(floorBody)




/**
 * Test sphere
 */


/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 4)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(- 3, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Utils
 */
const objectsToUpdate = []

const createLetter = (position) =>
{

    // Three.js mesh
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

//   let mesh = new THREE.Mesh(
//     geometry,
//     new THREE.MeshBasicMaterial({
//       side: THREE.DoubleSide,
//       color: settings.foreground_color,
//     })
//   );

  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)

    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)


    // Cannon.js body
    const shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1))
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0,3,0),
        shape,
        material: defaultMaterial
    })

    body.position.copy(position)
    world.addBody(body)

    objectsToUpdate.push({
        mesh,
        body
    })
}

createLetter({ x: 0, y: 3, z: 0 })

const createSphere = (radius, position) =>
{

    // Three.js mesh
    const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 20, 20),
        new THREE.MeshStandardMaterial({
            metalness: 0.3,
            roughness: 0.4,
            envMap: environmentMapTexture,
            envMapIntensity: 0.5
        })
    )
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)


    // Cannon.js body
    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0,3,0),
        shape,
        material: defaultMaterial
    })

    body.position.copy(position)
    world.addBody(body)

    // save in objects array
    objectsToUpdate.push({
        mesh,
        body
    })
} 

createSphere(0.5, { x: 0, y: 3, z: 0 })

/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    // physics
    world.step(1/60, deltaTime, 3)


    // To display the objects in the scene 
    for(const object of objectsToUpdate){
        object.mesh.position.copy(object.body.position)
    }


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()