export interface Keys {
  status: boolean,
  id: number
}

export interface playerPosition {
  x: number
  y: number,
  z: number,
}

export interface playerRotate {
  x: number,
  y: number,
}

export interface lowerFloorPosition {
  x: number,
  y: number,
  z: number,
}

export interface lowerFloorSize {
  width: number,
  height: number,
}

export interface LevelState {
  levelId: number,
  loading: boolean,
  play: boolean,
  keysActiveCount: number,
  dateLastUsedControllers: number,
  isUsedControllers: boolean,
  keys: Array<Keys>,
  isMapOpen: boolean,
  isMenuOpen: boolean,
  playerPosition: playerPosition,
  playerRotate: playerRotate,
  lowerFloorPosition: lowerFloorPosition,
  lowerFloorSize: lowerFloorSize,
  batteryCharge: number,
  finish: boolean
}
