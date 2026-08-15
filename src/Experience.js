import * as THREE from 'three'
import Debugger from "./Debugger";
import FirstRaymarching from "./Scene/First";
import LightAndShapes from './Scene/LightAndShapes.js'
import Stats from 'three/examples/jsm/libs/stats.module.js';

const SCENES = {
  first: new FirstRaymarching(),
  light_and_shapes: new LightAndShapes()
}

export default class Experience {
  constructor() {
    this.debugger = new Debugger()

    const name = window.location.hash.slice(1)
    const selected = {
      name: Object.hasOwn(SCENES, name) ? name : 'first'
    }

    const f = this.debugger.debug.addFolder({
      title: 'projects'
    })
    f.addBinding(selected, 'name', {
      options: Object.keys(SCENES).map(e => ({ text: e, value: e }))
    }).on('change', () => {
      this.changePage(selected.name)
    })

    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      dpr: Math.min(2, window.devicePixelRatio)
    }


    this.stats = new Stats()
    document.body.appendChild(this.stats.dom)

    this.setGraphics()
    this.changePage(selected.name)
    this.update()
  }

  setGraphics() {
    this.graphics = {}
    this.graphics.scene = new THREE.Scene()
    this.graphics.scene.background = new THREE.Color(0x000000)
    this.graphics.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    this.graphics.renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('canvas'),
      antialias: true
    })
    this.graphics.renderer.setSize(this.viewport.width, this.viewport.height)
    this.graphics.renderer.setPixelRatio(this.viewport.dpr)
    this.graphics.renderer.render(this.graphics.scene, this.graphics.camera)

    this.timer = new THREE.Timer()
    this.timer.connect(document)
  }

  resize() {

    this.viewport.width = window.innerWidth
    this.viewport.height = window.innerHeight

    this.graphics.camera.updateProjectionMatrix()

    this.graphics.renderer.setSize(this.viewport.width, this.viewport.height)
    this.graphics.renderer.setPixelRatio(this.viewport.dpr)

    this.scene.handleResize()
  }

  update() {
    requestAnimationFrame(() => this.update())
    this.timer.update()
    this.stats.update()

    this.scene.loop()

    this.graphics.renderer.render(this.graphics.scene, this.graphics.camera)

  }

  changePage(name) {
    if (Object.hasOwn(SCENES, name)) {

      if (this.scene) {
        this.scene.handleDispose()
      }

      this.scene = SCENES[name]
      this.scene.scene = this.graphics.scene
      this.scene.timer = this.timer
      this.scene.init()

      document.title = `${this.scene.name}`
      // history.pushState(null, null, '#' + name)
      window.location.hash = name
    }
  }
}
