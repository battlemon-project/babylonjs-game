import {
  AbstractMesh,
  Mesh,
  MeshBuilder,
  Ray,
  RayHelper,
  Scene,
  Vector3
} from '@babylonjs/core'
import { Rectangle } from '@babylonjs/gui/2D'
import store from '@/store/index'
import { PrefabItem } from '@/models/scene/Prefabs'

interface Item {
  meshEventId: string;
  prefabItem: PrefabItem;
}

export default class IceMeteor {
  items: Array<Item>
  scene: Scene
  store: any
  playerId: string
  meshHead: Mesh
  meshFoot: Mesh
  showRay: boolean
  rays: Array<Ray>
  rectLabel: Rectangle
  isFocused: boolean
  currentPrefabId: number|null
  
  constructor () {
    this.scene = globalThis.scene
    this.store = store
    this.playerId = this.store.state.player.id
    this.meshHead = this.scene.getMeshById('characterBody_' + this.playerId) as Mesh
    this.meshFoot = this.scene.getMeshById('playerFoot_' + this.playerId) as Mesh
    this.showRay = false
    this.items = []
    this.rays = []
    this.rectLabel = new Rectangle()
    this.isFocused = false
    this.currentPrefabId = null
    
    this.initItems()
    // this.initLabel()
    this.initCastRays()
    
    console.log(this.scene.getMeshesByTags('event_ice_meteor'))
  }
  
  private initItems () {
    this.scene.getMeshesByTags('event_ice_meteor').forEach((mesh: Mesh, index) => {
      if (mesh) {
        console.log(mesh)
        mesh.isPickable = false
        mesh.isVisible = false
        
        const meshEventId = mesh.id + '_event_mesh_' + index
        
        const boundingInfo = mesh.getBoundingInfo()
        const size = boundingInfo.boundingBox.extendSize.scale(2)
        
        const invisibleMesh = MeshBuilder.CreateBox(meshEventId, {height: size.y, width: size.x, depth: size.z}, scene);
        invisibleMesh.parent = mesh
        invisibleMesh.visibility = 0
        invisibleMesh.isVisible = true
        
        const prefabId = this.getPrefabIdByMesh(mesh)
        
        if (prefabId) {
          const prefabItem = globalThis.prefabs.find((prefab) => prefab.id == prefabId)
          
          if (prefabItem) {
            prefabItem.container.animationGroups.forEach((animationGroup) => {
              animationGroup.goToFrame(0)
              animationGroup.stop()
            })
  
            this.items.push({
              meshEventId,
              prefabItem
            })
          } else {
            console.error('Not found prefabId')
          }
          
        } else {
          console.error('Not found prefabId')
        }
       
      }
    })
  }
  
  private buildRays () {
    const rayCount = 3
    
    const length = 1
    const separation = 1 / (rayCount - 1)
    
    // Создаем каждый луч
    for (let i = 0; i < rayCount; i++) {
      const rayX = i * separation - 0.5
      const rayY = 0
      
      const ray = new Ray(Vector3.Zero(), Vector3.Zero())
      const rayHelper = new RayHelper(ray)
      rayHelper.attachToMesh(this.meshHead, new Vector3(rayX, rayY, length), new Vector3(0, 0.5, 0.2), length)
      
      if (this.showRay) {
        rayHelper.show(this.scene)
      }
      
      this.rays.push(ray)
    }
  }
  
  private castRay (ray: Ray) {
    const hit = this.scene.pickWithRay(ray)
  
    const playerState = this.store.getters.getPlayerById(this.playerId)
    if (!playerState) {
      return null
    }
    
    if (hit && hit.pickedMesh) {
        const pickMesh = hit.pickedMesh
        const item = this.items.find(item => item.meshEventId == pickMesh.id)
      
        if (item) {
          if (!playerState.event.isFocused) {
            this.store.commit('SET_EVENT_IS_FOCUSED', { playerId: this.playerId, status: true })
            this.currentPrefabId = item.prefabItem.id
  
            item.prefabItem.container.animationGroups.forEach((animationGroup) => {
              animationGroup.play(true)
            })
          }
          
          return true
        }
    }
  
    if (playerState.event.isFocused) {
      this.store.commit('SET_EVENT_IS_FOCUSED', { playerId: this.playerId, status: false })
  
      if (this.currentPrefabId !== null) {
        const item = this.items.find(item => item.prefabItem.id == this.currentPrefabId)
    
        if (item) {
          item.prefabItem.container.animationGroups.forEach((animationGroup) => {
            animationGroup.goToFrame(0)
            animationGroup.stop()
          })
        }
      }
    }
    
    return false
  }
  
  private castRays () {
    //TODO: проверить every
    this.rays.forEach(ray => {
      return !this.castRay(ray)
    })
  }
  
  private initCastRays () {
    this.buildRays()
    
    setInterval(() => {
      this.castRays()
    }, 500)
  }
  
  getPrefabIdByMesh(mesh: AbstractMesh)
  {
    const prefabMesh = mesh.parent?.parent
    
    if (prefabMesh) {
      return Number(prefabMesh.id.split('_')[1])
    }
    
    return null
  }
}
