import { Mesh } from '@babylonjs/core'

interface LOD {
  name: string;
  numbers: Array<string>;
}

export default class LODs {
  constructor () {
    this.init()
  }
  
  init() {
    const meshes = globalThis.scene.getMeshesByTags('lod')
    const LODs = [] as Array<LOD>
      
    meshes.forEach(mesh => {
      const splitName = mesh.id.split('.')
      const name = splitName[0]
      const number = splitName[splitName.length -1]
      
      const oldLod = LODs.find((lod: LOD) => lod.name === name)
      
      if (oldLod) {
        oldLod.numbers.push(number)
      } else {
        LODs.push({
          name,
          numbers: [number]
        })
      }
    })
    
    LODs.forEach((LOD: LOD) => {
      LOD.numbers.sort((a, b) => {
        return Number(a) - Number(b)
      })
      
      const mainLOD = scene.getMeshById(LOD.name + '.' + LOD.numbers[0]) as Mesh
  
      if (mainLOD) {
        LOD.numbers.forEach((number, index) => {
          if (index !== 0) {
            const mesh = scene.getMeshById(LOD.name + '.' + number) as Mesh
            
            if (mesh) {
              mainLOD.addLODLevel(Number(number), mesh)
            }
          }
        })
  
        mainLOD.addLODLevel(500, null)
      }
    })
  }
}