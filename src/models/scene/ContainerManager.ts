import { AssetContainer, SceneLoader } from '@babylonjs/core'

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
    
    const newContainer = await SceneLoader.LoadAssetContainerAsync(
      path,
      name,
      globalThis.scene)
    
    newContainer.removeAllFromScene()
    
    globalThis.assetContainers.push({
      name: name,
      container: newContainer
    })
    
    return newContainer
  }
}