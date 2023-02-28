import { PointLight, Scene, Vector3, Animation, AbstractMesh } from '@babylonjs/core'
import store from '@/store'

export default class LightPoints {
  meshFoot: AbstractMesh | null
  scene: Scene
  intensity: number
  radius: number
  maxLights: number
  sceneLights: Array<any>
  collectManagerLight: Array<any>

  constructor () {
    this.meshFoot = scene.getMeshById('playerFoot_' + store.state.player.id)
    this.scene = globalThis.scene
    this.intensity = 300
    this.radius = 15
    this.maxLights = 5
    this.sceneLights = []
    this.collectManagerLight = []

    this.setupLights()
  }

  private setupLights () {
    const lights = [...this.scene.lights.filter(light => light.id !== 'playerLightShadow')]

    lights.forEach(light => {
      if (light instanceof PointLight) {
        this.sceneLights.push(light)
        this.scene.removeLight(light)
      }
    })
    
    if (!this.sceneLights.length) {
      console.info('Not set light points for class LightPoints')
      return null
    }

    let i = 0
    while (this.maxLights > i && this.sceneLights.length >= i) {
      const light = new PointLight('pointLight' + i, new Vector3(0, 0, 0), this.scene)
      light.intensity = 0

      const animation = new Animation('lightAnimation' + i, 'intensity', 30, Animation.ANIMATIONTYPE_FLOAT)

      this.collectManagerLight.push({
        animated: false,
        refId: null,
        light,
        animation,
        animationPlay: null
      })

      i++
    }

    this.scene.materials.forEach((material: any) => {
      material.maxSimultaneousLights = this.maxLights
      //material.forceCompilationAsync()
    })
  
    setInterval(() => {
      this.runLights()
    }, 200)
  }

  private animateEnable (item: any) {
    const light = item.light
    item.animated = true

    if (item.animationPlay) {
      item.animationPlay.pause()
    }

    const keys = []
    keys.push({ frame: 0, value: light.intensity })
    keys.push({ frame: 100, value: this.intensity })
    item.animation.setKeys(keys)
    light.animations[0] = item.animation

    item.animationPlay = this.scene.beginAnimation(light, 0, 100, false, 1, () => {
      item.animated = false
    })
  }

  private animateDisabled (item: any) {
    const light = item.light
    const frames = 20
    
    item.animated = true

    if (item.animationPlay) {
      item.animationPlay.pause()
    }

    const keys = []
    keys.push({ frame: 0, value: light.intensity })
    keys.push({ frame: frames, value: 0 })
    item.animation.setKeys(keys)
    light.animations[0] = item.animation

    item.animationPlay = this.scene.beginAnimation(light, 0, frames, false, 1, () => {
      item.animated = false
      item.refId = null
    })
  }

  private runLights () {
    if (!this.meshFoot) {
      throw 'Not set mesh foot'
    }
    
    const meshFoot = this.meshFoot
    const meshFootPosition = this.meshFoot.getAbsolutePosition()
    
    this.sceneLights.sort((a, b) => {
      const lengthDistA = a.position.subtract(meshFoot.position).length()
      const lengthDistB = b.position.subtract(meshFoot.position).length()
      return lengthDistA < lengthDistB ? -1 : 1
    })
    
    let i = 0
    while (this.maxLights > i && this.sceneLights.length >= i) {
      const sceneLight = this.sceneLights[i]
      const lightPosition = sceneLight.getAbsolutePosition()
      const dx = Math.abs(lightPosition.x - meshFootPosition.x)
      const dz = Math.abs(lightPosition.z - meshFootPosition.z)
  
      const itemSearch = this.collectManagerLight.find(item => item.refId == sceneLight.id)
  
      if (dx + dz <= this.radius) {
        if (!itemSearch) {
          const freeItem = this.collectManagerLight.find(item => !item.refId)
      
          if (freeItem) {
            freeItem.refId = sceneLight.id
        
            const light = freeItem.light
            light.position = sceneLight.position
            light.range = sceneLight.range
            light.radius = sceneLight.radius
            light.specular = sceneLight.specular
            light.diffuse = sceneLight.diffuse
        
            this.animateEnable(freeItem)
          }
        }
    
      } else {
        if (itemSearch) {
          this.animateDisabled(itemSearch)
        }
      }
      
      i++
    }
  }
}