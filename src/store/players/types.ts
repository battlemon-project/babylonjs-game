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
  type: string;
  flavour: string;
}

export interface Property {
  name: string;
  flavour: string;
}

export interface Event {
  press: boolean;
  isFocused: boolean;
}

export interface Player {
  id: string;
  move: Move;
  character: string;
  items: Item[];
  properties: Property[];
  event: Event
}

export interface Players {
  list: Array<Player>;
}
