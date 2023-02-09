import { AssetContainer, SceneLoader } from '@babylonjs/core'
import { result } from 'lodash'

export interface Container {
  name: string;
  container: AssetContainer;
}

export default class ContainerManager {
  static async getContainer (name: string, path: string) {
    const container = globalThis.assetContainers.find(container => container.name === name)
    
    if (container) {
      container.container.removeAllFromScene()
      return container.container
    }
    
     const promise = SceneLoader.LoadAssetContainerAsync(
      path,
      name,
      globalThis.scene)
  
    const newContainer = await promise;
    newContainer.createRootMesh()
  
    globalThis.assetContainers.push({
      name: name,
      container: newContainer
    })
  
    newContainer.removeFromScene()
    
    return newContainer
  }
}