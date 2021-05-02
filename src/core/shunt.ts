import Stream from "./stream";
import Aop from './aop'

export function createShunt(stream) {
  const prentAop = new Aop(stream);
  const shuntStream = new Stream();
  const shuntAop = new Aop(shuntStream);
  let shuntCallback;
  shuntAop.before("useStream", (args) => {
    shuntCallback = args;
  })
  prentAop.after("useStream",  (args) => {
     shuntStream.setSource(args).useStream(shuntCallback)
  })
  return shuntStream
}