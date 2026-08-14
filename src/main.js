import { Pane } from 'tweakpane'
import './style.css'
import * as THREE from 'three'
import fragmentShader from './Shaders/blob/grouping-1.glsl'

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


const cursorNDC = new THREE.Vector2()
window.addEventListener('pointermove', e => {
  const x = (e.clientX / sizes.width) * 2 - 1;
  const y = -(e.clientY / sizes.height) * 2 + 1;
  cursorNDC.set(x, y)
})

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
renderer.setPixelRatio(sizes.dpr)

renderer.toneMapping = toneMappingList[toneMapping.value]
// pane.addBinding(toneMapping, 'value', {
//   label: 'tonemapping',
//   options: toneMappingList
// }).on('change', () => renderer.toneMapping = toneMapping.value)
//
renderer.shadowMap.enabled = true

renderer.render(scene, camera)
/**
 * Start
 */
const lights = {
  ambient: {
    color: '#ff0000',
    intensity: .1
  },
  diffuse: [
    {
      color: '#0000ff',
      intensity: .9
    }, {
      color: '#ffffff',
      intensity: .3
    },
  ]
}
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.ShaderMaterial({
    fragmentShader: fragmentShader,
    uniforms: {
      uTime: new THREE.Uniform(0),
      uResolution: new THREE.Uniform(new THREE.Vector2(sizes.width * sizes.dpr, sizes.height * sizes.dpr)),
      uCursor: new THREE.Uniform(cursorNDC),
      uStickRadius: new THREE.Uniform(.8),
      uCursorRadius: new THREE.Uniform(.3),
      uCursorMix: new THREE.Uniform(.5),

      ambientLights: new THREE.Uniform({
        color: new THREE.Color(lights.ambient.color),
        intensity: lights.ambient.intensity
      }),
      diffuseLights: new THREE.Uniform(lights.diffuse.map(light => ({
        color: new THREE.Color(light.color),
        intensity: light.intensity
      })))
    },
    defines: {
      NUM_DIFFUSE_LIGHTS: 2,
    }
  })
)
scene.add(plane)

const stickDebug = pane.addFolder({ title: 'stick' })
stickDebug.addBinding(plane.material.uniforms.uStickRadius, 'value', {
  min: .1,
  max: 1,
  step: .01,
  label: 'width'
})

const cursorDebug = pane.addFolder({
  title: 'cursor',
})
cursorDebug.addBinding(plane.material.uniforms.uCursorRadius, 'value', {
  min: .1,
  max: 1,
  step: .01,
  label: 'radius'
})
cursorDebug.addBinding(plane.material.uniforms.uCursorMix, 'value', {
  min: .01,
  max: 1,
  step: .01,
  label: 'mix'
})

const lightsDebug = pane.addFolder({
  title: 'lights'
})
const ambient = lightsDebug.addFolder({ title: 'ambient' })
ambient.addBinding(lights.ambient, 'color').on('change', () => {
  plane.material.uniforms.ambientLights.value.color.set(lights.ambient.color)
})
ambient.addBinding(plane.material.uniforms.ambientLights.value, 'intensity', { min: .01, max: 1, step: .01 })

lights.diffuse.forEach((light, i) => {
  const f = lightsDebug.addFolder({ title: `diffuse - ${i + 1}` })
  f.addBinding(light, 'color').on('change', () => {
    plane.material.uniforms.diffuseLights.value[i].color.set(light.color)
  })
  f.addBinding(plane.material.uniforms.diffuseLights.value[i], 'intensity', { min: .01, max: 1, step: .01 })
})

/**
 * End
 */

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  sizes.dpr = Math.min(2, window.devicePixelRatio)

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  plane.material.uniforms.uResolution.value.copy(new THREE.Vector2(sizes.width * sizes.dpr, sizes.height * sizes.dpr))

  renderer.setPixelRatio(sizes.dpr)
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
