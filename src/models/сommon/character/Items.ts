import { AbstractMesh, Scene } from '@babylonjs/core'
import { Helpers } from '@/models/Helpers'
import store from '@/store/index'
import { Item, Player } from '@/store/players/types'
import ContainerManager from '@/models/scene/ContainerManager'

export default class Items {
  characterMeshes: AbstractMesh[]
  placeholders: AbstractMesh[]
  playerId: string
  scene: Scene
  
  constructor (playerId: string) {
    this.playerId = playerId
    this.scene = globalThis.scene
    
    const bodyMesh = scene.getMeshById('characterBody_' + this.playerId) as AbstractMesh
    this.characterMeshes = bodyMesh.getChildMeshes()
    this.placeholders = []
    
    this.setPlaceholders()
    this.setItems()
  }
  
  private setPlaceholders () {
    this.characterMeshes.forEach(mesh => {
      if (Helpers.IsName(mesh.id, 'placeholder', true)) {
        mesh.isVisible = false
        this.placeholders.push(mesh)
      }
    })
  }
  
  private setItems () {
    const storePlayer = store.getters.getPlayerById(this.playerId) as Player
    
    storePlayer.items.forEach((item: Item) => {
      const placeholder = this.placeholders.find(placeholder => {
        return Helpers.IsName(placeholder.id, item.type, true)
      })
      
      if (!placeholder) {
        return null
      }
      
      const path = '/resources/graphics/items/'
      const assetContainer = ContainerManager.getContainer(item.flavour + '.gltf', path)
      
      if (!assetContainer) {
        console.error('Container item not load :' + item.flavour)
        return null
      }
      
      // const rootId = '__root__item_' + item.flavour + '_' + this.playerId
      
     /* assetContainer.then((container) => {
        if (!container) {
          return null
        }
        
        const resources = container.instantiateModelsToScene((sourceName) => {
          if (sourceName == '__root__') {
            return rootId
          }
          
          return sourceName + '_' + this.playerId
        })
        
        const rootMesh = resources.rootNodes[0]
        rootMesh.id = rootMesh.name
        
        const meshes = rootMesh.getChildMeshes()
        
        meshes.forEach(mesh => {
          mesh.id = mesh.name
          mesh.isPickable = false
          mesh.checkCollisions = false
        })
        
        if (placeholder) {
          rootMesh.parent = placeholder
        }
      })*/
      
    })
  }
}