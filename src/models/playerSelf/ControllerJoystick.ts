import { Store } from 'vuex'
import { Helpers } from '@/models/Helpers'
import { JoystickManagerOptions } from 'nipplejs'

export default class ControllerJoystick {
  store: Store<any>
  lastEventRotate: string
  lastEventMove: string

  constructor (store: Store<any>) {
    this.store = store
    this.lastEventRotate = ''
    this.lastEventMove = ''

    this.store.commit('SET_DATE_LAST_USED_CONTROLLERS', Helpers.getTime())
  }

  rotateStart () {
    if (!this.store.state.level.isUsedControllers) {
      this.store.commit('SET_IS_USED_CONTROLLERS', true)
    }

    this.store.commit('SET_IS_USED_ROTATE_CONTROLLER', true)
  }

  rotateEnd () {
    this.store.commit('SET_ROTATE_LAST_EVENT', this.lastEventRotate)
    this.store.commit('SET_DATE_LAST_USED_CONTROLLERS', Helpers.getTime())

    if (!this.store.state.controllerMove.isUsed) {
      this.store.commit('SET_IS_USED_CONTROLLERS', false)
    }

    this.store.commit('SET_IS_USED_ROTATE_CONTROLLER', false)

    this.resetRotate()
  }

  rotateMove (angle: string) {
    if (angle == 'left' && !this.store.state.controllerRotate.left) {
      this.store.commit('SET_PRESS_ROTATE_LEFT', true)
      this.lastEventRotate = 'left'
    }

    if (angle != 'left' && this.store.state.controllerRotate.left) {
      this.store.commit('SET_PRESS_ROTATE_LEFT', false)
    }

    if (angle == 'right' && !this.store.state.controllerRotate.right) {
      this.store.commit('SET_PRESS_ROTATE_RIGHT', true)
      this.lastEventRotate = 'right'
    }

    if (angle != 'right' && this.store.state.controllerRotate.right) {
      this.store.commit('SET_PRESS_ROTATE_RIGHT', false)
    }

    if (angle == 'up' && !this.store.state.controllerRotate.up) {
      this.store.commit('SET_PRESS_ROTATE_UP', true)
      this.lastEventRotate = 'up'
    }

    if (angle != 'up' && this.store.state.controllerRotate.up) {
      this.store.commit('SET_PRESS_ROTATE_UP', false)
    }

    if (angle == 'down' && !this.store.state.controllerRotate.down) {
      this.store.commit('SET_PRESS_ROTATE_DOWN', true)
      this.lastEventRotate = 'down'
    }

    if (angle != 'down' && this.store.state.controllerRotate.down) {
      this.store.commit('SET_PRESS_ROTATE_DOWN', false)
    }
  }

  moveMove (angle: string) {
    if (this.store.state.controllerMove.lastEvent != '') {
      this.store.commit('SET_MOVE_LAST_EVENT', '')
    }

    if (angle == 'left' && !this.store.state.controllerMove.left) {
      this.store.commit('SET_PRESS_MOVE_LEFT', true)
      this.lastEventMove = 'left'
    }

    if (angle != 'left' && this.store.state.controllerMove.left) {
      this.store.commit('SET_PRESS_MOVE_LEFT', false)
    }

    if (angle == 'right' && !this.store.state.controllerMove.right) {
      this.store.commit('SET_PRESS_MOVE_RIGHT', true)
      this.lastEventMove = 'right'
    }

    if (angle != 'right' && this.store.state.controllerMove.right) {
      this.store.commit('SET_PRESS_MOVE_RIGHT', false)
    }

    if (angle == 'up' && !this.store.state.controllerMove.up) {
      this.store.commit('SET_PRESS_MOVE_UP', true)
      this.lastEventMove = 'up'
    }

    if (angle != 'up' && this.store.state.controllerMove.up) {
      this.store.commit('SET_PRESS_MOVE_UP', false)
    }

    if (angle == 'down' && !this.store.state.controllerMove.down) {
      this.store.commit('SET_PRESS_MOVE_DOWN', true)
      this.lastEventMove = 'down'
    }

    if (angle != 'down' && this.store.state.controllerMove.down) {
      this.store.commit('SET_PRESS_MOVE_DOWN', false)
    }
  }

  moveStart () {
    if (!this.store.state.level.isUsedControllers) {
      this.store.commit('SET_IS_USED_CONTROLLERS', true)
    }

    this.store.commit('SET_IS_USED_MOVE_CONTROLLER', true)
  }

  moveEnd () {
    this.store.commit('SET_MOVE_LAST_EVENT', this.lastEventMove)
    this.store.commit('SET_DATE_LAST_USED_CONTROLLERS', Helpers.getTime())

    if (!this.store.state.controllerRotate.isUsed) {
      this.store.commit('SET_IS_USED_CONTROLLERS', false)
    }

    this.store.commit('SET_IS_USED_MOVE_CONTROLLER', false)

    this.resetMove()
  }

  resetMove () {
    this.store.commit('SET_PRESS_MOVE_RIGHT', false)
    this.store.commit('SET_PRESS_MOVE_LEFT', false)
    this.store.commit('SET_PRESS_MOVE_UP', false)
    this.store.commit('SET_PRESS_MOVE_DOWN', false)
  }

  resetRotate () {
    this.store.commit('SET_PRESS_ROTATE_RIGHT', false)
    this.store.commit('SET_PRESS_ROTATE_LEFT', false)
    this.store.commit('SET_PRESS_ROTATE_UP', false)
    this.store.commit('SET_PRESS_ROTATE_DOWN', false)
  }

  getOptionsRotate () {
    return {
      zone: document.getElementById('controller_box_rotate'),
      color: '#9b72fa',
      mode: 'static',
      position: {
        bottom: '130px',
        right: '130px'
      }
    } as JoystickManagerOptions
  }

  getOptionsMove () {
    return {
      zone: document.getElementById('controller_box_move'),
      color: '#fa72d3',
      mode: 'static',
      position: {
        bottom: '130px',
        left: '130px'
      }
    } as JoystickManagerOptions
  }
}