import { AbstractMesh, Mesh, Scene } from '@babylonjs/core'
import { Store } from 'vuex'

export default class Finish {
  doorFinishMesh: Mesh
  finishMesh: Mesh
  meshFoot: Mesh
  doorFinishOpen: boolean
  doorFinishStartPositionY: number
  doorHeight: number
  store: Store<any>
  scene: Scene

  constructor (scene: Scene, meshFoot: Mesh, store: Store<any>) {
    this.doorFinishOpen = false
    this.meshFoot = meshFoot
    this.doorFinishStartPositionY = 0
    this.doorHeight = 0
    this.store = store
    this.scene = scene

    this.doorFinishMesh = scene.getMeshById('door_finish_col_vis_') as Mesh
    this.finishMesh = scene.getMeshById('finish') as Mesh


    if (this.doorFinishMesh && this.finishMesh) {
      const boundInfo = this.doorFinishMesh.getBoundingInfo()

      if (boundInfo) {
        const bound = boundInfo.boundingBox
        this.doorHeight = Math.abs(bound.minimumWorld.y - bound.maximumWorld.y)

        this.doorFinishStartPositionY = this.doorFinishMesh.position.y

        scene.onBeforeRenderObservable.add(() => {
          this.beforeRender()
        })
      }
    }
  }

  beforeRender () {
    if (this.store.state.level.keysActiveCount === this.store.state.level.keys.length) {
      if (!this.doorFinishOpen) {
        if (this.doorFinishMesh.position.y < this.doorFinishStartPositionY + this.doorHeight) {
          this.doorFinishMesh.position.y += 0.1
        } else {
          this.doorFinishOpen = true
        }
      }
    }

    if (!this.store.state.level.finish && this.meshFoot.intersectsMesh(this.finishMesh, false)) {
      this.store.commit('SET_FINISH')
    }
  }
}