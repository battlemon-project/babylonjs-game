import Move from './Move'
import SubscribeStore from '../сommon/SubscribeStore'
import { Scalar } from '@babylonjs/core'
import { Forward } from '@/store/players/types'

export default class Controller {
  move: Move
  playerId: string
  subscribeStore?: SubscribeStore | null

  constructor (playerId: string) {
    this.playerId = playerId
    this.move = new Move(playerId, globalThis.scene)
    this.subscribeStore = new SubscribeStore(this.playerId)
  }

  subscribe () {
    if (!this.subscribeStore) {
      return false
    }
    
    this.subscribeStore.rotate((rotateX: number, rotateY: number) => {
      this.move.rotate(rotateX, rotateY)
    })

    this.subscribeStore.forward((forward: Forward) => {
      this.move.forward = {...forward}
    })

    this.subscribeStore.jump((jump: boolean) => {
      if (jump) {
        this.move.jump()
      }
    })

    this.syncPosition()
    this.syncRotation()
  }
  
  dispose () {
    this.move.dispose()
  }

  private syncPosition () {
    if (!this.subscribeStore) {
      return false
    }
    
    let observerSyncCoordinate: any = null
    
    this.subscribeStore.position((position: any) => {
      if (observerSyncCoordinate) {
        this.move.scene.onBeforeRenderObservable.remove(observerSyncCoordinate)
        observerSyncCoordinate = null
      }

      const meshFoot = this.move.meshFoot
      const endX = Number(position.x.toFixed(5))
      const endY = Number(position.y.toFixed(5))
      const endZ = Number(position.z.toFixed(5))
      const startX = Number(meshFoot.position.x.toFixed(5))
      const startY = Number(meshFoot.position.y.toFixed(5))
      const startZ = Number(meshFoot.position.z.toFixed(5))

      if (!this.move.forward.isMoving &&
        (
          endX !== startX ||
          endY !== startY ||
          endZ !== startZ
        )
      ) {
        observerSyncCoordinate = this.move.scene.onBeforeRenderObservable.add(() => {
          meshFoot.position.x = Scalar.Lerp(meshFoot.position.x, endX, 0.4)
          meshFoot.position.y = Scalar.Lerp(meshFoot.position.y, endY, 0.4)
          meshFoot.position.z = Scalar.Lerp(meshFoot.position.z, endZ, 0.4)

          if (
            observerSyncCoordinate &&
            Number(meshFoot.position.x.toFixed(5)) === endX &&
            Number(meshFoot.position.y.toFixed(5)) === endY &&
            Number(meshFoot.position.z.toFixed(5)) === endZ) {
            this.move.scene.onBeforeRenderObservable.remove(observerSyncCoordinate)
            observerSyncCoordinate = null
          }
        })
      } else {
        if (observerSyncCoordinate) {
          this.move.scene.onBeforeRenderObservable.remove(observerSyncCoordinate)
          observerSyncCoordinate = null
        }
      }
    })
  }

  private syncRotation () {
    let observerSyncCoordinate: any = null
    if (!this.subscribeStore) {
      return false
    }
    
    this.subscribeStore.rotation((rotation: any) => {
      if (observerSyncCoordinate) {
        this.move.scene.onBeforeRenderObservable.remove(observerSyncCoordinate)
        observerSyncCoordinate = null
      }

      const meshHead = this.move.meshHead
      const meshFoot = this.move.meshFoot

      const endX = Number(rotation.x.toFixed(5))
      const endY = Number(rotation.y.toFixed(5))
      const startX = Number(meshHead.rotation.x.toFixed(5))
      const startY = Number(meshFoot.rotation.y.toFixed(5))

      if (endX !== startX || endY !== startY) {
        observerSyncCoordinate = this.move.scene.onBeforeRenderObservable.add(() => {
          meshHead.rotation.x = Scalar.Lerp(meshHead.rotation.x, endX, 0.4)
          meshFoot.rotation.y = Scalar.Lerp(meshFoot.rotation.y, endY, 0.4)

          if (
            observerSyncCoordinate &&
            Number(meshFoot.rotation.x.toFixed(5)) === endX &&
            Number(meshFoot.rotation.y.toFixed(5)) === endY
          ) {
            this.move.scene.onBeforeRenderObservable.remove(observerSyncCoordinate)
            observerSyncCoordinate = null
          }
        })
      } else {
        if (observerSyncCoordinate) {
          this.move.scene.onBeforeRenderObservable.remove(observerSyncCoordinate)
          observerSyncCoordinate = null
        }
      }
    })
  }
}
