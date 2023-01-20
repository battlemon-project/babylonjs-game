export interface Level {
  id: number;
  finish: boolean;
}

export interface RootState {
  player: {
    id: string;
  };
  levels: Array<Level>;
}