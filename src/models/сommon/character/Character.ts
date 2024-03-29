import { AbstractMesh, DirectionalLight, Mesh, Nullable, Observer, Scene, ShadowGenerator, } from '@babylonjs/core'
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
    const path = process.env.VUE_APP_RESOURCES_PATH + 'graphics/characters/'
    // TODO: взять из store название gltf
    const assetContainer = ContainerManager.getContainer('BTLMN_Lemon.gltf', path)
    
    assetContainer.then((container) => {
      if (!container) {
        throw 'Not found container ' + path + 'BTLMN_Lemon.gltf'
      }
      
      const rootMesh = container.rootNodes[0]
      rootMesh.id = this.meshRootId
  
      container.rootNodes[0].getChildMeshes().forEach((mesh) => {
          if (mesh.name == 'Body') {
            mesh.id = this.meshBodyId
            mesh.name = this.meshBodyId
            return
          }
  
          mesh.id = mesh.id + '_' + this.playerId
          mesh.name = mesh.name + '_' + this.playerId
      })
      
      container.animationGroups.forEach((animationGroup) => {
        animationGroup.name = animationGroup.name + '_' + this.playerId
      })
      
      this.setMeshes()
      this.setAnimations()
      this.setItems()
      this.setShadow()
  
      callback()
  
      this.observer = this.scene.onBeforeRenderObservable.add(() => {
        this.beforeRender()
      })
    })
  }
  
  setMeshes() {
    const meshBody = this.scene.getMeshById(this.meshBodyId)
    const meshRoot = this.scene.getMeshById(this.meshRootId)
  
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
      mesh.isPickable = false
      mesh.checkCollisions = false
    })
  
    this.disposeNotActiveProperties()
  }
  
  filterProperties (mesh: AbstractMesh) {
      const playerStore = store.getters.getPlayerById(this.playerId)
      const properties = playerStore.properties
      
      if (!Helpers.IsName(mesh.name,'placeholder', true)) {
        return properties.find((property: Property) => {
          return Helpers.IsName(mesh.name, property.flavour, true)
        })
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
    
    this.scene.getMeshById('characterRoot_' + this.playerId)?.dispose()
  }
}
