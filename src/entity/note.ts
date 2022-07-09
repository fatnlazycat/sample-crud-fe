export class Note {
  id?: number
  text: string;
  completed: boolean;

  constructor () {
    this.completed = false;
  }
}