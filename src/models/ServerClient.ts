import * as Colyseus from 'colyseus.js'
import Player from '@/models/player/Player'
import store from '@/store'
import SubscribeStore from '@/models/сommon/SubscribeStore'

export default class ServerClient {
  sessionId: string | null
  playerId?: string
  room?: Colyseus.Room | null
  subscribeStore?: SubscribeStore
  players: Array<Player>
  
  constructor () {
    this.sessionId = null
    this.room = null
    this.players = []
  }
  
  init (callback: any) {
    const client = new Colyseus.Client(process.env.VUE_APP_SERVER_DOMAIN)
    this.playerId = ServerClient.getFakeId()
    
    client.joinOrCreate('my_room').then(room => {
      this.room = room
      console.info('Joined to server: ' + this.playerId)
      
      this.room.send('newPlayer', { playerId: this.playerId })
      
      this.room.onMessage('newPlayer', (message) => {
        console.info('New player: ' + message.playerId)
        this.createPlayer(message.playerId)
        room.send('helloNewPlayer', { playerId: this.playerId })
      })
      
      this.room.onMessage('helloNewPlayer', (message) => {
        this.createPlayer(message.playerId)
      })
      
      callback(this.playerId)
      
      this.room.onMessage('syncPlayer', (message) => {
        store.commit('SYNC_PLAYER', message.player)
      })
      
      this.room.onMessage('leavePlayer', (leavePlayerId) => {
        const player = this.players.find(player => player.playerId = leavePlayerId)
        player?.dispose()
        
        store.commit('DISPOSE_PLAYER', leavePlayerId)
      })
      
      this.syncPlayer()
    })
  }
  
  private createPlayer (playerId: string) {
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
          "flavour": "ExoTop_Snowwhite"
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
    
    store.commit('ADD_PLAYER', playerData)
    this.players.push(new Player(playerId))
  }
  
  private static getFakeId () {
    return 'player_' + Math.random()
  }
  
  private syncPlayer () {
    if (this.playerId && this.room && typeof this.room !== 'undefined') {
      this.subscribeStore = new SubscribeStore(this.playerId)
      this.subscribeStore.syncPlayer((player: any) => {
        this.room?.send('syncPlayer', { playerId: this.playerId, player })
      })
    }
  }
}