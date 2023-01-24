import SubscribeStore from '../SubscribeStore'
import { Scalar, Scene, AnimationEvent } from '@babylonjs/core'
import { AnimationGroupInterface } from './animation_groups/AnimationGroupInterface'
import Idle from './animation_groups/Idle'
import Run from './animation_groups/Run'
import JumpMiddle from './animation_groups/JumpMiddle'
import JumpFinish from './animation_groups/JumpFinish'
import store from '@/store'
import { Move } from '@/store/players/types'
import Sprint from '@/models/сommon/character/animation_groups/Sprint'

export default class Animation {
  playerId: string
  animationGroupCurrent: AnimationGroupInterface | undefined
  animationGroups: Array<AnimationGroupInterface>
  store: any
  scene: Scene
  observableBeforeAnimation: any
  subscribeStore?: SubscribeStore | null

  constructor (playerId: string, scene: Scene) {
    this.playerId = playerId
    this.store = store
    this.scene = scene
    this.animationGroups = []
    this.animationGroupCurrent = undefined

    this.setAnimationGroups()

    this.observableBeforeAnimation = () => {
      this.onBeforeAnimation()
    }
  }

  private setAnimationGroups () {
    const idle = new Idle(this.playerId, this.scene)
    this.pushAnimation(idle)
    this.pushAnimation(new Run(this.playerId, this.scene))
    this.pushAnimation(new Sprint(this.playerId, this.scene))
    this.pushAnimation(new JumpMiddle(this.playerId, this.scene))
    this.pushAnimation(new JumpFinish(this.playerId, this.scene))
    
    
    if (idle.animation) {
      this.animationGroupCurrent = this.getAnimationByName('Idle_' + this.playerId)
      this.subscribe()
    }
  }
  
  private pushAnimation (animation: AnimationGroupInterface) {
    if (animation.animation) {
      this.animationGroups.push(animation)
    }
  }

  private getAnimationByName (name: string) {
    return this.animationGroups.find(group => group.animation && group.animation.name.includes(name)) as AnimationGroupInterface
  }

  private subscribe () {
    this.subscribeStore = new SubscribeStore(this.playerId)
    const animationJumpMiddle = this.getAnimationByName('JumpMiddle_' + this.playerId)
    const animationJumpFinish = this.getAnimationByName('JumpFinish_' + this.playerId)
  
    this.subscribeStore.move((move: Move) => {
      if (!move.isFly && !move.jump) {
        this.blending(this.getAnimationByState())
      }
    })
  
    this.subscribeStore.fly(() => {
      this.blending(animationJumpMiddle)
    })
  
    if (animationJumpFinish && animationJumpFinish.animation) {
      this.subscribeStore.flyEnd(() => {
        this.blending(animationJumpFinish)
        if (animationJumpFinish.animation) {
          animationJumpFinish.animation.play()
        }
        
      })
  
      const jumpFinishAnimation = animationJumpFinish.animation.targetedAnimations[0].animation
  
      const JumpFinishAnimationEvent = new AnimationEvent(25, () => {
        this.blending(this.getAnimationByState())
      })
  
      jumpFinishAnimation.addEvent(JumpFinishAnimationEvent)
    }
  }
  
  private getAnimationByState() {
    const statePlayer = store.getters.getPlayerById(this.playerId)
    const move = statePlayer.move
    const animationIdle = this.getAnimationByName('Idle_' + this.playerId)
    const animationRun = this.getAnimationByName('Run_' + this.playerId)
    const animationSprint = this.getAnimationByName('Sprint_' + this.playerId)
    
    let animation = animationIdle
  
    if (move.forward.isMoving) {
      animation = animationRun
      if (move.forward.sprint) {
        animation = animationSprint
      }
    }
    
    return animation
  }

  private blending (animationGroup: AnimationGroupInterface) {
    if (this.animationGroupCurrent === animationGroup) {
      return
    }

    this.scene.onBeforeAnimationsObservable.removeCallback(this.observableBeforeAnimation)

    this.animationGroupCurrent = animationGroup
    this.scene.onBeforeAnimationsObservable.add(this.observableBeforeAnimation)
  }

  private onBeforeAnimation () {
    if (this.animationGroupCurrent && this.animationGroupCurrent.animation) {
      const weight = Scalar.Clamp(this.animationGroupCurrent.weight + 0.08, 0, 1)
      this.animationGroupCurrent.weight = Number(weight.toFixed(2))
      this.animationGroupCurrent.animation.setWeightForAllAnimatables(this.animationGroupCurrent.weight)
    }

    this.animationGroups.forEach(animationGroup => {
      if (animationGroup.animation &&animationGroup.weight !== 0 && animationGroup !== this.animationGroupCurrent) {
        const weight = Scalar.Clamp(animationGroup.weight - 0.08, 0, 1)
        animationGroup.weight = Number(weight.toFixed(2))
        animationGroup.animation.setWeightForAllAnimatables(animationGroup.weight)

        if (!animationGroup.autoPlayLoop && animationGroup.weight === 0) {
          animationGroup.animation.stop()
        }
      }
    })

    if (this.animationGroupCurrent && this.animationGroupCurrent.weight === 1) {
      this.scene.onBeforeAnimationsObservable.removeCallback(this.observableBeforeAnimation)
    }
  }
  
  dispose () {
    this.subscribeStore?.unsubscribeAll()
    this.scene.onBeforeAnimationsObservable.removeCallback(this.observableBeforeAnimation)
  }
}
