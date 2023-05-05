import { Mesh, Tags } from '@babylonjs/core'
import { sortBy } from 'lodash'

interface LOD {
  mesh: any;
  distance: number;
}

export default class LODs {
  constructor (meshes: Array<any>) {
    this.init(meshes)
  }
  
  init(meshes: Array<any>) {
    const LODs = [] as Array<LOD>
    
    meshes.forEach(mesh => {
      const rawTags = Tags.GetTags(mesh)
      if (!rawTags || !rawTags.length) {
        return
      }
      
      const tags = rawTags.split(' ')
      if (!tags.find((tag: string) => tag === 'lod')) {
        return
      }
      
      const tagDistance = tags.find((tag: string) => tag.indexOf('distance') !== -1)
      let distance = 0
      
      if (tagDistance) {
        distance = Number(tagDistance.split('_')[1])
      }
      
      LODs.push({
        mesh: mesh,
        distance: distance
      })
    })
    
    if (LODs.length) {
      const orderedLODs = sortBy(LODs, 'distance').reverse()
      const mainLod = orderedLODs[0]
      const mainLODMesh = mainLod.mesh as Mesh
      
      mainLODMesh.setEnabled(false)
      mainLODMesh.useLODScreenCoverage = false
      
      for (let i = 1; i < orderedLODs.length; i++) {
        const LOD = orderedLODs[i]
        mainLODMesh.addLODLevel(LOD.distance, LOD.mesh)
      }
  
      mainLod.mesh.addLODLevel(mainLod.mesh.distance, null)
    }
    
    console.log(LODs)
  }

}
