import MoveCommon from '../сommon/Move'
import { Scene } from '@babylonjs/core'
import { isEqual } from 'lodash'

export default class Move extends MoveCommon {
  constructor (playerId: string, scene: Scene) {
    super(playerId, scene)

    this.updatePositionToState()
    this.updateRotationToState()
    this.updateFly()
  }

  private updatePositionToState () {
    let oldPosition = {
      x: this.meshFoot.position.x,
      y: this.meshFoot.position.y,
      z: this.meshFoot.position.z
    }
    
    setInterval(() => {
      const position = {
        x: this.meshFoot.position.x,
        y: this.meshFoot.position.y,
        z: this.meshFoot.position.z
      }
      
      if (!isEqual(oldPosition, position)) {
        this.store.commit('UPDATE_POSITION',  { playerId: this.playerId, position })
        oldPosition = { ...position }
      }
     
    }, 100)
  }

  private updateRotationToState () {
    let oldRotation = {x: this.meshFoot.rotation.x, y: this.meshFoot.rotation.y}
    
    setInterval(() => {
      const rotation = {x: this.meshFoot.rotation.x, y: this.meshFoot.rotation.y}
      
      if (!isEqual(rotation, oldRotation)) {
        const data = { playerId: this.playerId, x: rotation.x, y: rotation.y }
        this.store.commit('UPDATE_ROTATION', data)
        oldRotation = { ...rotation }
      }
      
    }, 100)
  }

  private updateFly () {
    let oldFly = false
    let oldFlyUp = false

    this.scene.onBeforeRenderObservable.add(() => {
      if (oldFly !== this.fly) {
        if (this.fly) {
          this.store.commit('FLY_ENABLED', this.playerId)
        } else {
          this.store.commit('FLY_DISABLED', this.playerId)
          this.store.commit('JUMP_DISABLED', this.playerId)
        }

        oldFly = this.fly
      }

      if (oldFlyUp !== this.flyUp) {
        if (this.flyUp) {
          this.store.commit('FLY_UP_ENABLED', this.playerId)
        } else {
          this.store.commit('FLY_UP_DISABLED', this.playerId)
        }

        oldFlyUp = this.flyUp
      }
    })
  }
}
