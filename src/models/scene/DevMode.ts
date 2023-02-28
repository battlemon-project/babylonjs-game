import { Settings } from '@/models/storage/Settings'

export default class DevMode {
  constructor () {
    if (Settings.getValueByName('dev_mode')) {
      this.enabled()
    }
  }
  
  enabled () {
    const globalRoot = document.getElementsByTagName('body')[0]
    if (globalRoot) {
      scene.debugLayer.show({overlay: true, globalRoot: globalRoot})
    }
  }
}