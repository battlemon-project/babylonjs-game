import { Module } from 'vuex'
import { RootState } from '@/store/types'
import { mutations } from '@/store/players/mutations'
import { Players } from '@/store/players/types'

const state: Players = {
  list: []
}

const getters = {
  getPlayerById: (state: Players) => (id: string) => {
    return state.list.find(player => player.id === id)
  }
}

export const players: Module<Players, RootState> = {
  state,
  mutations,
  getters
}
