import { AbstractMesh, Color4, Mesh, Ray, RayHelper, Scene, Vector3 } from '@babylonjs/core'
import { AdvancedDynamicTexture, Rectangle, TextBlock } from '@babylonjs/gui/2D'
import { Store } from 'vuex'

interface Item {
  id: string;
  mesh: AbstractMesh;
  isFocused: boolean;
  gameObjectId: string;
}

export default class Inventory {
  items: Array<Item>
  scene: Scene
  store: any
  playerId: string
  meshHead: Mesh
  meshFoot: Mesh
  showRay: boolean
  rays: Array<Ray>
  rectLabel: Rectangle
  
  constructor (playerId: string) {
    this.scene = globalThis.scene
    this.store = Store
    this.playerId = playerId
    this.meshHead = this.scene.getMeshById('playerHead_' + this.playerId) as Mesh
    this.meshFoot = this.scene.getMeshById('playerFoot_' + this.playerId) as Mesh
    this.showRay = false
    this.items = []
    this.rays = []
    this.rectLabel = new Rectangle()
    
    this.initItems()
    this.initLabel()
    this.initCastRays()
  }
  
  private initItems () {
    this.store.getState().inventory.contents.forEach(item => {
      const mesh = this.scene.getMeshById(item.mesh_id) as Mesh
      
      if (mesh) {
        mesh.isPickable = true
        mesh.edgesWidth = 4.0
        mesh.edgesColor = new Color4(255, 255, 255, 1)
        mesh.isVisible = !item.lifted
        
        this.items.push({
          id: mesh.id,
          mesh,
          isFocused: false,
          gameObjectId: item.game_object_id
        })
      }
    })
  }
  
  private buildRays () {
    const mesh = this.meshHead
    const cellSize = 0.15
    const areaSize = 0.8
    const countCells = Math.round((areaSize * areaSize) / (cellSize * cellSize))
    let cellStartX = 0 - (cellSize + (cellSize / 2))
    const cellFinishX = cellStartX + areaSize
    let cellY = cellSize + (cellSize / 2)
    
    let i = 0
    while (i < countCells) {
      const rayX = cellStartX + (cellSize / 2)
      const rayY = cellY - (areaSize / 2)
      
      const length = 2
      const ray = new Ray(Vector3.Zero(), Vector3.Zero())
      const rayHelper = new RayHelper(ray)
      rayHelper.attachToMesh(mesh, new Vector3(rayX, rayY, length), Vector3.Zero(), length)
      
      if (this.showRay) {
        rayHelper.show(this.scene)
      }
      
      cellStartX += cellSize
      if (cellFinishX < cellStartX + cellSize) {
        cellStartX = 0 - (cellSize + (cellSize / 2))
        cellY += cellSize
      }
      
      this.rays.push(ray)
      
      i++
    }
  }
  
  private castRay (ray: Ray) {
    const hit = this.scene.pickWithRay(ray)
    this.unfocusedAll()
    this.hideLabel()
    
    if (hit && hit.pickedMesh) {
      this.focused(hit.pickedMesh.id)
      return true
    }
    
    return false
  }
  
  private castRays () {
    this.rays.every(ray => {
      return !this.castRay(ray)
    })
  }
  
  private focused (meshId: string) {
    const item = this.items.find(item => item.id === meshId)
    
    if (item && !item.isFocused) {
      this.unfocusedAll()
      item.isFocused = true
      item.mesh.enableEdgesRendering()
      this.showLabel(item)
    }
  }
  
  private unfocusedAll () {
    this.items.filter(item => item.isFocused).forEach(item => {
      item.isFocused = false
      item.mesh.disableEdgesRendering()
    })
  }
  
  private initLabel () {
    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI')
    
    this.rectLabel.width = 0.1
    this.rectLabel.height = '40px'
    this.rectLabel.cornerRadius = 20
    this.rectLabel.color = 'Orange'
    this.rectLabel.thickness = 2
    this.rectLabel.background = 'green'
    advancedTexture.addControl(this.rectLabel)
    
    const label = new TextBlock()
    label.text = 'Take (E)'
    this.rectLabel.addControl(label)
    
    this.rectLabel.linkOffsetY = -50
    this.rectLabel.isVisible = false
  }
  
  private showLabel (item: Item) {
    this.rectLabel.linkWithMesh(item.mesh)
    this.rectLabel.isVisible = true
  }
  
  private hideLabel () {
    this.rectLabel.isVisible = false
  }
  
  private initCastRays () {
    this.buildRays()
    
    setInterval(() => {
      this.castRays()
    }, 80)
  }
}
