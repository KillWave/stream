

class SourceEvent {
  public event: Event;
  public source: unknown;
  constructor(event: Event, source: unknown) {
    this.event = event;
    this.source = source;
  }

}
export type Source = SourceEvent | unknown
export default class Stream {
  private source: Source = null;
  private cache: Promise<unknown> | null = null;
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
  public async useStream(callback: (d: unknown) => unknown): Promise<unknown> | undefined {
    if (this.source) return callback(await this.usePipes());
  }
  private usePipes(): Promise<unknown> {
    if (!this.cache) {
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
      if (this.source instanceof SourceEvent) {
        this.source.event = e;
      }
      if (this.firstExecution) {
        this.source = new SourceEvent(e, this.source);
        this.cache = null;
        this.firstExecution = false;
      }
      return this.useStream(callback);
    };
  }
  public setPipe(pipes: Array<(d: unknown) => unknown> = []): Stream {
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
