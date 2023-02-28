import { Engine } from '@babylonjs/core'
import Scene from './scene/Scene'
import store from '@/store/index'
import Audio from '@/models/sounds/Audio'
import ServerClient from './ServerClient'
import DevMode from '@/models/scene/DevMode'
import PlayerSelf from '@/models/playerSelf/Player'
import Player from '@/models/player/Player'
import LightPoints from '@/models/scene/LightPoints'
import { v4 as uuidv4 } from 'uuid'

export default class Game {
  players?: Array<Player>
  
  init () {
    globalThis.assetContainers = []
    this.players = []
    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    const engine = new Engine(canvas, true, { preserveDrawingBuffer: false, stencil: true })
    const sceneModel = new Scene(engine)
    const playerId = this.getPlayerId()
    store.commit('SET_SELF_PLAYER_ID', playerId)
    
    sceneModel.load(async () => {
      new Audio()
      sceneModel.setEnvironment()
      
      const serverClient = new ServerClient(playerId)
      serverClient.init()
      
      store.subscribe(mutation => {
        if (mutation.type === 'ADD_PLAYER') {
          if (mutation.payload.id === playerId) {
            new PlayerSelf(playerId)
            
            this.setClassesGame()
            store.commit('LOADING_TOGGLE')
            
            console.info('Self player ' + playerId + ' created!')
  
            serverClient.syncPlayer()
          } else {
            this.players?.push(new Player(mutation.payload.id))
            console.info('Player ' + playerId + ' created!')
          }
        }
      })
    })
  
    store.subscribe(mutation => {
      if (mutation.type === 'REMOVE_PLAYER') {
        const player = this.players?.find(player => player.playerId === mutation.payload)

        if (player) {
          player.dispose()
          console.info('Player ' + player.playerId + ' removed')
        }
      }
    })
  }
  
  setClassesGame () {
    new LightPoints()
    new DevMode()
  }
  
  getPlayerId () {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    let playerId = urlParams.get('playerId')
    
    if (!playerId) {
      playerId = 'guest_' + uuidv4()
    }
    
    return playerId
  }
}