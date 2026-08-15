import './style.css'

const $canvas = document.getElementById('canvas')

import Experience from './Experience'
const experience = new Experience($canvas)

window.addEventListener('resize', () => {
  experience.resize()
})

window.addEventListener('hashchange', () => {
  experience.changePage(window.location.hash.slice(1))
})
