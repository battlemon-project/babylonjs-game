import { AbstractMesh, SceneLoader } from '@babylonjs/core'
import { Helpers } from '@/models/Helpers'

export interface Container {
  name: string;
  meshes: AbstractMesh[];
}

export default class ContainerManager {
  static async getContainer(name: string, path: string): Promise<null | { name: string; meshes: (AbstractMesh | null)[] }> {
    const filePath = path + name;
    
    if (!Helpers.isFile(filePath)) {
      console.info('Not found file: ' + filePath);
      return null;
    }
    
    const container = globalThis.assetContainers.find(container => container.name === name);
    
    if (container) {
      const meshes = container.meshes.map(mesh => mesh.clone(`instance_${mesh.name}`, null, false));
      return { name: name, meshes: meshes };
    }
    
    const timestamp = await Helpers.getFileTimestamp(filePath);
  
    const result = await SceneLoader.ImportMeshAsync('', path, name + '?timestamp=' + timestamp, globalThis.scene)
    
    const instanceMeshes = result.meshes.map(mesh => mesh.clone(`instance`, null, false))
  
    result.meshes.forEach(mesh => {
      mesh.dispose()
    })
    
    globalThis.assetContainers.push({
      name: name,
      meshes: result.meshes
    });
    
    return { name: name, meshes: instanceMeshes };
  }
}
