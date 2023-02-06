import { AbstractMesh, SceneLoader } from '@babylonjs/core'
import { Helpers } from '@/models/Helpers'
import store from '@/store/index'
import { Item, Player } from '@/store/players/types'

interface Placeholder {
  name: string;
  mesh: AbstractMesh;
}

export default class Items {
  characterMeshes: AbstractMesh[]
  placeholders: Array<Placeholder>
  playerId: string
  
  constructor (playerId: string, characterMeshes: AbstractMesh[]) {
    this.playerId = playerId
    this.characterMeshes = characterMeshes
    this.placeholders = []
    
    this.setPlaceholders()
    this.setItems()
  }
  
  setPlaceholders () {
    Helpers.getMeshesByName('placeholder', true).forEach(mesh => {
      this.placeholders.push({
        name: mesh.id.replace('placeholder_', ''),
        mesh
      })
    })
  }
  
  setItems(){
    const storePlayer = store.getters.getPlayerById(this.playerId) as Player
  
    storePlayer.items.forEach((item: Item) => {
      const placeholder = this.placeholders.find(placeholder => placeholder.name === item.placeholder)
  
      if (placeholder) {
        SceneLoader.ImportMesh(
          '',
          '/resources/graphics/items/',
          item.name + '?time=' + Date.now(),
          globalThis.scene,
          (newMeshes) => {
            newMeshes.forEach(mesh => {
              if (mesh.id != '__root__') {
                mesh.parent = placeholder.mesh
              }
            })
          },undefined,
          undefined,
          '.gltf')
      }
     
    })
    
  }
}