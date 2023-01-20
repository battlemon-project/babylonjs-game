import { AnimationGroup, Scene } from '@babylonjs/core'
import { AnimationGroupInterface } from './AnimationGroupInterface'

export default class Sprint implements AnimationGroupInterface {
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
    this.animation = this.scene.getAnimationGroupByName('Sprint')
    
    this.setAnimations()
  }
  
  setAnimations () {
    if (this.animation === null) {
      console.error('Not find Sprint animation')
      return
    }
    
    this.animation.name = 'Sprint_' + this.playerId
    this.animation.setWeightForAllAnimatables(this.weight)
    this.animation.play(true)
  }
}
