import { AnimationGroup, Scene } from '@babylonjs/core'
import { AnimationGroupInterface } from './AnimationGroupInterface'

export default class JumpMiddle implements AnimationGroupInterface {
  animation: AnimationGroup | null
  playerId: string
  weight: number
  autoPlayLoop: boolean
  scene: Scene

  //TODO: классы получились очень похожие, можно наследовать эти методы у общего класса
  constructor (playerId: string, scene: Scene) {
    this.playerId = playerId
    this.weight = 0
    this.autoPlayLoop = true
    this.scene = scene
    this.animation = this.scene.getAnimationGroupByName('JumpMiddle')

    this.setAnimations()
  }

  setAnimations () {
    if (!this.animation) {
      console.error('Not find JumpMiddle animation')
      return
    }

    this.animation.name = 'JumpMiddle_' + this.playerId
    this.animation.setWeightForAllAnimatables(this.weight)
    this.animation.play(true)
  }
}
