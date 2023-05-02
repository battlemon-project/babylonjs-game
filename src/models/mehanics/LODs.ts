import { Mesh, Tags } from '@babylonjs/core'
import { sortBy } from 'lodash'

interface LOD {
  mesh: Mesh;
  distance: number;
}

export default class LODs {
  constructor () {
    this.init()
  }
  
  init() {
    const meshes = globalThis.scene.getMeshesByTags('lod')
    const LODs = [] as Array<LOD>
      
    meshes.forEach(mesh => {
      const tags = Tags.GetTags(mesh).split(' ')
      const tagDistance = tags.find(tag => tag.indexOf('distance') !== -1)
      let distance = 0
      
      if (tagDistance) {
        distance = Number(tagDistance.split('_')[1])
      }
  
      LODs.push({
        mesh: mesh,
        distance: distance
      })
    })
    
    const mainLOD = LODs.find(LOD => !LOD.distance)
    
    if (mainLOD) {
      sortBy(LODs, 'distance').forEach(LOD => {
        if (LOD.distance) {
          console.log(mainLOD.mesh)
          mainLOD.mesh.addLODLevel(LOD.distance, LOD.mesh)
        }
      })
    }
  }
}
