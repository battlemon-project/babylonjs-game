import { Module } from 'vuex'
import { RootState } from '@/store/types'
import { LevelState } from '@/store/level/types'
import { mutations } from '@/store/level/mutations'

const state: LevelState = {
  levelId: 0,
  play: false,
  loading: true,
  dateLastUsedControllers: 0,
  isUsedControllers: false,
  isMapOpen: false,
  isMenuOpen: false,
  playerPosition: {x: 0, y: 0, z: 0},
  playerRotate: {x: 0, y: 0},
  lowerFloorPosition: {x: 0, y: 0, z: 0},
  lowerFloorSize: {width: 0, height: 0},
  keys: [],
  keysActiveCount: 0,
  batteryCharge: 0,
  finish: false,
  hubStatus: 'none'
}

const getters = {
  batteryCharge: (state: LevelState) => state.batteryCharge,
  finish: (state: LevelState) => state.finish
}

export const level: Module<LevelState, RootState> = {
  state,
  mutations,
  getters
}