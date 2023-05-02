import { AssetContainer, InstantiatedEntries, Mesh, SceneLoader, Tags } from '@babylonjs/core'
import { Helpers } from '@/models/Helpers'

export interface Container {
  name: string;
  // TODO: указать тип
  data: AssetContainer
}

export default class ContainerManager {
  static async getContainer(name: string, path: string): Promise<InstantiatedEntries | null> {
    const filePath = path + name;
    
    if (!Helpers.isFile(filePath)) {
      console.info('Not found file: ' + filePath)
      return null
    }
    
    const container = globalThis.assetContainers.find((container: Container) => container.name === name)
    
    if (container) {
      return this.getInstance(container.data)
    }
    
    const timestamp = await Helpers.getFileTimestamp(filePath)
  
    const loadedContainer = await SceneLoader.LoadAssetContainerAsync(  path, name + '?timestamp=' + timestamp, globalThis.scene)
    
    if (loadedContainer) {
      loadedContainer.removeAllFromScene()
      
      const newContainer = { name, data: loadedContainer }
      globalThis.assetContainers.push(newContainer)
      
      return this.getInstance(newContainer.data)
    }

    return null
  }
  
  static getInstance(assetContainer: AssetContainer)
  {
    const result = assetContainer.instantiateModelsToScene((name) => {
      return name
    }, false, { doNotInstantiate: false })
    
    result.rootNodes[0].getChildMeshes().forEach(mesh => {
      const assetMesh = assetContainer.meshes.find(assetMesh => assetMesh.name === mesh.name) as Mesh
      
      if (assetMesh) {
        const tags = Tags.GetTags(assetMesh)
        Tags.AddTagsTo(mesh, tags)
      }
    })
    
    return result
  }
}
