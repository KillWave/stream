import Stream,{Source} from "./stream";
import Aop from './aop'

export function createShunt(stream:Stream):Stream {
  const prentAop:Aop = new Aop(stream);
  const shuntStream:Stream = new Stream();
  const shuntAop:Aop = new Aop(shuntStream);
  let shuntCallback:(d:unknown)=>unknown;
  shuntAop.before("useStream", (args:(d:unknown)=>unknown) => {
    shuntCallback = args;
  })
  prentAop.after("useStream",  (source:Source) => {
     shuntStream.setSource(source).useStream(shuntCallback)
  })
  return shuntStream
}