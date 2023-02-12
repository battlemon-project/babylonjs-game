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
import Items from '@/models/сommon/character/Items'

export default class Character {
  scene: Scene
  mesh: AbstractMesh | undefined
  meshFoot: Mesh | undefined
  meshBody?: AbstractMesh
  meshRoot?: AbstractMesh
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
    this.meshBodyId = 'characterBody_' + this.playerId
    this.meshRootId = 'characterRoot_' + this.playerId
  }
  
  load (callback: any) {
    const path = '/resources/graphics/characters/'
    const assetContainer = ContainerManager.getContainer('BTLMN_Lemon.gltf', path)
    
    assetContainer.then((container) => {
      const resources = container.instantiateModelsToScene((sourceName) => {
        if (sourceName == 'Body') {
          return this.meshBodyId
        }
  
        if (sourceName == '__root__') {
          return this.meshRootId
        }
        
        return sourceName + '_' + this.playerId
      })
      
      this.setMeshes()
      this.setAnimations()
      this.setItems()
  
      callback()
  
      this.observer = this.scene.onBeforeRenderObservable.add(() => {
        this.beforeRender()
      })
    })
  }
  
  setMeshes() {
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
    this.meshBody.rotationQuaternion = null
    this.meshBody.resetLocalMatrix()
    this.meshBody.isVisible = false
    
    this.meshRoot = meshRoot
    this.meshRoot.id = this.meshRoot.name
    this.meshRoot.rotationQuaternion = null
    this.meshRoot.resetLocalMatrix()
    
    this.meshRoot.getChildMeshes().forEach(mesh => {
      mesh.id = mesh.name
    })
  
    this.disposeNotActiveProperties()
  }
  
  filterProperties (mesh: AbstractMesh) {
      const playerStore = store.getters.getPlayerById(this.playerId)
      const properties = playerStore.properties
      
      if (!Helpers.IsName(mesh.name,'placeholder', true)) {
        const propery = properties.find((property: Property) => {
          return Helpers.IsName(mesh.name, property.flavour, true)
        })
        
        return propery
      }
  
    return true
  }
  
  private disposeNotActiveProperties()
  {
    this.meshBody?.getChildMeshes().forEach((mesh) => {
      if (!this.filterProperties(mesh)) {
        mesh.dispose()
      }
    })
  }
  
  private setItems()
  {
      new Items(this.playerId)
  }
  
  private setAnimations () {
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
