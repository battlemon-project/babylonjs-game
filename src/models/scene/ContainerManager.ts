import { AssetContainer, SceneLoader } from '@babylonjs/core'
import { Helpers } from '@/models/Helpers'

export interface Container {
  name: string;
  container: AssetContainer;
}

export default class ContainerManager {
  static async getContainer (name: string, path: string) {
    const filePath = path + name
    
    if (!Helpers.isFile(filePath)) {
      console.info('Not found file: ' + filePath)
      return null
    }
    
    const container = globalThis.assetContainers.find(container => container.name === name)
    
    if (container) {
      container.container.removeAllFromScene()
      return container.container
    }
    
    const timestampedPath = `${name}?timestamp=${Helpers.getTimestampByFile(filePath)}`
    
    const newContainer = await SceneLoader.LoadAssetContainerAsync(
      path,
      timestampedPath,
      globalThis.scene)
    
    newContainer.removeAllFromScene()
    
    globalThis.assetContainers.push({
      name: name,
      container: newContainer
    })
    
    return newContainer
  }
}