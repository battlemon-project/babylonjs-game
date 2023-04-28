import { AbstractMesh, Scene } from '@babylonjs/core'
import { Helpers } from '@/models/Helpers'
import ContainerManager from '@/models/scene/ContainerManager'

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
        
        const rootMesh = container.meshes[0] as AbstractMesh
        
        if (prefab) {
          rootMesh.parent = prefab
        }
        
      } catch (error) {
        console.error(`Error loading container ${nameModel}:`, error)
      }
    }
  }
}