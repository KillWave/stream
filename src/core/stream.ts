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
  constructor(source?: unknown) {
    this.source = source;
  }
  public pipe(...args: Array<(unknown) => unknown>) {
    if (this.pipes.length) {
      this.pipes = this.pipes.concat(args);
    } else {
      this.pipes = args;
    }
    return this;
  }
  public useStream(callback) {
    return this.usePipes().then((d) => {
      this.pending = false;
      return callback(d);
    });
  }
  private usePipes() {
    if (!this.cache && !this.pending) {
      this.pending = true;
      this.cache = this.pipes.reduce(this.execute, this.source) as Promise<any>;
    }
    return this.cache;
  }
  private async execute(prve, curr) {
    return curr(await prve);
  }
  public useEventStream(callback: (unknown) => unknown) {
    return (e) => {
      if (this.firstExecution) {
        this.source = { event: e, source: this.source };
        this.cache = null;
        this.firstExecution = false;
      }
      this.useStream(callback);
    };
  }
}
