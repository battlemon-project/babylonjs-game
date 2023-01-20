import { Module } from 'vuex'
import { RootState } from '@/store/types'
import { ControllerState } from '@/store/controller_move/types'
import { mutations } from '@/store/controller_move/mutations'

const state: ControllerState = {
  right: false,
  left: false,
  up: false,
  down: false,
  lastEvent: '',
  isUsed: false
}

const getters = {
  controllerMoveIsUsed: (state: ControllerState) => state.isUsed,
}

export const controllerMove: Module<ControllerState, RootState> = {
  state,
  mutations,
  getters
}