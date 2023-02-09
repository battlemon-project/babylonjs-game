import {
  AbstractMesh,
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
import Items from '@/models/сommon/character/Items'
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
    const assetContainer = ContainerManager.getContainer('BTLMN_Lemon.gltf', '/resources/graphics/characters/')
    
    assetContainer.then((container) => {
      const instanceContainer = container.instantiateModelsToScene((name) => {
        if (name === '__root__') {
          return this.meshRootId
        }
        
        if (name === 'Body') {
          return this.meshBodyId
        }
        
        return name + '_' + this.playerId
      }, false, {doNotInstantiate: (node) => {
        return this.filterProperties(node)
      }})
      
      const meshes = instanceContainer.rootNodes[0].getChildMeshes()
      
      meshes.forEach(mesh => {
        mesh.id = mesh.name
      })
      
      this.meshBody = meshes.find(mesh => mesh.id === this.meshBodyId)
      this.meshRoot = meshes.find(mesh => mesh.id === this.meshRootId)
      
      if (!this.meshBody) {
        throw 'Not found mesh Player Body'
      }
      
      if (!this.meshFoot) {
        throw 'Not found mesh Player Foot'
      }
      
      if (!this.meshRoot) {
        throw 'Not found mesh Root'
      }
      
      this.meshBody.isVisible = false
      this.meshBody.rotationQuaternion = null
      this.meshRoot.resetLocalMatrix()
      this.meshRoot.setParent(null)
      
      meshes.forEach(mesh => {
        mesh.isPickable = false
      })
      
      this.setAnimations()
      this.setShadow()
      
      this.observer = this.scene.onBeforeRenderObservable.add(() => {
        this.beforeRender()
      })
      
      callback()
    })
  }
  
  filterProperties (node: TransformNode) {
    const playerStore = store.getters.getPlayerById(this.playerId)
    const properties = playerStore.properties
    
    console.log(node.name)
    
    if (!Helpers.IsName(node.name,'Body') && !Helpers.IsName(node.name,'placeholder', true)) {
      if (!properties.find((property: Property) => property.flavour === node.name)) {
        return true
      }
    }
  
    return false
  }
  
  //load (callback: any = null) {
  //   const playerStore = store.getters.getPlayerById(this.playerId)
  
  /*const instanceHolder = this.scene.getNodeByName('player_instance_holder')
  const instanceHolderMeshes = instanceHolder?.getChildMeshes() as Array<Mesh>
  
  if (!instanceHolderMeshes) {
    return null;
  }
  
  instanceHolderMeshes.forEach((mesh: Mesh) => {
    const meshInstance = mesh.createInstance(mesh.id + '_' + this.playerId)
    meshInstance.isVisible = true
    console.log(meshInstance.id)
  })

  this.observer = this.scene.onBeforeRenderObservable.add(() => {
    this.beforeRender()
  })

  callback()*/
  
  /* SceneLoader.ImportMesh(
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
       
       new Items(this.playerId, newMeshes)
       
       this.observer = this.scene.onBeforeRenderObservable.add(() => {
         this.beforeRender()
       })
       
       if (callback) {
         callback()
       }
     },
     undefined,
     (scene, message, exception) => {
       console.log(message, exception)
     }
   )*/
  
  // }
  
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
