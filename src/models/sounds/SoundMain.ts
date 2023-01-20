import { Store } from 'vuex'
import { Sound } from '@babylonjs/core'

export default class SoundMain {
  path: string

  constructor () {
    this.path = 'resources/audio'
  }

  subscribe(store: Store<any>, sound: Sound, type: string) {
    store.subscribe(mutation => {
      if (mutation.type == 'SET_SETTING_FIELD_VALUE') {
        if (mutation.payload.name == type) {
          if (store.getters.getSettingsValueByName(type)) {
            if (sound && !sound.isPlaying) {
              sound.play()
            }
          } else {
            if (sound && sound.isPlaying) {
              sound.stop()
            }
          }
        }
      }
    })
  }
}