import { AnimationGroup, Scene } from '@babylonjs/core'
import { AnimationGroupInterface } from './AnimationGroupInterface'

export default class Walk implements AnimationGroupInterface {
  animation: AnimationGroup | null
  playerId: string
  weight: number
  autoPlayLoop: boolean
  scene: Scene

  constructor (playerId: string, scene: Scene) {
    this.playerId = playerId
    this.weight = 0
    this.autoPlayLoop = true
    this.scene = scene
    this.animation = this.scene.getAnimationGroupByName('Walk')

    this.setAnimations()
  }

  setAnimations () {
    if (this.animation === null) {
      console.error('Not find Walk animation')
      return
    }
  
    this.animation.name = 'Walk_' + this.playerId
    this.animation.setWeightForAllAnimatables(this.weight)
    this.animation.play(true)
  }
}
