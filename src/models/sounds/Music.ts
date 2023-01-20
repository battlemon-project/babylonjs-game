import { Sound } from '@babylonjs/core'
import store from '@/store'
import SoundMain from '@/models/sounds/SoundMain'
import { Store } from 'vuex'

export default class Music extends SoundMain {
  filePath: string
  sound: Sound
  store: Store<any>
  
  constructor () {
    super()
    this.store = store
    this.filePath = this.path + '/level_' + this.store.state.level.levelId + '/music.wav'

    this.sound = new Sound('Music', this.filePath, globalThis.scene, () => {
      this.subscribe(store, this.sound, 'music')
    }, {
      loop: true,
      autoplay: store.getters.getSettingsValueByName('music'),
      volume: 0.5
    })
  }
}

