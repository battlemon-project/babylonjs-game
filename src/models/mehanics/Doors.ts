import { Mesh, Scene, AnimationGroup } from '@babylonjs/core'
import { Helpers } from '@/models/Helpers'
import DoorSound from '@/models/sounds/Door'

export default class Doors {
  scene: Scene
  meshesDetectors: Array<Mesh>
  doorOpen: boolean
  collect: Array<any>
  sound: DoorSound

  constructor () {
    this.scene = globalThis.scene
    this.meshesDetectors = Helpers.getMeshesByName('DOOR_DETECTED', true)
    this.doorOpen = false
    this.sound = new DoorSound()
    this.collect = []

    this.setCollection()
    this.run()
  }

  private setCollection() {
    this.meshesDetectors.forEach(meshDetector => {
      const nameId = Helpers.getNameId(meshDetector.id)
      const meshLeft = this.scene.getMeshById('DOOR_LEFT.' + nameId)
      const meshRight = this.scene.getMeshById('DOOR_RIGHT.' + nameId)
      const meshCastle = this.scene.getMeshById('DOOR_CASTLE.' + nameId)
      meshDetector.isVisible = false

      if (meshLeft && meshRight && meshCastle) {
        const animationGroup = new AnimationGroup('door_' + nameId)

        meshLeft.animations.forEach(animation => {
          animationGroup.addTargetedAnimation(animation, meshLeft)
        })

        meshCastle.animations.forEach(animation => {
          animationGroup.addTargetedAnimation(animation, meshCastle)
        })

        meshRight.animations.forEach(animation => {
          animationGroup.addTargetedAnimation(animation, meshRight)
        })

        animationGroup.normalize(0, 35)

        this.collect.push({
          open: false,
          meshLeft,
          meshRight,
          meshDetector,
          animationGroup
        })
      }
    })
  }

  private run () {
    setInterval(() => {
      this.collect.forEach(door => {
        const foots = this.scene.getMeshesByTags("foot")
        let foodCollision = false
        
        foots.forEach((meshFoot) => {
          if (door.meshDetector.intersectsMesh(meshFoot, true)) {
            foodCollision = true
          }
        })
  
        if (!door.open && !door.animationGroup.isPlaying && foodCollision) {
          door.open = true
          door.animationGroup.start(false, 1, 0, 15)
          this.sound.playOpen(door.meshRight)
        }
  
        if (door.open && !door.animationGroup.isPlaying && !foodCollision) {
          door.open = false
          door.animationGroup.start(false, 1, 20, 35)
          this.sound.playClose(door.meshLeft)
        }
      })
    }, 100)
  }
}