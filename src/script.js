import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'


/**
 * Cursor
 */
const cursor = {}

cursor.x = 0
cursor.y = 0

const cursorSvg = document.getElementById("cursorsvg")

window.addEventListener('mousemove', (event) =>
{
    cursorSvg.style.top = event.clientY - 40;
    cursorSvg.style.left = event.clientX - 45;

    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})


// Load Textures
const loader = new THREE.TextureLoader()
const height = loader.load('./img/Heightmap.png')
const texture = loader.load('./img/texture.jpeg')
const alpha = loader.load('./img/alpha.png')

// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const planeGeo = new THREE.PlaneBufferGeometry(3, 3, 64, 64)

// Materials
const material = new THREE.MeshStandardMaterial({
    color: 'gray',
    map: texture,
    displacementMap: height,
    displacementScale: 0.6,
    alphaMap: alpha,
    transparent: true,
    depthTest: false
})


// Mesh
const objectsDistance = 1
const plane = new THREE.Mesh(planeGeo, material)
scene.add(plane)

plane.rotation.x = 181
plane.position.x -= 0.01;
plane.position.y -= 0.50;
plane.position.z = 1

// gui.add(plane.rotation, 'x', 0, 360, 0.5)


// Lights

const pointLight = new THREE.PointLight(0x000000, 1.5)
pointLight.position.x = 0.2
pointLight.position.y = 10
pointLight.position.z = 4
scene.add(pointLight)

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
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 4
cameraGroup.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

document.addEventListener('mousemove', animateTerrain)

let mouseY = 0

function animateTerrain(event) {
    mouseY = event.clientY
}

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

    // Update objects
    plane.rotation.z = .1 * elapsedTime
    plane.material.displacementScale = .3 + mouseY * 0.0001

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
