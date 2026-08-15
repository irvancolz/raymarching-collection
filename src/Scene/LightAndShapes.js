import Scene from "../Scene";
import * as THREE from 'three'
import fragmentShader from '../Shaders/blob/grouping-1.glsl'

export default class LigthAndShapes extends Scene {
  constructor() {
    super()
    this.name = 'light and shapes'
  }

  setWorld() {
    const cursorNDC = new THREE.Vector2()
    window.addEventListener('pointermove', e => {
      const x = (e.clientX / this.viewport.width) * 2 - 1;
      const y = -(e.clientY / this.viewport.height) * 2 + 1;
      cursorNDC.set(x, y)
    })

    this.lights = {
      ambient: {
        color: '#f9b6ff',
        intensity: .7
      },
      diffuse: [
        {
          color: '#00a7ff',
          intensity: .9
        }, {
          color: '#ffc400',
          intensity: .3
        },
      ]
    }
    this.bgGradient = [
      {
        color: '#ffc400',
        stop: .0
      },
      {
        color: '#f9b6ff',
        stop: .54
      },
      {
        color: '#00a7ff',
        stop: .7
      },
    ]

    this.plane = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        fragmentShader: fragmentShader,
        uniforms: {
          uTime: new THREE.Uniform(0),
          uResolution: new THREE.Uniform(new THREE.Vector2(
            this.viewport.width * this.viewport.dpr,
            this.viewport.height * this.viewport.dpr
          )),
          uCursor: new THREE.Uniform(cursorNDC),
          uStickRadius: new THREE.Uniform(.8),
          uCursorRadius: new THREE.Uniform(.3),
          uCursorMix: new THREE.Uniform(.5),

          ambientLights: new THREE.Uniform({
            color: new THREE.Color(this.lights.ambient.color),
            intensity: this.lights.ambient.intensity
          }),
          diffuseLights: new THREE.Uniform(this.lights.diffuse.map(light => ({
            color: new THREE.Color(light.color),
            intensity: light.intensity
          }))),

          backgroundGradients: new THREE.Uniform(this.bgGradient.map(col => ({
            color: new THREE.Color(col.color),
            stop: col.stop
          }))),
        },
        defines: {
          NUM_DIFFUSE_LIGHTS: 2,
        }
      })
    )
    this.scene.add(this.plane)
  }

  setDebug() {
    // const stickDebug = pane.addFolder({ title: 'stick' })
    // stickDebug.addBinding(plane.material.uniforms.uStickRadius, 'value', {
    //   min: .1,
    //   max: 1,
    //   step: .01,
    //   label: 'width'
    // })
    //
    this.tweaks = []

    const cursorDebug = this.debug.addFolder('cursor')
    cursorDebug.addBinding(this.plane.material.uniforms.uCursorRadius, 'value', {
      min: .1,
      max: 1,
      step: .01,
      label: 'radius'
    })
    cursorDebug.addBinding(this.plane.material.uniforms.uCursorMix, 'value', {
      min: .01,
      max: 1,
      step: .01,
      label: 'mix'
    })

    const lightsDebug = this.debug.addFolder('lights')
    const ambient = lightsDebug.addFolder({ title: 'ambient' })
    ambient.addBinding(this.lights.ambient, 'color').on('change', () => {
      this.plane.material.uniforms.ambientLights.value.color.set(lights.ambient.color)
    })
    ambient.addBinding(this.plane.material.uniforms.ambientLights.value, 'intensity', { min: .01, max: 1, step: .01 })

    this.lights.diffuse.forEach((light, i) => {
      const f = lightsDebug.addFolder({ title: `diffuse - ${i + 1}` })
      this.tweaks.push(f)

      f.addBinding(light, 'color').on('change', () => {
        this.plane.material.uniforms.diffuseLights.value[i].color.set(light.color)
      })
      f.addBinding(this.plane.material.uniforms.diffuseLights.value[i], 'intensity', { min: .01, max: 1, step: .01 })
    })

    const bgDebug = this.debug.addFolder('background')
    this.bgGradient.forEach((color, i) => {
      const f = bgDebug.addFolder({ title: `color - ${i + 1}` })
      this.tweaks.push(f)

      f.addBinding(color, 'color').on('change', () => {
        this.plane.material.uniforms.backgroundGradients.value[i].color.set(color.color)
      })
      f.addBinding(this.plane.material.uniforms.backgroundGradients.value[i], 'stop', {
        min: i == 0 ? 0.01 : this.bgGradient[i - 1].stop,
        max: i >= this.bgGradient.length - 1 ? 1 : this.bgGradient[i + 1].stop,
        step: .01
      })
    })

  }

  resize() {
    this.plane.material.uniforms.uResolution.value.set(this.viewport.width * this.viewport.dpr, this.viewport.height * this.viewport.dpr)
  }

  loop() {
    this.plane.material.uniforms.uTime.value = this.timer.getElapsed()
  }

  dispose() {
    this.scene.remove(this.plane)
    this.plane.material.dispose()
    this.plane.geometry.dispose()

    this.tweaks.forEach(t => t.dispose())
    this.tweaks.length = 0
  }
}
