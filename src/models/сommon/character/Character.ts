import {
  SceneLoader,
  Scene,
  AbstractMesh,
  Mesh, DirectionalLight, ShadowGenerator, Observer, Nullable
} from '@babylonjs/core'
import Animation from './Animation'
import Rotation from './Rotation'
import store from '@/store/index'

export default class Character {
  scene: Scene
  mesh: AbstractMesh | undefined
  rootMesh: AbstractMesh | undefined
  meshFoot: Mesh
  runWalk: boolean
  playerId: string
  observer?: Nullable<Observer<Scene>>
  animation?: Animation
  rotation?: Rotation

  constructor (playerId: string) {
    this.scene = globalThis.scene
    this.playerId = playerId
    this.meshFoot = this.scene.getMeshById('playerFoot_' + playerId) as Mesh
    this.runWalk = false
  }

  load (callback: any = null) {
    const character = store.getters.getPlayerById(this.playerId).character

    SceneLoader.ImportMesh(
      '',
      '/resources/graphics/characters/',
      character + '?time=' + Date.now(),
      this.scene,
      (newMeshes) => {
        newMeshes.forEach(mesh => {
          mesh.isPickable = false
        })
  
        this.mesh = newMeshes.find(mesh => mesh.id === 'Body')
        this.rootMesh = newMeshes.find(mesh => mesh.id === '__root__')
        
        if (!this.mesh || !this.rootMesh) {
          console.error('Not find Body mesh in load character')
          return
        }
        
        this.rootMesh.id = 'characterRoot_' + this.playerId
        this.mesh.id = 'characterBody_' + this.playerId
        
        this.mesh.rotationQuaternion = null
        this.mesh.isVisible = false
        this.rootMesh.resetLocalMatrix()
        
        this.setAnimations()
        this.setShadow(this.mesh)
  
        this.observer = this.scene.onBeforeRenderObservable.add(() => {
          this.beforeRender()
        })
        
        if (callback) {
          callback()
        }
      },
      undefined,
      undefined,
      '.glb'
    )
  }
  
  private setAnimations () {
    this.animation = new Animation(this.playerId, this.scene)
    this.rotation = new Rotation(this.playerId, this.scene)
  }
  
  private setShadow (mesh: AbstractMesh) {
    const light = this.scene.getLightById('MainDirectionLight') as DirectionalLight
    
    if (light) {
      const shadowGenerator = light.getShadowGenerator() as ShadowGenerator
      
      if (shadowGenerator) {
        shadowGenerator.addShadowCaster(mesh)
      }
      
    }
  }
  
  private beforeRender () {
    if (this.rootMesh) {
      this.rootMesh.position.x = this.meshFoot.position.x
      this.rootMesh.position.z = this.meshFoot.position.z
      this.rootMesh.position.y = this.meshFoot.position.y - 0.24
    }
  }
  
  dispose () {
    this.rotation?.dispose()
    this.animation?.dispose()
    
    if (this.observer) {
      this.scene.onBeforeRenderObservable.remove(this.observer)
    }
  
    this.rootMesh?.dispose()
    this.mesh?.dispose()
  }
}
