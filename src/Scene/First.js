import Scene from "../Scene";
import * as THREE from 'three'
import fragmentShader from '../Shaders/fragment.glsl'

export default class FirstRaymarching extends Scene {
  constructor() {
    super()
    this.name = 'first ray'
  }

  setWorld() {
    this.plane = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        fragmentShader: fragmentShader,
        uniforms: {
          uTime: new THREE.Uniform(0),
          uResolution: new THREE.Uniform(new THREE.Vector2(
            this.viewport.width * this.viewport.dpr,
            this.viewport.height * this.viewport.dpr
          ))
        }
      })
    )
    this.scene.add(this.plane)
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
  }
}
