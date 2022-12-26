export interface Events {
  'round-start': null;
  'round-end': null;
  'person-voted': {
    name: string;
    vote: number;
  };
}
