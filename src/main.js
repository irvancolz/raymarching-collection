import { Pane } from 'tweakpane'
import './style.css'
import * as THREE from 'three'
import fragmentShader from './Shaders/fragment.glsl'

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
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

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

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.ShaderMaterial({
    fragmentShader: fragmentShader,
    uniforms: {
      uTime: new THREE.Uniform(0)
    }
  })
)


scene.add(plane)

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

const timer = new THREE.Timer()
timer.connect(window.document)

const tick = () => {

  requestAnimationFrame(tick)
  timer.update()

  plane.material.uniforms.uTime.value = timer.getElapsed()

  renderer.render(scene, camera)
}
tick()
