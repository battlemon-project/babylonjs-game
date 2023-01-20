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
      id: '1'
    },
    levels: [
      {id: 1, finish: false},
      {id: 2, finish: false},
      {id: 3, finish: false},
    ],
  },
  mutations: {
    ADD_SELF_PLAYER (state, playerId) {
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