import { Module } from 'vuex'
import { RootState } from '@/store/types'
import { mutations } from '@/store/settings/mutations'
import { Settings } from '@/store/settings/types'
import { Field, Settings as SettingsLocalStorage } from '@/models/storage/Settings'


const state: Settings = {
  fields: SettingsLocalStorage.getFields(),
  open: false
}

const getters = {
  settingFields: (state: Settings) => state.fields,
  getSettingsFieldByName: (state: Settings) => (name: string) => {
    return state.fields.find(field => field.name == name)
  },
  getSettingsValueByName: (state: Settings) => (name: string) => {
    const field = state.fields.find((field: Field) => field.name == name)

    if (!field) {
      throw 'Error setting field in Store state'
    }

    return field.value
  }
}

export const settings: Module<Settings, RootState> = {
  state,
  mutations,
  getters
}
