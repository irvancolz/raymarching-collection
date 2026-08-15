import { Pane } from "tweakpane"


export default class Debugger {
  static instance = null
  constructor() {

    if (Debugger.instance != null) {
      return Debugger.instance
    }
    Debugger.instance = this

    this.debug = new Pane({ title: 'options' })
    this.folders = []
  }

  addFolder(name = 'folder', expanded = false) {
    const folder = this.debug.addFolder({
      title: name,
      expanded: expanded
    })
    this.folders.push(folder)

    return folder
  }

  clear() {
    this.folders.forEach(f => f.dispose())
    this.folders.length = 0
  }
}
