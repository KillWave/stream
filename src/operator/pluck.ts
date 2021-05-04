export default function pluck(...args: string[]) {
  return async (value:unknown) => {
    let key: string;
    while ((key = args.shift())) {
      value = await value[key];
    }
    return value;
  };
}
