export interface Forward {
  left: boolean;
  right: boolean;
  front: boolean;
  back: boolean;
  isMoving: boolean;
  sprint: boolean;
}

export interface Move {
  forward: Forward;
  jump: boolean;
  isFly: boolean;
  isFlyUp: boolean;
  rotate: { x: number; y: number };
  syncData: {
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number };
  };
}

export interface Item {
  placeholder: string;
  name: string;
}

export interface Player {
  id: string;
  move: Move;
  character: string;
  items: Item[];
}

export interface Players {
  list: Array<Player>;
}
