import { Mesh, Scene, ParticleSystem, Color4, Vector3, Texture, AbstractMesh } from '@babylonjs/core'
import { Helpers } from '@/models/Helpers'
import store from '@/store'

export default class ChargingStations {
  scene: Scene
  store: any
  meshFoot: AbstractMesh
  stationsMeshes: Array<Mesh>
  charging: boolean
  chargingAnimationId: number | undefined
  chargingAnimationDownId: number | undefined

  //TODO: стоит переделать store, так чтобы можно было хранить все заряды всех игроков
  constructor () {
    this.scene = globalThis.scene
    this.store = store
    this.charging = false
    this.chargingAnimationId = undefined
    this.chargingAnimationDownId = undefined

    this.meshFoot = scene.getMeshById('playerFoot_' + store.state.player.id) as AbstractMesh
    this.stationsMeshes = Helpers.getMeshesByName('CHARGING_DETECTED', true)

    this.stationsMeshes.forEach(mesh => {
      mesh.isVisible = false
      this.particle(mesh)
    })
  
    this.checkCollision()
  }

  private particle(meshStation: Mesh) {
    const particleSystem = new ParticleSystem('particles', 2000, this.scene)
    particleSystem.particleTexture = new Texture('/resources/graphics/textures/flare.png', this.scene)
    particleSystem.emitter = meshStation // the starting object, the emitter
    particleSystem.minEmitBox = new Vector3(-1, -0.5, -1) // Starting all from
    particleSystem.maxEmitBox = new Vector3(1.2, 0, 1) // To...

    // Size of each particle (random between...
    particleSystem.minSize = 0.01
    particleSystem.maxSize = 0.1

    // Life time of each particle (random between...
    particleSystem.minLifeTime = 0.1
    particleSystem.maxLifeTime = 0.4

    // Emission rate
    particleSystem.emitRate = 1000

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE

    // Set the gravity of all particles
    particleSystem.gravity = new Vector3(0, -9.81, 0)

    // Direction of each particle after it has been emitted
    particleSystem.direction1 = new Vector3(0, 0.6, 0)
    particleSystem.direction2 = new Vector3(0, 1.2, 0)

    particleSystem.color1 = new Color4(0.42, 1, 0.19)
    particleSystem.color2 = new Color4(0, 1, 0.38)
    particleSystem.colorDead = new Color4(1, 0.98, 0.03)
    
    // Set the gravity of all particles
    particleSystem.gravity = new Vector3(0, -4, 0)

    // Angular speed, in radians
    particleSystem.minAngularSpeed = 0
    particleSystem.maxAngularSpeed = Math.PI

    // Speed
    particleSystem.minEmitPower = 1
    particleSystem.maxEmitPower = 2
    particleSystem.updateSpeed = 0.002

    particleSystem.isLocal = true

    // Start the particle system
    particleSystem.start()
  }

  private runCharging () {
    clearInterval(this.chargingAnimationDownId)

    this.chargingAnimationId = setInterval(() => {
      this.store.commit('CHARGE_BATTERY_UP', 30)
    }, 500)
  }

  private destroyCharging () {
    if (this.chargingAnimationId) {
      clearInterval(this.chargingAnimationId)

      this.chargingAnimationDownId = setInterval(() => {
        if (this.store.state.level.batteryCharge <= 0) {
          clearInterval(this.chargingAnimationDownId)
        }

        this.store.commit('CHARGE_BATTERY_DOWN', 20)
      }, 1000)
    }
  }

  private checkCollision () {
    setInterval(() => {
      this.stationsMeshes.forEach(meshStation => {
        if (meshStation.intersectsMesh(this.meshFoot, false)) {
          if (!this.charging) {
            this.charging = true
            this.runCharging()
          }
        } else {
          if (this.charging) {
            this.charging = false
            this.destroyCharging()
          }
        }
      })
    }, 100)
  }
}