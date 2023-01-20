import { MutationTree } from 'vuex'
import { LevelState } from '@/store/level/types'
import { Level as LevelStorage } from '@/models/storage/Level'

export const mutations: MutationTree<LevelState> = {
  SET_LEVEL (state, payload) {
    state.levelId = payload
  },
  SET_PLAY (state) {
    state.play = true
  },
  SET_OPEN_MENU (state, payload) {
    state.isMenuOpen = payload
  },
  SET_DATE_LAST_USED_CONTROLLERS (state, payload) {
    state.dateLastUsedControllers = payload
  },
  SET_IS_USED_CONTROLLERS (state, payload) {
    state.isUsedControllers = payload
  },
  MAP_TOGGLE (state) {
    state.isMapOpen = !state.isMapOpen
  },
  LOADING_TOGGLE (state) {
    state.loading = !state.loading
  },
  SET_LOWER_FLOOR_POSITION (state, payload) {
    state.lowerFloorPosition.x = payload.x
    state.lowerFloorPosition.y = payload.y
    state.lowerFloorPosition.z = payload.z
  },
  SET_LOWER_FLOOR_SIZE (state, payload) {
    state.lowerFloorSize.width = payload.width
    state.lowerFloorSize.height = payload.height
  },
  ADD_KEY (state, payload) {
    state.keys.push(payload)
  },
  SET_ACTIVE_KEY (state, payload) {
    const key = state.keys.find(key => key.id == payload)

    if (key) {
      key.status = true
    }

    state.keysActiveCount = state.keys.filter(key => key.status).length
  },
  CHARGE_BATTERY_UP (state, payload) {
    if (state.batteryCharge < 100) {
      if (state.batteryCharge + payload <= 100) {
        state.batteryCharge += payload
      } else {
        state.batteryCharge = 100
      }
    }
  },
  CHARGE_BATTERY_DOWN (state, payload) {
    if (state.batteryCharge != 0) {
      if (state.batteryCharge - payload >= 0) {
        state.batteryCharge -= payload
      } else {
        state.batteryCharge = 0
      }
    }
  },
  SET_FINISH (state) {
    LevelStorage.saveCompletedLevel(state.levelId)
    state.finish = true
  }
}