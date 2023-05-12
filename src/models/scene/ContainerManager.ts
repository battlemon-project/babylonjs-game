import { AssetContainer, InstantiatedEntries, Mesh, SceneLoader, Tags } from '@babylonjs/core'
import { Helpers } from '@/models/Helpers'
import LODs from '@/models/mehanics/LODs'

export interface Container {
  name: string
  data: AssetContainer
}

export default class ContainerManager {
  static async getContainer(name: string, path: string): Promise<InstantiatedEntries | null> {
    const filePath = path + name;
    
    if (!Helpers.isFile(filePath)) {
      console.error('Not found file container: ' + filePath)
      return null
    }
    
    const container = globalThis.assetContainers.find((container: Container) => container.name === name)
    
    if (container) {
      const instanceData = this.getInstance(container.data)
      LODs.showOnlyMainLod(instanceData.rootNodes[0].getChildMeshes())
      
      return instanceData
    }
    
    const timestamp = await Helpers.getFileTimestamp(filePath)
  
    const loadedContainer = await SceneLoader.LoadAssetContainerAsync(  path, name + '?timestamp=2' + timestamp, globalThis.scene)
    
    if (loadedContainer) {
      LODs.addLevels(loadedContainer.meshes)
      
      loadedContainer.removeAllFromScene()
      
      const newContainer = { name, data: loadedContainer }
      globalThis.assetContainers.push(newContainer)
      
      const instancesData = this.getInstance(newContainer.data)
      
      const meshes = instancesData.rootNodes[0].getChildMeshes()
      globalThis.collisions.appendCollisionByMeshes(meshes)
      
      LODs.showOnlyMainLod(meshes)
      
      return instancesData
    }

    return null
  }
  
  static getInstance(assetContainer: AssetContainer)
  {
    const result = assetContainer.instantiateModelsToScene((name) => {
      return name
    }, false, { doNotInstantiate: false })
    
    const meshes = result.rootNodes[0].getChildMeshes()
  
    meshes.forEach(mesh => {
      const assetMesh = assetContainer.meshes.find(assetMesh => assetMesh.name === mesh.name) as Mesh
      
      if (assetMesh) {
        const tags = Tags.GetTags(assetMesh)
        Tags.AddTagsTo(mesh, tags)
      }
    })
    
    return result
  }
}
