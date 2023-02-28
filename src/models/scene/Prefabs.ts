import { AbstractMesh, Scene } from '@babylonjs/core'
import { Helpers } from '@/models/Helpers'
import ContainerManager from '@/models/scene/ContainerManager'

export default class Prefabs {
  prefabs: AbstractMesh[]
  scene: Scene
  
  constructor () {
    this.scene = globalThis.scene
    this.prefabs = []
    
    this.setPrefabs()
    this.setItems()
  }
  
  private setPrefabs () {
    this.scene.meshes.forEach(mesh => {
      if (Helpers.IsName(mesh.id, 'Prefab_', true)) {
        mesh.isVisible = false
        this.prefabs.push(mesh)
      }
    })
  }
  
  private setItems () {
    this.prefabs.forEach((prefab) => {
      let nameModel = prefab.id.replace('Prefab_', '')
      nameModel = nameModel.replace(/\.[^/.]+$/, "")
      nameModel = 'BTLMN_Prop_' + nameModel + '.gltf'
      
      const path = '/resources/graphics/prefabs/'
      const assetContainer = ContainerManager.getContainer(nameModel, path)
      
      if (!assetContainer) {
        return null
      }
      
      assetContainer.then((container) => {
        if (!container) {
          return null
        }
        
        const resources = container.instantiateModelsToScene()
        const rootMesh = resources.rootNodes[0]
        rootMesh.id = rootMesh.name
        
        const meshes = rootMesh.getChildMeshes()
        
        meshes.forEach(mesh => {
          mesh.id = mesh.name
          mesh.isPickable = false
        })
        
        if (prefab) {
          rootMesh.parent = prefab
        }
      })
      
    })
  }
}