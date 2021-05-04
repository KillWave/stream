



class Chain {
  public value: unknown = null;
  private pipes: Array<(d: unknown) => unknown> = [];
  constructor(value?: unknown) {
    this.value = value;
  }
  public pipe(...args: Array<(d: unknown) => unknown>): Chain {
    if (this.pipes.length) {
      this.pipes = this.pipes.concat(args);
    } else {
      this.pipes = args;
    }
    return this;
  }
  public commit(value?: unknown): Promise<unknown> {
    this.value = this.pipes.reduce(this.execute, value ? value : this.value) as Promise<unknown>;
    return this.value instanceof Promise ? this.value : Promise.resolve(this.value);
  }
  private async execute(prve: Promise<unknown> | unknown, curr: (d: unknown) => unknown): Promise<unknown> {
    return curr(await prve);
  }

}
export function chain(value?: unknown | Chain): Chain {
  if (value instanceof Chain) {
    return new Chain(value.value)
  }
  return new Chain(value)
}
