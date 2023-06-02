import { AbstractMesh, InstantiatedEntries, Scene } from '@babylonjs/core'
import ContainerManager from '@/models/scene/ContainerManager'

export interface PrefabItem {
  id: number;
  container: InstantiatedEntries;
}

export default class Prefabs {
  prefabs: AbstractMesh[]
  scene: Scene
  
  constructor (callback: any) {
    this.scene = globalThis.scene
    this.prefabs = []
    
    this.setPrefabs()
    this.setItems().then(() => {
      console.info('All prefabs loaded!')
      callback()
    })
  }
  
  private setPrefabs () {
    const meshes = this.scene.getMeshesByTags('prefab')
  
    meshes.forEach(mesh => {
      mesh.isVisible = false
      this.prefabs.push(mesh)
    })
  }
  
  private async setItems() {
    let id = 0
    globalThis.prefabs = []
    
    for (const prefab of this.prefabs) {
      const nameModel = `BTLMN_Prop_${prefab.id.replace('Prefab_', '')
        .replace(/\.[^/.]+$/, '')}.gltf`
      
      const path = `${process.env.VUE_APP_RESOURCES_PATH}graphics/prefabs/`
      
      try {
        const container = await ContainerManager.getContainer(nameModel, path)
        
        if (!container) {
          console.error(`Error loading container ${nameModel}:`)
          continue
        }
        
        const rootMesh = container.rootNodes[0]
        rootMesh.parent = prefab
        prefab.id = 'prefab_' + id
  
        const loopAnimation = container.animationGroups.find(group => group.name === 'start')
        
        if (loopAnimation) {
          loopAnimation.play(true)
        }
        
        globalThis.prefabs.push({
          id: id,
          container: container
        })
        
        id++
        
      } catch (error) {
        console.error(`Error loading container ${nameModel}:`, error)
      }
    }
  }
}