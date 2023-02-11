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
import DevMode from '@/models/scene/DevMode'

export default class Game {
  init () {
    globalThis.assetContainers = []
    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const engine = new Engine(canvas, true, {preserveDrawingBuffer: false, stencil: true})
    const sceneModel = new Scene(engine)
    const environment = new Environment()

    sceneModel.load(async () => {
      new Audio()
      environment.setupHDR()
      environment.setupGlow()
      environment.setupLightAndShadow()
      
      const serverClient = new ServerClient()
      
      serverClient.init(async (playerId: string) => {
        store.commit('ADD_SELF_PLAYER', playerId)
        const playerData = {
          playerId,
          character: 'BTLMN_Lemon.gltf',
          items: [
            { placeholder: 'mask', name: 'Mask_Cowboy_Scarf.gltf' },
            { placeholder: 'weapon_r', name: 'FireArms_Revolver.gltf' }
          ],
          properties: [
            {
              "name": "exo_top",
              "flavour": "ExoTop_Golden"
            },
            {
              "name": "exo_bot",
              "flavour": "ExoBot_Steel"
            },
            {
              "name": "feet",
              "flavour": "Feet_Military"
            },
            {
              "name": "eyes",
              "flavour": "Eyes_Zombie"
            },
            {
              "name": "hands",
              "flavour": "Hands_Golden"
            },
            {
              "name": "head",
              "flavour": "Head_Zombie"
            },
            {
              "name": "teeth",
              "flavour": "Teeth_Sharp"
            }
          ]
        }
        
        await store.commit('ADD_PLAYER', playerData)
        
        const playerSelf = new PlayerSelf(playerId)
        
        new Camera()
        new Teleport(playerId)
        new LightPoints()
        new Doors()
        new LowerFloor()
        new DevMode()
        
        playerSelf.loadCharacter( () => {
          store.commit('LOADING_TOGGLE')
        })
      })
    })
  }
}
