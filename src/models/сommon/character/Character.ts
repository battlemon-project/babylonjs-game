import {
  AbstractMesh, AnimationGroup,
  DirectionalLight,
  Mesh,
  Nullable,
  Observer,
  Scene,
  ShadowGenerator, TransformNode,
} from '@babylonjs/core'
import Animation from './Animation'
import Rotation from './Rotation'
import store from '@/store/index'
import ContainerManager from '@/models/scene/ContainerManager'
import { Helpers } from '@/models/Helpers'
import { Property } from '@/store/players/types'

export default class Character {
  scene: Scene
  mesh: AbstractMesh | undefined
  meshFoot: Mesh | undefined
  meshBody?: AbstractMesh
  meshRoot?: AbstractMesh
  runWalk: boolean
  playerId: string
  meshBodyId: string
  meshRootId: string
  observer?: Nullable<Observer<Scene>>
  animation?: Animation
  rotation?: Rotation
  
  constructor (playerId: string) {
    this.scene = globalThis.scene
    this.playerId = playerId
    this.meshFoot = this.scene.getMeshById('playerFoot_' + playerId) as Mesh
    this.runWalk = false
    this.meshBodyId = 'characterBody_' + this.playerId
    this.meshRootId = 'characterRoot_' + this.playerId
    this.meshBody = undefined
  }
  
  load (callback: any) {
    const path = '/resources/graphics/characters/'
    const assetContainer = ContainerManager.getContainer('BTLMN_Lemon.gltf', path)
    
    assetContainer.then((container) => {
      const rootMesh = container.meshes.find(mesh => mesh.id === '__root__')
      
      if (rootMesh) {
        this.instanceMeshes(rootMesh as Mesh)
        this.setAnimations(container.animationGroups)
        this.setShadow()
  
        this.observer = this.scene.onBeforeRenderObservable.add(() => {
          this.beforeRender()
        })
  
        callback()
      }
    })
  }
  
  instanceMeshes(rootMesh: Mesh) {
    const newRootMesh = rootMesh.clone(this.meshRootId, null, true)
    const meshes = rootMesh.getChildMeshes() as Array<Mesh>
    
   meshes.forEach((mesh) => {
      if (this.filterProperties(mesh)) {
        if (mesh.geometry) {
          let nameNew = mesh.name + '_' + this.playerId
          
          if (mesh.name === 'Body') {
            nameNew = this.meshBodyId
          }
          
          const newMesh = mesh.createInstance(nameNew)
          newMesh.setParent(newRootMesh)
        }
      }
    })
    
  
    const meshBody = this.scene.getMeshByName(this.meshBodyId)
    const meshRoot = this.scene.getMeshByName(this.meshRootId)
  
    if (!meshBody) {
      throw 'Not found mesh Player Body'
    }
  
    if (!this.meshFoot) {
      throw 'Not found mesh Player Foot'
    }
  
    if (!meshRoot) {
      throw 'Not found mesh Root'
    }
  
    this.meshBody = meshBody
    this.meshRoot = meshRoot
  
    this.meshBody.id = this.meshBodyId
    this.meshRoot.id = this.meshBodyId
  
    this.meshBody.isVisible = true
    this.meshBody.rotationQuaternion = null
    this.meshRoot.resetLocalMatrix()
  }
  
  filterProperties (mesh: AbstractMesh) {
      const playerStore = store.getters.getPlayerById(this.playerId)
      const properties = playerStore.properties
      
      if (!Helpers.IsName(mesh.name,'placeholder', true)
        && mesh.name !== 'Body'
        && mesh.name !== '__root__'
        && mesh.name !== 'assetContainerRootMesh'
      ) {
        if (!properties.find((property: Property) => property.flavour === mesh.name)) {
          return false
        }
      }
  
    return true
  }
  
  private setAnimations (animationGroups: Array<AnimationGroup>) {
    animationGroups.forEach(group => {
      group.clone(group.name + '_' + this.playerId)
    })
    
    this.animation = new Animation(this.playerId)
    this.rotation = new Rotation(this.playerId)
  }
  
  private setShadow () {
    const light = this.scene.getLightById('MainDirectionLight') as DirectionalLight
    
    if (light) {
      const shadowGenerator = light.getShadowGenerator() as ShadowGenerator
      
      if (this.meshBody && shadowGenerator) {
        shadowGenerator.addShadowCaster(this.meshBody)
      }
      
    }
  }
  
  private beforeRender () {
    if (this.meshRoot && this.meshFoot) {
      this.meshRoot.position.x = this.meshFoot.position.x
      this.meshRoot.position.z = this.meshFoot.position.z
      this.meshRoot.position.y = this.meshFoot.position.y - 0.24
    }
  }
  
  dispose () {
    this.rotation?.dispose()
    this.animation?.dispose()
    
    if (this.observer) {
      this.scene.onBeforeRenderObservable.remove(this.observer)
    }
    
    this.mesh?.dispose()
  }
}
