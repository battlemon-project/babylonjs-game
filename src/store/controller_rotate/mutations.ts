import { MutationTree} from 'vuex'
import { ControllerState } from '@/store/controller_rotate/types'

export const mutations: MutationTree<ControllerState> = {
  SET_PRESS_ROTATE_RIGHT (state, payload) {
    state.right = payload
  },
  SET_PRESS_ROTATE_LEFT (state, payload) {
    state.left = payload
  },
  SET_PRESS_ROTATE_UP (state, payload) {
    state.up = payload
  },
  SET_PRESS_ROTATE_DOWN (state, payload) {
    state.down = payload
  },
  SET_ROTATE_LAST_EVENT (state, payload) {
    state.lastEvent = payload
  },
  SET_IS_USED_ROTATE_CONTROLLER (state, payload) {
    state.isUsed = payload
  }
}