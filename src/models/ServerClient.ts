import * as Colyseus from 'colyseus.js'
import store from '@/store'
import SubscribeStore from '@/models/сommon/SubscribeStore'
import Game from '@/models/Game'

export default class ServerClient {
  sessionId: string | null
  playerId?: string
  room?: Colyseus.Room | null
  subscribeStore?: SubscribeStore
  
  constructor (playerId: string) {
    this.sessionId = null
    this.room = null
    this.playerId = playerId
  }
  
  init () {
    const client = new Colyseus.Client(process.env.VUE_APP_SERVER_DOMAIN)
    
    client.joinOrCreate('my_room').then(room => {
      this.room = room
      this.room.state.players.onAdd = (player: any) => {
        store.commit('ADD_PLAYER', player)
      }
  
      this.room.state.players.onRemove = (player: any) => {
        store.commit('REMOVE_PLAYER', player.id)
      }
      
      console.info('Joined to server room')
      
      this.room.send('createPlayer', { playerId: this.playerId })
      
      this.room.onMessage('syncPlayer', (message) => {
        store.commit('SYNC_PLAYER', message.player)
      })
      
      this.room.onMessage('errorIdPlayer', (message) => {
        if (message === 500) {
          alert('A player with this ID will not find!')
        }
      })
    })
  }
  
  public syncPlayer () {
    if (this.playerId && this.room && typeof this.room !== 'undefined') {
      this.subscribeStore = new SubscribeStore(this.playerId)
      
      this.subscribeStore.syncPlayer((player: any) => {
        this.room?.send('syncPlayer', { playerId: this.playerId, player })
      })
    }
  }
}