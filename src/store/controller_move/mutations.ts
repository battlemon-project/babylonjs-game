import { MutationTree} from 'vuex'
import { ControllerState } from '@/store/controller_move/types'

export const mutations: MutationTree<ControllerState> = {
  SET_PRESS_MOVE_RIGHT (state, payload) {
    state.right = payload
  },
  SET_PRESS_MOVE_LEFT (state, payload) {
    state.left = payload
  },
  SET_PRESS_MOVE_UP (state, payload) {
    state.up = payload
  },
  SET_PRESS_MOVE_DOWN (state, payload) {
    state.down = payload
  },
  SET_MOVE_LAST_EVENT (state, payload) {
    state.lastEvent = payload
  },
  SET_IS_USED_MOVE_CONTROLLER (state, payload) {
    state.isUsed = payload
  }
}