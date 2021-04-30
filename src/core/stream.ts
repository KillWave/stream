import fusing from "./fusing";

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
  private fusingSource: Promise<any> | any;
  private fusingPipes: Array<Array<(unknown) => unknown>> = [];
  private fusingCallbacks: Array<(unknown) => unknown> = [];
  private isFusing: Boolean = false;
  constructor(source?: unknown) {
    this.source = source;
  }
  public pipe(...args: Array<(unknown) => unknown>) {
    if (this.isFusing) {
      this.fusingPipes.push(args);
    } else {
      if (this.pipes.length) {
        this.pipes = this.pipes.concat(args);
      } else {
        this.pipes = args;
      }
    }

    return this;
  }
  public useStream(callback: (unknown) => unknown, isfusing: boolean = false) {
    this.isFusing && !isfusing && this.fusingCallbacks.push(callback);
    if (!this.isFusing) {
      this.usePipes().then((d) => {
        this.pending = false;
        return callback(d);
      });
    } else {
      if (isfusing) {
        this.usePipes()
          .then((d) => {
            this.pending = false;
            this.fusingSource = d;
            return callback(d);
          })
          .then((_) => {
            this.isFusing = false;
            return fusing(
              this.fusingSource,
              this.fusingPipes,
              this.fusingCallbacks
            );
          });
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
    isfusing: boolean = false
  ) {
    return (e) => {
      if (this.firstExecution) {
        this.source = { event: e, source: this.source };
        this.cache = null;
        this.firstExecution = false;
      }
      return this.useStream(callback, isfusing);
    };
  }
  public fusing(source?: any) {
    // this.fusingPipes = [];
    // this.fusingSources = [];
    // this.fusingCallbacks = [];
    // this.pipes = [];
    this.isFusing = true;
    if (source) {
      this.fusingSource = source;
    }
    return this;
  }
  public setPipe(pipes) {
    this.pipes = pipes;
    return this;
  }
  public setSource(source) {
    this.source = source;
  }
}
