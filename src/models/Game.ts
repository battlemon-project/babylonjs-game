import { Engine } from '@babylonjs/core'
import Scene from './scene/Scene'
import store from '@/store/index'
import Camera from './playerSelf/Camera'
import PlayerSelf from './playerSelf/Player'
import LightPoints from './scene/LightPoints'
import Doors from '@/models/mehanics/Doors'
import ChargingStations from '@/models/mehanics/ChargingStations'
import Keys from '@/models/mehanics/Keys'
import LowerFloor from '@/models/mehanics/LowerFloor'
import Audio from '@/models/sounds/Audio'
import Teleport from '@/models/mehanics/Teleport'
import Sky from '@/models/mehanics/Sky'
import ServerClient from './ServerClient'
import Environment from '@/models/scene/Environment'

export default class Game {
  init () {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const engine = new Engine(canvas, true, {preserveDrawingBuffer: false, stencil: true})
    const sceneModel = new Scene(engine)
    const environment = new Environment()

    sceneModel.load(() => {
      new Audio()
      new Sky()
      environment.setupHDR()
      environment.setupGlow()
      environment.setupLightAndShadow()
      
      const serverClient = new ServerClient()
      serverClient.init(async (playerId: string) => {
        store.commit('ADD_SELF_PLAYER', playerId)
        await store.commit('ADD_PLAYER', { playerId, character: 'player.glb' })
        
        const playerSelf = new PlayerSelf(playerId)
        
        new Camera()
        new Teleport(playerId)
        new LightPoints()
        new Doors()
        new ChargingStations()
        new LowerFloor()
        new Keys()
        
        playerSelf.loadCharacter( () => {
          store.commit('LOADING_TOGGLE')
        })
      })
    })
  }
}
