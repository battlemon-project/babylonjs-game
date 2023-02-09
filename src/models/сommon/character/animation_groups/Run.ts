import { AnimationGroup, Scene } from '@babylonjs/core'
import { AnimationGroupInterface } from './AnimationGroupInterface'

export default class Run implements AnimationGroupInterface {
  animation: AnimationGroup | null
  playerId: string
  weight: number
  autoPlayLoop: boolean
  scene: Scene
  
  constructor (playerId: string) {
    this.playerId = playerId
    this.weight = 0
    this.autoPlayLoop = true
    this.scene = globalThis.scene
    this.animation = this.scene.getAnimationGroupByName('Run_' + playerId)
    
    this.setAnimations()
  }
  
  setAnimations () {
    if (this.animation === null) {
      console.error('Not find Run animation')
      return
    }
    
    this.animation.name = 'Run_' + this.playerId
    this.animation.setWeightForAllAnimatables(this.weight)
    this.animation.play(true)
  }
}
