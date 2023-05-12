import { AbstractMesh, Scene, Tags } from '@babylonjs/core'
import { Helpers } from '@/models/Helpers'

export default class Collisions {
  listCollisions: AbstractMesh[]
  listCollisionsFloor: AbstractMesh[]
  scene: Scene

  constructor () {
    this.scene = globalThis.scene
    this.listCollisions = []
    this.listCollisionsFloor = []
    
    this.setCollisions()
  }
  
  private setCollisions()
  {
    this.listCollisions = this.scene.meshes.filter(mesh => mesh.checkCollisions || Helpers.hasTag(mesh, 'collision'))
    this.listCollisionsFloor = this.scene.getMeshesByTags('ground')
    
    this.listCollisions.forEach((mesh) => {
      mesh.isVisible = false
      mesh.isPickable = false
    })
  
    this.scene.getMeshesByTags('visible_force').forEach((mesh) => {
      mesh.isVisible = true
    })
  }
  
  private static checkCollisionList(mesh: AbstractMesh, list: Array<AbstractMesh>)
  {
    for (const keyMesh in list) {
      const listMesh = list[keyMesh]
      
      if (listMesh !== mesh && mesh.intersectsMesh(listMesh, Tags.MatchesQuery(listMesh, 'precise'))) {
        return listMesh
      }
    }
  
    return false
  }
  
  checkCollisionFloor(mesh: AbstractMesh) {
    return Collisions.checkCollisionList(mesh, this.listCollisionsFloor)
  }
  
  appendCollisionByMeshes(meshes: Array<AbstractMesh>) {
    meshes.forEach(mesh => {
      if (mesh.checkCollisions || Helpers.hasTag(mesh, 'collision')) {
        mesh.checkCollisions = true
        mesh.isVisible = Helpers.hasTag(mesh, 'visible_force')
        mesh.isPickable = false
        
        this.listCollisions.push(mesh)
      }
    })
  }
}
