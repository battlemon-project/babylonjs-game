import Vuex, { StoreOptions } from 'vuex'
import { RootState } from '@/store/types'
import { controllerMove } from '@/store/controller_move'
import { controllerRotate } from '@/store/controller_rotate'
import { settings } from '@/store/settings'
import { level } from '@/store/level'
import { players } from '@/store/players'

const store: StoreOptions<RootState> = {
  strict: false,
  state: {
    player: {
      id: ''
    },
    levels: [
      {id: 1, finish: false},
      {id: 2, finish: false},
      {id: 3, finish: false},
    ],
  },
  mutations: {
    SET_SELF_PLAYER_ID (state, playerId) {
      state.player.id = playerId
    },
  },
  modules: {
    players,
    controllerMove,
    controllerRotate,
    level,
    settings
  }
}

export default new Vuex.Store<RootState>(store)