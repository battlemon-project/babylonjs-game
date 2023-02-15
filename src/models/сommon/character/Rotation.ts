import { AbstractMesh, Angle, Animation, CubicEase, EasingFunction, Scene, Tools } from '@babylonjs/core'
import SubscribeStore from '../SubscribeStore'
import store from '@/store'

export default class Rotation {
  animation: Animation | undefined
  scene: Scene
  playerId: string
  angle: number
  meshCharacter: AbstractMesh
  meshFoot: AbstractMesh
  subscribeStore?: SubscribeStore
  animatable: any
  forwardAngle: number
  isAnimated: boolean
  syncIntervalId: any
  
  constructor (playerId: string) {
    this.scene = globalThis.scene
    this.playerId = playerId
    this.angle = 0
    // TODO: вывести в константы признак meshId
    this.meshCharacter = this.scene.getMeshById('characterBody_' + this.playerId) as AbstractMesh
    this.meshFoot = this.scene.getMeshById('playerFoot_' + this.playerId) as AbstractMesh
    this.animation = undefined
    this.animatable = undefined
    this.isAnimated = false
    this.forwardAngle = 0

    this.setAnimation()
    this.subscribe()
  }

  private setAnimation () {
    this.animation = new Animation(
      'rotateMesh',
      'rotation.y',
      20,
      Animation.ANIMATIONTYPE_FLOAT
    )

    const easingFunction = new CubicEase()
    easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT)
    this.animation.setEasingFunction(easingFunction)
  }

  private setAngle () {
    const state = store.getters.getPlayerById(this.playerId)
    if (!state) {
      return null
    }
    
    const stateForward = state.move.forward

    if (!stateForward.isMoving) {
      return null
    }

    let angleNew = 0

    if (stateForward.left) {
      angleNew = 270
    }

    if (stateForward.right) {
      angleNew = 90
    }

    if (stateForward.front) {
      angleNew = 0

      if (stateForward.left) {
        angleNew = 305
      }

      if (stateForward.right) {
        angleNew = 45
      }
    }

    if (stateForward.back) {
      angleNew = 180

      if (stateForward.left) {
        angleNew = 225
      }

      if (stateForward.right) {
        angleNew = 135
      }
    }
  
    let radianNew = Tools.ToRadians(angleNew) + this.meshFoot.rotation.y
    const radianOld = this.meshCharacter.rotation.y
  
    const angleOld = Tools.ToDegrees(radianOld)
    angleNew = Tools.ToDegrees(radianNew)
  
    const diff = (angleNew - angleOld + 180) % 360 - 180
    const shortWayAngle = diff < -180 ? diff + 360 : diff
    radianNew = radianOld + Tools.ToRadians(shortWayAngle)
    
    const diffAngle = Math.abs(radianNew - radianOld) / (Math.PI / 180)
  
    if (diffAngle > 10) {
      if (!this.isAnimated) {
        this.stopAnimation()
        this.play(radianNew, radianOld)
        this.isAnimated = true
      }
    } else {
      this.meshCharacter.rotation.y = radianNew
    }
  }

  private play (radianNew: number, radianOld: number) {
    if (this.animation === undefined) {
      console.error('Not set animation rotate')
      return
    }

    const keys = []
    const frames = 10

    keys.push({
      frame: 0,
      value: radianOld
    })

    keys.push({
      frame: frames,
      value: radianNew
    })
    
    this.animation.setKeys(keys)
    this.meshCharacter.animations = []
    this.meshCharacter.animations.push(this.animation)
  
    this.isAnimated = true
    this.animatable = this.scene.beginAnimation(this.meshCharacter, 0, frames, false, 1.15, () => {
      this.isAnimated = false
    })
  }

  private subscribe () {
    this.subscribeStore = new SubscribeStore(this.playerId)
  
    this.subscribeStore.rotate(() => {
      const stateForward = store.getters.getPlayerById(this.playerId).move.forward
      
      if (stateForward.isMoving) {
        this.setAngle()
      }
    })
  
    this.subscribeStore.forward(() => {
      this.setAngle()
    })
  
    this.syncIntervalId = setInterval(() => {
      this.setAngle()
    }, 100)
  }
  
  private stopAnimation()
  {
    if (this.animatable !== undefined) {
      this.animatable.stop()
    }
  }
  
  dispose () {
    this.subscribeStore?.unsubscribeAll()
    
    if (this.syncIntervalId) {
      clearInterval(this.syncIntervalId)
    }
  }
}
