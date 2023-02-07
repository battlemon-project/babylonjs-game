import { Engine } from '@babylonjs/core'
import Scene from './scene/Scene'
import store from '@/store/index'
import Camera from './playerSelf/Camera'
import PlayerSelf from './playerSelf/Player'
import LightPoints from './scene/LightPoints'
import Doors from '@/models/mehanics/Doors'
import LowerFloor from '@/models/mehanics/LowerFloor'
import Audio from '@/models/sounds/Audio'
import Teleport from '@/models/mehanics/Teleport'
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
      environment.setupHDR()
      environment.setupGlow()
      environment.setupLightAndShadow()
      
      const serverClient = new ServerClient()
      serverClient.init(async (playerId: string) => {
        store.commit('ADD_SELF_PLAYER', playerId)
        const playerData = {
          playerId,
          character: 'player.gltf',
          items: [
            { placeholder: 'mask', name: 'Mask_Cowboy_Scarf.gltf' },
            { placeholder: 'weapon_r', name: 'FireArms_Revolver.gltf' }
          ]
        }
        
        await store.commit('ADD_PLAYER', playerData)
        
        const playerSelf = new PlayerSelf(playerId)
        
        new Camera()
        new Teleport(playerId)
        new LightPoints()
        new Doors()
        new LowerFloor()
        
        playerSelf.loadCharacter( () => {
          store.commit('LOADING_TOGGLE')
        })
      })
    })
  }
}
