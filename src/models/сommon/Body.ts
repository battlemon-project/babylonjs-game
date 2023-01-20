import { MeshBuilder, Vector3, Tags, Observer, Nullable, Scene } from '@babylonjs/core'

export default class Body {
  playerId: string
  meshHeadId: string
  meshFootId: string
  observer: Nullable<Observer<Scene>>
  
  constructor (playerId: string) {
    this.playerId = playerId
    this.meshHeadId = 'playerHead_' + playerId
    this.meshFootId = 'playerFoot_' + playerId
    this.observer = null
    this.add()
  }
  
  private add () {
    const scene = globalThis.scene
    const size = 0.5
    const meshHead = MeshBuilder.CreateBox(this.meshHeadId, { size: size }, scene)
    const meshFoot = MeshBuilder.CreateBox(this.meshFootId, { size: size }, scene)
  
    Tags.AddTagsTo(meshFoot, 'foot')
    
    meshFoot.ellipsoid = new Vector3(size / 2, size, size / 2)
    meshFoot.ellipsoidOffset = new Vector3(0, 0.3, 0)

    meshHead.rotation.x = 0
    meshHead.rotation.z = 0
    
    meshFoot.position.y = 10
  
    const meshCoordinator = scene.getMeshById('player')
    
    if (meshCoordinator) {
      meshFoot.position.z = meshCoordinator.position.z
      meshFoot.position.x = meshCoordinator.position.x
    }

    meshFoot.rotation = new Vector3()

    meshHead.visibility = 0
    meshFoot.visibility = 0

    meshHead.checkCollisions = false
    meshFoot.checkCollisions = false

    meshHead.isPickable = false
    meshFoot.isPickable = false

    meshHead.isPickable = false

   this.observer = scene.onBeforeRenderObservable.add(() => {
      meshHead.position.x = meshFoot.position.x
      meshHead.position.y = meshFoot.position.y + 2
      meshHead.position.z = meshFoot.position.z
      meshHead.rotation.y = meshFoot.rotation.y
    })
  }
  
  dispose () {
    if (this.observer !== null) {
      scene.onBeforeRenderObservable.remove(this.observer)
    }
    
    const meshFoot = globalThis.scene.getMeshById(this.meshFootId)
    const meshHead = globalThis.scene.getMeshById(this.meshHeadId)
    
    if (meshFoot) {
      meshFoot.dispose()
    }
    
    if (meshHead) {
      meshHead.dispose()
    }
  }
}
