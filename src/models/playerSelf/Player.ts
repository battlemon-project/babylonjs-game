import Body from '../сommon/Body'
import Controller from '../playerSelf/Controller'
import { Scene, AbstractMesh } from '@babylonjs/core'
import Collisions from '@/models/mehanics/Collisions'
import Character from '@/models/сommon/character/Character'

export default class Player {
  scene: Scene
  playerId: string
  listCollisions: Array<AbstractMesh>
  
  constructor (playerId: string) {
    this.scene = globalThis.scene
    this.playerId = playerId
    
    const modelCollision = new Collisions()
    this.listCollisions = modelCollision.listCollisions
  
    new Body(this.playerId)
    new Controller()
  }
  
  loadCharacter(callback: any) {
    const character = new Character(this.playerId)
    character.load(callback)
  }
}
