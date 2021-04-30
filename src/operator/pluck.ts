export default function pluck(...args: string[]) {
  return async (d) => {
    let key: string;
    while ((key = args.shift())) {
      d = await d[key];
    }
    return d;
  };
}
