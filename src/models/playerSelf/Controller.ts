import { Scene, KeyboardEventTypes } from '@babylonjs/core'
import Move from './Move'
import store from '@/store'
import { isEqual } from 'lodash'

export default class Controller {
  sensitiveMouse: number
  mouseIsCaptured: boolean | Element
  store: any
  scene: Scene
  playerId: string
  move: Move
  
  constructor () {
    this.sensitiveMouse = 0.002
    this.mouseIsCaptured = false
    this.scene = globalThis.scene
    this.store = store
    this.playerId = store.state.player.id
    this.move = new Move(this.playerId, scene)
    
    this.mouseEvent()
    
    this.scene.onKeyboardObservable.add(event => {
      this.keyEvent(event)
    })
  }
  
  private keyEvent (e: any) {
    const state = store.getters.getPlayerById(this.playerId)
    const stateMove = state.move
    const eventCode = e.event.code
    const eventType = e.type
    let jump = false
    
    if (KeyboardEventTypes.KEYDOWN === eventType) {
      if (eventCode === 'KeyW') {
        this.move.forward.front = true
      }
      
      if (eventCode === 'KeyS') {
        this.move.forward.back = true
      }
      
      if (eventCode === 'KeyA') {
        this.move.forward.left = true
      }
      
      if (eventCode === 'KeyD') {
        this.move.forward.right = true
      }
      
      if (eventCode === 'Space') {
        jump = true
      }

      if (eventCode === 'ShiftLeft') {
        this.move.forward.sprint = true
      }
  
      if (eventCode === 'KeyE') {
        this.store.commit('SET_EVENT_PRESS', { playerId: this.playerId, status: true })
      }
    }
    
    if (KeyboardEventTypes.KEYUP === eventType) {
      if (eventCode === 'KeyW') {
        this.move.forward.front = false
      }
      
      if (eventCode === 'KeyS') {
        this.move.forward.back = false
      }
      
      if (eventCode === 'KeyA') {
        this.move.forward.left = false
      }
      
      if (eventCode === 'KeyD') {
        this.move.forward.right = false
      }
      
      if (eventCode === 'Space') {
        this.store.commit('JUMP_DISABLED', this.playerId)
      }

      if (eventCode === 'ShiftLeft') {
        this.move.forward.sprint = false
      }
  
      if (eventCode === 'KeyE') {
        this.store.commit('SET_EVENT_PRESS', { playerId: this.playerId, status: false })
      }
    }
    
    this.move.forward.isMoving = !(
      !this.move.forward.left &&
      !this.move.forward.right &&
      !this.move.forward.back &&
      !this.move.forward.front
    )
    
    const equal = isEqual(this.move.forward, stateMove.forward)
    
    if (!equal) {
      this.store.commit('SET_FORWARD', { playerId: this.playerId, forward: { ...this.move.forward } })
    }
    
    if (jump && !this.move.fly) {
      this.move.jump()
      this.store.commit('JUMP_ENABLED', this.playerId)
    }
  }
  
  private mouseEvent () {
    const elementContent = document.getElementById('level') as HTMLElement
    
    elementContent.addEventListener('click', (e) => {
      const checkFocusAvailable = e.composedPath().find((item) => {
        const itemChecked = item as HTMLElement
        if(itemChecked.tagName !== undefined) {
          return itemChecked.classList.contains('no_focus_game')
        }
        
        return false
      })
      
      if (!checkFocusAvailable) {
        this.mouseIsCaptured = true
        const canvas = document.getElementById('canvas')
        
        if (canvas) {
          canvas.requestPointerLock()
        }
      }
      
    })
    
    const pointerlockchange = () => {
      this.mouseIsCaptured = document.pointerLockElement || false
    }
    
    document.addEventListener('pointerlockchange', pointerlockchange, false)
    
    window.addEventListener('pointermove', (e) => {
      if (this.mouseIsCaptured) {
        const rotateX = e.movementY * this.sensitiveMouse
        const rotateY = e.movementX * this.sensitiveMouse
        
        this.move.rotate(rotateX, rotateY)
        this.store.commit('UPDATE_ROTATE', { playerId: this.playerId, rotate: { x: rotateX, y: rotateY } })
      }
    })
  }
}
