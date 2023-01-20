import { Helpers } from '../Helpers'
import { AbstractMesh, AnimationGroup, Mesh, MorphTarget, Scene } from '@babylonjs/core'
import KeysInterface from '@/models/interfaces/Keys'
import Animation from '@/models/Animation'
import store from '@/store'

export default class Keys {
  scene: Scene
  store: any
  collect: Array<KeysInterface>
  meshFoot: Mesh
  animationIntervals: Array<number>
  animationButtonLightUp: boolean
  animationButtonLightUpId: number | null
  animationLineId: number | null
  timeOpen: number

  constructor () {
    this.scene = globalThis.scene
    this.store = store
    this.meshFoot = this.scene.getMeshById('playerFoot_' + store.state.player.id) as Mesh
    this.collect = []
    this.animationIntervals = []
    this.animationButtonLightUp = false
    this.animationButtonLightUpId = null
    this.animationLineId = null
    this.timeOpen = 7000

    this.setup()
    this.detectedButton()
    this.detectedLightButton()
    this.detectedKey()
  }

  private setup () {
    const meshesKeys = Helpers.getMeshesByName('KEY')

    meshesKeys.forEach((keyMesh: Mesh) => {
      const keyId = keyMesh.id.split('.')[1]
      const lineMesh = this.getMeshByName('KEY_LINE.' + keyId)
      const lightDetectedMesh = this.getMeshByName('KEY_BUTTON_LIGHT_DETECTED.' + keyId)
      const lightButtonMesh = this.getMeshByName('KEY_BUTTON_LIGHT.' + keyId)
      const buttonDetectedMesh = this.getMeshByName('KEY_BUTTON_DETECTED.' + keyId)
      const detectedMesh = this.getMeshByName('KEY_DETECTED.' + keyId)
      
      if (!this.meshFoot || !keyId || !buttonDetectedMesh || !lineMesh || !lightDetectedMesh || !lightButtonMesh || !detectedMesh) {
        throw new Error('Not load meshes for Key')
      }
      
      detectedMesh.isVisible = false
      buttonDetectedMesh.isVisible = false
      lightDetectedMesh.isVisible = false
      lineMesh.visibility = 0

      const morphTarget = lightButtonMesh.morphTargetManager
      let lightButtonMorphTarget = null

      if (morphTarget) {
        lightButtonMorphTarget = morphTarget.getTarget(0)
        lightButtonMorphTarget.influence = 0
      }

      this.collect.push({
        id: keyId,
        keyMesh,
        detectedMesh,
        buttonDetectedMesh,
        lineMesh,
        lightDetectedMesh,
        lightButtonMesh,
        lightButtonMorphTarget,
        animationGroup: this.getAnimationGroup(keyId),
        timeLastOpen: Helpers.getTime(),
        timeSetOpen: Helpers.getTime(),
        open: false,
        opened: false,
        down: false,
      })

      this.store.commit('ADD_KEY', {
        status: false,
        id: keyId
      })
    })
  }

  getAnimationGroup (keyId: string) {
    const meshesAnimate: Array<AbstractMesh> = []
    
    const mesh = this.getMeshByName('KEY.' + keyId)
    const mesh1 = this.getMeshByName('KEY_PODIUM1.' + keyId)
    const mesh2 = this.getMeshByName('KEY_PODIUM2.' + keyId)
    const mesh3 = this.getMeshByName('KEY_PODIUM3.' + keyId)
    const mesh4 = this.getMeshByName('KEY_PODIUM4.' + keyId)
    const mesh5 = this.getMeshByName('KEY_TRAPDOOR.' + keyId)

    if (!mesh || !mesh1 || !mesh2 || !mesh3 || !mesh4 || !mesh5) {
      throw new Error('Not load meshes for animate Key')
    }
  
    meshesAnimate.push(mesh)
    meshesAnimate.push(mesh1)
    meshesAnimate.push(mesh2)
    meshesAnimate.push(mesh3)
    meshesAnimate.push(mesh4)
    meshesAnimate.push(mesh5)

    const animationGroup = new AnimationGroup('key_' + keyId)

    meshesAnimate.forEach(mesh => {
      mesh.animations.forEach(animation => {
        animationGroup.addTargetedAnimation(animation, mesh)
      })
    })

    animationGroup.normalize(0, 120)

    animationGroup.onAnimationGroupEndObservable.add(() => {
      const key = this.collect.find(key => key.id == keyId)
      if (key && key.open) {
        key.opened = true
      }
    })

    animationGroup.onAnimationGroupPlayObservable.add(() => {
      const key = this.collect.find(key => key.id == keyId)
      if (key && !key.open) {
        key.opened = false
      }
    })

    return animationGroup
  }

  detectedLightButton () {
    setInterval(() => {
      this.collect.forEach(key => {
        if (!this.animationButtonLightUp && key.lightDetectedMesh.intersectsMesh(this.meshFoot, false)) {
          this.animationButtonLightUp = true
          if (key.lightButtonMorphTarget) {
            this.lightButtonAnimateUp(key.lightButtonMorphTarget)
          }
        }
      })
    }, 100)
  }

  lightButtonAnimateUp (morphTarget: MorphTarget) {
    const animation = new Animation()

    this.animationButtonLightUpId = animation.animate({
      duration: 1000,
      easing: animation.easeOutSine,
      draw: (progress: any) => {
        const step = progress

        if (step >= 1 && this.animationButtonLightUpId) {
          cancelAnimationFrame(this.animationButtonLightUpId)
          this.animationButtonLightUpId = null
        } else {
          morphTarget.influence = step
        }
      }
    })
  }

  private detectedButton () {
    setInterval(() => {
      this.collect.forEach(key => {
        const foots = this.scene.getMeshesByTags("foot")
        let foodCollision = false
  
        foots.forEach((meshFoot) => {
          if (key.buttonDetectedMesh.intersectsMesh(meshFoot, false)) {
            foodCollision = true
          }
        })
        
        if (!key.open && foodCollision) {
          key.open = true
          this.animateLinesRun(key.lineMesh)
          key.animationGroup.start(false, 1, 0, 110)
          key.timeSetOpen = Helpers.getTime()
        }

        if (key.open && Helpers.getTime() > key.timeSetOpen + this.timeOpen) {
          key.open = false
          key.animationGroup.start(false, 1, 150, 230)
          this.animateLinesStop(key.lineMesh)
        }
      })
    }, 100)
  }

  private detectedKey () {
    setInterval(() => {
      this.collect.forEach(key => {
        if (key.opened && key.detectedMesh.intersectsMesh(this.meshFoot, false)) {
          const keyStore = this.store.state.level.keys.find((item: { id: string }) => item.id == key.id)
          if (keyStore && !keyStore.status) {
            this.store.commit('SET_ACTIVE_KEY', key.id)
            key.keyMesh.dispose()
            key.detectedMesh.dispose()
          }
        }
      })
    }, 50)
  }

  private animateLinesRun (lineMesh: AbstractMesh) {
    let visibility = 0

    this.animationLineId = setInterval(() => {
      visibility += 0.1
      lineMesh.visibility = Math.cos(visibility) * 0.5 + 0.5
    }, 50)
  }

  private animateLinesStop (lineMesh: AbstractMesh) {
    lineMesh.visibility = 0
    if (this.animationLineId) {
      clearInterval(this.animationLineId)
    }
  }
  
  private getMeshByName(name: string) {
    const mesh = this.scene.getMeshById(name)
    
    if (!mesh) {
      console.error('Keys: mesh not find' + name)
      return null
    }
    
    return mesh
  }
}
