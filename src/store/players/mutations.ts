import { MutationTree } from 'vuex'
import { Player, Players } from '@/store/players/types'

const getPlayerById = (state: Players, playerId: string) => {
  return state.list.find(player => player.id == playerId) as Player
}

const playerExample: Player = {
  id: 'new',
  character: '',
  items: [],
  properties: [],
  move: {
    forward: {
      front: false,
      back: false,
      left: false,
      right: false,
      isMoving: false,
      sprint: false
    },
    rotate: { x: 0, y: 0 },
    jump: false,
    isFly: false,
    isFlyUp: false,
    syncData: {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0 }
    }
  }
}

export const mutations: MutationTree<Players> = {
  ADD_PLAYER (state, payload) {
    if (!getPlayerById(state, payload.id)) {
      const newPlayer = JSON.parse(JSON.stringify(playerExample))
      newPlayer.id = payload.id
      newPlayer.character = 'BTLMN_Lemon.gltf'
      newPlayer.items = payload.items
      newPlayer.properties = payload.properties
  
      state.list.push(newPlayer)
    }
  },
  REMOVE_PLAYER (state, playerId) {
    state.list.splice(state.list.findIndex(player => player.id == playerId), 1)
  },
  FLY_ENABLED (state, playerId) {
    getPlayerById(state, playerId).move.isFly = true
  },
  FLY_UP_ENABLED (state, playerId) {
    getPlayerById(state, playerId).move.isFlyUp = true
  },
  FLY_UP_DISABLED (state, playerId) {
    getPlayerById(state, playerId).move.isFlyUp = false
  },
  FLY_DISABLED (state, playerId) {
    getPlayerById(state, playerId).move.isFly = false
  },
  SET_FORWARD (state, payload) {
    getPlayerById(state, payload.playerId).move.forward = {...payload.forward}
  },
  UPDATE_ROTATE (state, payload) {
    getPlayerById(state, payload.playerId).move.rotate = payload.rotate
  },
  UPDATE_ROTATION (state, payload) {
    const playerState = getPlayerById(state, payload.playerId)
    playerState.move.syncData.rotation.x = payload.x
    playerState.move.syncData.rotation.y = payload.y
  },
  UPDATE_POSITION (state, payload) {
    getPlayerById(state, payload.playerId).move.syncData.position = payload.position
  },
  JUMP_DISABLED (state, playerId) {
    getPlayerById(state, playerId).move.jump = false
  },
  JUMP_ENABLED (state, playerId) {
    getPlayerById(state, playerId).move.jump = true
  },
  JUMP_SET (state, payload) {
    getPlayerById(state, payload.playerId).move.jump = payload.jump
  },
  SYNC_PLAYER (state, player) {
    const statePlayer = getPlayerById(state, player.id)
    
    if (statePlayer) {
      statePlayer.move = player.move
    }
  }
}

