
interface SourceEvent {
  event: DocumentEvent;
  source: unknown;
}
export type Source = SourceEvent | unknown
export default class Stream {
  private source: Source;
  private cache: Promise<unknown> | null = null;
  private pending: Boolean = false;
  private pipes: Array<(d: unknown) => unknown> = [];
  private firstExecution: Boolean = true;
  constructor(source?: Source) {
    this.source = source;
  }
  public pipe(...args: Array<(d: unknown) => unknown>): Stream {
    if (this.pipes.length) {
      this.pipes = this.pipes.concat(args);
    } else {
      this.pipes = args;
    }
    return this;
  }
  public useStream(callback: (unknown) => unknown): Promise<unknown> | undefined {
    if (this.source) {
      return this.usePipes()
        .then((d) => {
          this.pending = false;
          return callback(d);
        })
    }
  }
  private usePipes(): Promise<unknown> {
    if (!this.cache && !this.pending) {
      this.pending = true;
      this.cache = this.pipes.reduce(this.execute, this.source) as Promise<unknown>;
    }
    return this.cache instanceof Promise ? this.cache : Promise.resolve(this.cache);
  }
  private async execute(prve: Promise<unknown> | unknown, curr: (d: unknown) => unknown): Promise<unknown> {
    return curr(await prve);
  }
  public useEventStream(
    callback: (d: unknown) => unknown
  ): (e: Event) => Promise<unknown> | undefined {
    return (e: Event) => {
      if (this.firstExecution) {
        this.source = { event: e, source: this.source };
        this.cache = null;
        this.firstExecution = false;
      }
      return this.useStream(callback);
    };
  }
  public setPipe(pipes: Array<(d: unknown) => unknown> = []):Stream {
    this.pipes = pipes;
    return this;
  }
  public setSource(source: Source): Stream {
    this.source = source;
    return this
  }
}

export function createStream(source: Source): Stream {
  return new Stream(source)
}
