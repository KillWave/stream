import shunt from "./shunt";
interface Source {
  event: DocumentEvent;
  source: unknown;
}
export default class Stream {
  private source: Source | unknown;
  private cache: Promise<any> | null = null;
  private pending: Boolean = false;
  private pipes: Array<(unknown) => unknown> = [];
  private firstExecution: Boolean = true;
  private shuntPipes: Array<Array<(unknown) => unknown>> = [];
  private shuntCallbacks: Array<(unknown) => unknown> = [];
  private isshunt: Boolean;
  constructor(source?: unknown) {
    this.source = source;
  }
  public pipe(...args: Array<(unknown) => unknown>) {
    if (this.isshunt) {
      this.shuntPipes.push(args);
    } else {
      if (this.pipes.length) {
        this.pipes = this.pipes.concat(args);
      } else {
        this.pipes = args;
      }
    }
    return this;
  }
  public useStream(callback: (unknown) => unknown, isshunt: boolean = false) {
    if (isshunt) {
      this.usePipes()
        .then((d) => {
          this.pending = false;
          return callback(d);
        })
        .then((d) => {
          shunt(
            d,
            this.shuntPipes,
            this.shuntCallbacks
          );
        });
    } else {
      if (!this.isshunt) {
        this.usePipes().then((d) => {
          this.pending = false;
          return callback(d);
        });
      } else {
        this.shuntCallbacks.push(callback);
      }
    }
  }
  private usePipes() {
    if (!this.cache && !this.pending) {
      this.pending = true;
      this.cache = this.pipes.reduce(this.execute, this.source) as Promise<any>;
    }
    return this.cache?.then ? this.cache : Promise.resolve(this.cache);
  }
  private async execute(prve, curr) {
    return curr(await prve);
  }
  public useEventStream(
    callback: (unknown) => unknown,
    isshunt: boolean = false
  ) {
    return (e) => {
      if (this.firstExecution) {
        this.source = { event: e, source: this.source };
        this.cache = null;
        this.firstExecution = false;
      }
      return this.useStream(callback, isshunt);
    };
  }
  public createShunt() {
    this.isshunt = true;
    return this;
  }
  public setPipe(pipes) {
    this.pipes = pipes;
    return this;
  }
}
