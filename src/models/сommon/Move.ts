import {
  Mesh,
  Vector3,
  RollingAverage,
  Scene,
  AbstractMesh,
  Animation,
  SineEase,
  EasingFunction,
  Tools, Nullable, Observer
} from '@babylonjs/core'
import Collisions from '../mehanics/Collisions'
import store from '@/store/index'
import { Forward } from '@/store/players/types'
import { Helpers } from '@/models/Helpers'

const DEFAULT_SPEED = 0.07
const SPRINT_SPEED = 0.12
const GRAVITY = 0.08
const JUMP_HEIGHT = 1.5

export default class Move {
  meshHead: Mesh
  meshFoot: Mesh
  speed: number
  scene: Scene
  footIsCollision: AbstractMesh | boolean
  jumpAnimation: Animation | boolean
  animationJumpFrames: number
  modelCollisions: Collisions
  store: any
  forward: Forward
  fly: boolean
  flyUp: boolean
  playerId: string
  flyModeTimerId: number
  observerBefore?: Nullable<Observer<Scene>>
  observerAfter?: Nullable<Observer<Scene>>
  rollingAverage: RollingAverage
  
  constructor (playerId: string, scene: Scene) {
    this.scene = scene
    this.store = store
    this.meshFoot = this.scene.getMeshById('playerFoot_' + playerId) as Mesh
    this.meshHead = this.scene.getMeshById('playerHead_' + playerId) as Mesh
    this.modelCollisions = new Collisions()
    
    this.fly = true
    this.flyModeTimerId = 0
    this.flyUp = false
    this.playerId = playerId
    this.animationJumpFrames = 55
    this.footIsCollision = false
    this.jumpAnimation = false
    this.rollingAverage = new RollingAverage(60)
    
    this.forward = {
      left: false,
      right: false,
      front: false,
      back: false,
      isMoving: false,
      sprint: false
    }
    
    this.speed = DEFAULT_SPEED
    this.createJumpAnimation()
    
    this.observerBefore = this.scene.onBeforeRenderObservable.add(() => {
      this.beforeRender()
    })
  
    this.observerAfter = this.scene.onAfterRenderObservable.add(() => {
      this.afterRender()
    })
  }
  
  private createJumpAnimation () {
    this.jumpAnimation = new Animation('jump', 'position.y', 100,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE
    )
    
    const easingFunction = new SineEase()
    easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEOUT)
    this.jumpAnimation.setEasingFunction(easingFunction)
  }
  
  private setAverage () {
    this.rollingAverage.add(this.scene.getAnimationRatio())
  }
  
  private move () {
    if (!this.forward.isMoving) {
      return null
    }

    this.changeSpeed()
    
    const nextStep = Vector3.Zero()
    const average = this.rollingAverage.average
    
    if (this.forward.front) {
      nextStep.z = Helpers.numberFixed(average * this.speed)
    }
    
    if (this.forward.back) {
      nextStep.z = Helpers.numberFixed(average * -this.speed)
    }
    
    if (this.forward.left) {
      nextStep.x = Helpers.numberFixed( average * -this.speed)
    }
    
    if (this.forward.right) {
      nextStep.x = Helpers.numberFixed(average * this.speed)
    }
    
    this.setNewPosition(nextStep)
  }
  
  private gravity () {
    if (!this.footIsCollision) {
      const nextStep = Vector3.Zero()
      
      nextStep.y = Helpers.numberFixed(this.rollingAverage.average * -GRAVITY, 4)
      this.setNewPosition(nextStep)
      
      if (!this.fly && !this.flyModeTimerId) {
        //Маленькие полеты не считаем за полет
        this.flyModeTimerId = setTimeout(() => {
          this.fly = true
        }, 100)
      }
    } else {
      clearTimeout(this.flyModeTimerId)
      this.flyModeTimerId = 0
      
      if (this.fly) {
        this.fly = false
      }
    }
  }
  
  jump () {
    if (typeof this.jumpAnimation !== 'object') {
      console.error('Jump not set animation')
      return
    }
    
    if (this.footIsCollision) {
      const keys = [
        { frame: 0, value: this.meshFoot.position.y },
        { frame: this.animationJumpFrames, value: this.meshFoot.position.y + JUMP_HEIGHT }
      ]
      
      this.jumpAnimation.setKeys(keys)
      this.meshFoot.animations = [this.jumpAnimation]
      this.flyUp = true
      this.scene.beginDirectAnimation(
        this.meshFoot,
        [this.jumpAnimation],
        0,
        this.animationJumpFrames,
        false,
        1.8,
        () => {
          this.flyUp = false
        })
    }
  }
  
  private setNewPosition (nextStep: Vector3) {
    const matrix = this.meshFoot.getWorldMatrix()
    const vector = Vector3.TransformNormal(nextStep, matrix)
    this.meshFoot.moveWithCollisions(vector)
  }
  
  rotate (rotateX: number, rotateY: number) {
    this.meshHead.rotation.x += rotateX
    this.meshFoot.rotation.y += rotateY
    
    if (this.meshHead.rotation.x > Tools.ToRadians(90)) {
      this.meshHead.rotation.x = Tools.ToRadians(90)
    }
    
    if (this.meshHead.rotation.x < -Tools.ToRadians(45)) {
      this.meshHead.rotation.x = -Tools.ToRadians(45)
    }
  }
  
  private changeSpeed () {
    this.speed = this.forward.sprint ? SPRINT_SPEED : DEFAULT_SPEED
  }
  
  private beforeRender () {
    this.setAverage()
    this.footIsCollision = this.modelCollisions.checkCollisionFloor(this.meshFoot)
    this.move()
  }
  
  private afterRender () {
    this.footIsCollision = this.modelCollisions.checkCollisionFloor(this.meshFoot)
    this.gravity()
  }
  
  dispose () {
    if (this.observerBefore) {
      this.scene.onBeforeRenderObservable.remove(this.observerBefore)
    }
  
    if (this.observerAfter) {
      this.scene.onBeforeRenderObservable.remove(this.observerAfter)
    }
  }
}
