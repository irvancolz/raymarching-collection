import * as THREE from 'three'
import Debugger from './Debugger'

export default class Scene {
  constructor() {
    this.name = 'scene'

    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      dpr: Math.min(2, window.devicePixelRatio)
    }
    this.scene = null
    this.debug = new Debugger()
  }


  setWorld() {
    // everything should be here
    this.plane = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial()
    )
    this.scene.add(this.plane)
  }

  setDebug() {

  }

  init() {
    this.setWorld()
    this.setDebug()
    this.update()

  }

  loop() {
    // custom loop
  }

  update() {
    this.loop()
  }

  resize() {

  }

  handleResize() {
    this.viewport.width = window.innerWidth
    this.viewport.height = window.innerHeight
    this.resize()
  }

  dispose() {
    this.scene.remove(this.plane)
    this.plane.material.dispose()
    this.plane.geometry.dispose()

  }

  handleDispose() {
    this.dispose()
    this.debug.clear()
  }

}
