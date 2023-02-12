import store from "@/store";
import { isEqual } from 'lodash'

export default class SubscribeStore {
  playerId: string
  store: any
  unsubscribes: Array<any>

  constructor (playerId: string) {
    this.playerId = playerId
    this.store = store
    this.unsubscribes = []
    
    this.dispose()
  }
  
  move (callbackEvent: any) {
    let oldMove = {}
    
    const unsubscribe = this.store.subscribe(() => {
      const state = this.getPlayerById()
      if (!state) {
        return null
      }
      
      const stateMove = state.move
      const equal = isEqual(oldMove, stateMove)
      
      if (!equal) {
        oldMove = { ...stateMove }
        callbackEvent(stateMove)
      }
    })
    
    this.unsubscribes.push({
      name: 'move',
      unsubscribe
    })
  }

  forward (callbackEvent: any) {
    let oldForward = {
      left: false,
      right: false,
      front: false,
      back: false,
      isMoving: false
    }
  
    const unsubscribe = this.store.subscribe(() => {
      const state = this.getPlayerById()
      if (!state) {
        return null
      }
      
      const stateForward = state.move.forward
      const equal = isEqual(oldForward, stateForward)

      if (!equal) {
        oldForward = { ...stateForward }
        callbackEvent(stateForward)
      }
    })
  
    this.unsubscribes.push({
      name: 'forward',
      unsubscribe
    })
  }

  jump (callbackEvent: any) {
    let oldStateJump = false
  
    const unsubscribe = this.store.subscribe(() => {
      const state = this.getPlayerById()
      if (!state) {
        return null
      }
      
      const stateMove = state.move

      if (oldStateJump !== stateMove.jump) {
        oldStateJump = stateMove.jump
  
        callbackEvent(stateMove.jump)
      }
    })
  
    this.unsubscribes.push({
      name: 'jump',
      unsubscribe
    })
  }

  fly (callbackEvent: any) {
    let oldState = true
  
    const unsubscribe = this.store.subscribe(() => {
      const state = this.getPlayerById()
      if (!state) {
        return null
      }
      
      const stateMove = state.move

      if (oldState !== stateMove.isFly) {
        oldState = stateMove.isFly
        
        if (stateMove.isFly) {
          callbackEvent(state)
        }
      }
    })
  
    this.unsubscribes.push({
      name: 'fly',
      unsubscribe
    })
  }

  flyEnd (callbackEvent: any) {
    let oldState = true
  
    const unsubscribe = this.store.subscribe(() => {
      const state = this.getPlayerById()
      if (!state) {
        return null
      }
      
      const stateMove = state.move

      if (oldState !== stateMove.isFly) {
        oldState = stateMove.isFly
        
        if (!stateMove.isFly) {
          callbackEvent(state)
        }
      }
    })
  
    this.unsubscribes.push({
      name: 'flyEnd',
      unsubscribe
    })
  }

  rotate (callbackEvent: any) {
    const oldStateRotate = {
      rotateX: 0,
      rotateY: 0
    }
  
    const unsubscribe = this.store.subscribe(() => {
      const state = this.getPlayerById()
      if (!state) {
        return null
      }
      
      const stateMove = state.move

      if (oldStateRotate.rotateX !== stateMove.rotate.x || oldStateRotate.rotateY !== stateMove.rotate.y) {
        oldStateRotate.rotateX = stateMove.rotate.x
        oldStateRotate.rotateY = stateMove.rotate.y
        callbackEvent(stateMove.rotate.x, stateMove.rotate.y)
      }
    })
  
    this.unsubscribes.push({
      name: 'rotate',
      unsubscribe
    })
  }

  position (callbackEvent: any) {
    let oldStatePosition = {
      x: 0,
      y: 0,
      z: 0
    }
  
    const unsubscribe = this.store.subscribe(() => {
      const state = this.getPlayerById()
      if (!state) {
        return null
      }
  
      const stateMove = state.move
      const statePosition = stateMove.syncData.position

      if (!isEqual(statePosition, oldStatePosition)) {
        oldStatePosition = { ...statePosition }
        callbackEvent(statePosition)
      }
    })
  
    this.unsubscribes.push({
      name: 'position',
      unsubscribe
    })
  }

  rotation (callbackEvent: any) {
    let oldStateRotation = {
      x: 0,
      y: 0
    }
  
    const unsubscribe = this.store.subscribe(() => {
      const state = this.getPlayerById()
      if (!state) {
        return null
      }
  
      const stateMove = state.move
      const stateRotation = stateMove.syncData.rotation

      if (!isEqual(stateRotation, oldStateRotation)) {
        oldStateRotation = { ...stateRotation }
        callbackEvent(stateRotation)
      }
    })
  
    this.unsubscribes.push({
      name: 'rotation',
      unsubscribe
    })
  }
  
  syncData (callbackEvent: any) {
    let oldSyncData = {}
  
    const unsubscribe = this.store.subscribe(() => {
      const state = this.getPlayerById()
      if (!state) {
        return null
      }
  
      const stateMove = state.move
      const syncData = stateMove.syncData
    
      if (!isEqual(syncData, oldSyncData)) {
        oldSyncData = {...syncData}
        callbackEvent(syncData)
      }
    })
  
    this.unsubscribes.push({
      name: 'syncData',
      unsubscribe
    })
  }
  
  syncPlayer (callbackEvent: any) {
    let oldPlayer = {}
  
    const unsubscribe = this.store.subscribe(() => {
      const state = this.getPlayerById()
      if (!state) {
        return null
      }
    
      if (!isEqual(state, oldPlayer)) {
        oldPlayer = JSON.parse(JSON.stringify(state))
        callbackEvent(state)
      }
    })
  
    this.unsubscribes.push({
      name: 'syncPlayer',
      unsubscribe
    })
  }

  getPlayerById () {
    const state = store.getters.getPlayerById(this.playerId)
    
    if (!state) {
      console.info('SubscribeStore: not found state by playerId: ' + this.playerId)
      this.unsubscribeAll()
    }
    
    return state
  }
  
  private dispose()
  {
    const unsubscribe = this.store.subscribe(() => {
      const player = store.getters.getPlayerById(this.playerId)
      
      if (!player) {
        this.unsubscribeAll()
      }
    })
  
    this.unsubscribes.push({
      name: 'dispose',
      unsubscribe
    })
  }
  
  unsubscribeAll() {
    this.unsubscribes.forEach((item) => {
      item.unsubscribe()
    })
  }
}
