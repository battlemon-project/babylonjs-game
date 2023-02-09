import { AnimationGroup, Scene } from '@babylonjs/core'
import { AnimationGroupInterface } from './AnimationGroupInterface'

export default class JumpFinish implements AnimationGroupInterface {
  animation: AnimationGroup | null
  playerId: string
  weight: number
  autoPlayLoop: boolean
  scene: Scene

  constructor (playerId: string) {
    this.playerId = playerId
    this.weight = 0
    this.autoPlayLoop = false
    this.scene = globalThis.scene
    this.animation = this.scene.getAnimationGroupByName('JumpFinish_' + playerId)

    this.setAnimations()
  }

  setAnimations () {
    if (!this.animation) {
      console.error('Not find JumpFinish animation')
      return
    }
    
    this.animation.name = 'JumpFinish_' + this.playerId
    this.animation.setWeightForAllAnimatables(this.weight)
    this.animation.stop()
  }
}
