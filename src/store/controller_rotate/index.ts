import { Module } from 'vuex'
import { RootState } from '@/store/types'
import { ControllerState } from '@/store/controller_rotate/types'
import { mutations } from '@/store/controller_rotate/mutations'

const state: ControllerState = {
  right: false,
  left: false,
  up: false,
  down: false,
  lastEvent: '',
  isUsed: false
}

export const controllerRotate: Module<ControllerState, RootState> = {
  state,
  mutations
}