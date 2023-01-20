import { AnimationGroup, Scene } from '@babylonjs/core'
import { AnimationGroupInterface } from './AnimationGroupInterface'

export default class Idle implements AnimationGroupInterface {
  playerId: string
  animation: AnimationGroup | null
  weight: number
  autoPlayLoop: boolean
  scene: Scene

  constructor (playerId: string, scene: Scene) {
    this.playerId = playerId
    this.weight = 1
    this.autoPlayLoop = true
    this.scene = scene
    this.animation = this.scene.getAnimationGroupByName('Idle')

    this.setAnimations()
  }
  
  setAnimations () {
    if (!this.animation) {
      console.error('Not find Idle animation')
      return
    }

    this.animation.name = 'Idle_' + this.playerId
    this.animation.setWeightForAllAnimatables(this.weight)
    this.animation.play(true)
  }
}
