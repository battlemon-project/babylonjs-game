import { AbstractMesh, AnimationGroup, MorphTarget } from '@babylonjs/core'

export default interface Keys {
  id: string | number,
  keyMesh: AbstractMesh,
  detectedMesh: AbstractMesh,
  buttonDetectedMesh: AbstractMesh,
  lineMesh: AbstractMesh,
  lightDetectedMesh: AbstractMesh,
  lightButtonMesh: AbstractMesh,
  lightButtonMorphTarget: MorphTarget | null,
  animationGroup: AnimationGroup,
  open: boolean,
  opened: boolean,
  down: boolean,
  timeLastOpen: number,
  timeSetOpen: number
}