declare module 'seeyouftp' {
  export enum Status {
    Pending = 'Pending',
    Done = 'Done',
  }

  export interface Todo {
    name: string;
    score: string;
    status: Status;
  }
}
