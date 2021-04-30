import Stream from "./stream";

export default function (fusingSource, pipes, callback) {
  const len = pipes.length;
  for (let i = 0; i < len; i++) {
    const stream = new Stream(fusingSource);
    stream.setPipe(pipes[i]);
    stream.useStream(callback[i], false);
  }
}
