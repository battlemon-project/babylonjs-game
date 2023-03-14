import { AbstractMesh, Scene, Tags } from '@babylonjs/core'

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
    this.listCollisions = this.scene.meshes.filter(mesh => mesh.checkCollisions)
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
}
