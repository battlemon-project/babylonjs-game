import {
  Vector3,
  UniversalCamera,
  Scene,
  UniversalCamera as BabylonCamera,
  Ray,
  AbstractMesh, Axis, Scalar
} from '@babylonjs/core'
import store from '@/store'
import { Player } from '@/store/players/types'

interface CalculateDistance {
  distance: number;
  amount: number;
}

const MAX_DIST_CAMERA_Z = 4.5
const MAX_DIST_CAMERA_Y = 0.5

export default class Camera {
  scene: Scene
  babylonCamera: BabylonCamera
  meshHead: AbstractMesh
  actualDistance: number
  calculateDistance: CalculateDistance
  isMoving: boolean
  
  constructor () {
    this.scene = globalThis.scene
    this.babylonCamera = new UniversalCamera('playerCamera', Vector3.Zero(), this.scene)
    this.meshHead = this.scene.getMeshById('playerHead_' + store.state.player.id) as AbstractMesh
    this.actualDistance = -MAX_DIST_CAMERA_Z
    this.isMoving = false
    
    this.calculateDistance = {
      amount: 0,
      distance: 0
    }
    
    this.init()
  }
  
  private init () {
    this.babylonCamera.maxZ = 350
    this.babylonCamera.minZ = 0.2
    this.babylonCamera.name = 'player'
    this.scene.activeCamera = this.babylonCamera
    this.attachCamera()
    this.setIsMovingInterval()
  }
  
  private attachCamera () {
    this.scene.registerBeforeRender(() => {
      this.setDistance()
      this.babylonCamera.position = this.meshHead.position
      
      this.babylonCamera.rotation.x = Number(Scalar.Lerp(this.babylonCamera.rotation.x, this.meshHead.rotation.x, 0.4).toFixed(5))
      this.babylonCamera.rotation.y = Number(Scalar.Lerp(this.babylonCamera.rotation.y, this.meshHead.rotation.y, 0.25).toFixed(5))
      
      this.actualDistance = Number(Scalar.Lerp(this.actualDistance, this.calculateDistance.distance, this.calculateDistance.amount).toFixed(5))
      
      const dirZ = this.babylonCamera.getDirection(Axis.Z)
      this.babylonCamera.position.addInPlace(dirZ.scaleInPlace(this.actualDistance))
      
      const dirY = this.babylonCamera.getDirection(Axis.Y)
      this.babylonCamera.position.addInPlace(dirY.scaleInPlace(-MAX_DIST_CAMERA_Y))
    })
  }
  
  private setDistance () {
    const headPosition = this.meshHead.position
    let forward = new Vector3(0, -MAX_DIST_CAMERA_Y, -MAX_DIST_CAMERA_Z)
    const m = this.meshHead.getWorldMatrix()
    forward = Vector3.TransformCoordinates(forward, m)
    const direction = Vector3.Normalize(forward.subtract(headPosition))
    
    const ray = new Ray(headPosition, direction, MAX_DIST_CAMERA_Z)
    
    const pickResult = this.scene.pickWithRay(ray, (mesh) => {
      return mesh.checkCollisions
    })
    
    let distance = -MAX_DIST_CAMERA_Z
    let amount = 0.02
   
    if (this.isMoving) {
      distance = -MAX_DIST_CAMERA_Z - 1.2
    }
    
    if (pickResult && pickResult.pickedMesh) {
      distance = -(pickResult.distance + 0.2)
      amount = 0.5
    }
  
    this.calculateDistance.distance = distance
    this.calculateDistance.amount = amount
  }
  
  private setIsMovingInterval()
  {
    setInterval(() => {
      this.isMoving = Camera.getIstMoving()
    }, 100)
  }
  
  private static getIstMoving()
  {
    const playerState = store.getters.getPlayerById(store.state.player.id) as Player // TODO: дописать interval на смену move
    return playerState.move.forward.isMoving
  }
}
