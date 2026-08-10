import { Pane } from 'tweakpane'
import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

const pane = new Pane({
  title: 'options'
})

const $canvas = document.getElementById('canvas')

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  dpr: Math.min(2, window.devicePixelRatio)
}
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, .01, 100)
camera.position.z = 10
const controls = new OrbitControls(camera, $canvas)
controls.enableDamping = true

const toneMappingList = {
  None: THREE.NoToneMapping,
  Linear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACESFilmic: THREE.ACESFilmicToneMapping,
  AgX: THREE.AgXToneMapping,
  Neutral: THREE.NeutralToneMapping
}
const toneMapping = {
  value: 'Cineon',
}

const renderer = new THREE.WebGLRenderer({
  canvas: $canvas,
  antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.toneMapping = toneMappingList[toneMapping.value]
pane.addBinding(toneMapping, 'value', {
  label: 'tonemapping',
  options: toneMappingList
}).on('change', () => renderer.toneMapping = toneMapping.value)

renderer.shadowMap.enabled = true

renderer.render(scene, camera)
/**
 * Start
 */

const box = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial()
)


scene.add(box)

/**
 * End
 */

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
})

const tick = () => {

  requestAnimationFrame(tick)
  controls.update()

  renderer.render(scene, camera)
}
tick()
