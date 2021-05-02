
export default class Aop {
    private target:unknown
    constructor(target:unknown) {
        this.target = target
    }
    /**
  * 前置切入
  * @param {Function} method 目标函数
  * @param {Function} fn 切入函数，返回 Boolean / Promise
  * @param {Object} target 目标对象
  */
    public before(methodName: string, fn:(d:unknown)=>unknown) {
        //保存原方法
        const original = this.target[methodName];
        this.target[methodName] = (...args) => {
            // 执行前置函数，返回值可能是 Boolean 或 Promise
            const flag = fn.apply(this.target, args)
            if (flag instanceof Promise) {
                return flag.then(() => original.apply(this.target, args))
            }
            // 否则直接执行原函数并返回
            return original.apply(this.target, args)
        }

    }
    /**
     * 后置切入
     * @param {Function} method 目标函数
     * @param {Function} fn 切入函数
     * @param {Object} target 目标对象
     */
    public after(methodName: string, fn:(d:unknown)=>unknown) {
        const original = this.target[methodName]
        this.target[methodName] = (...args) => {
            // 原函数返回值，可能会是 Paomise
            let rt = original.apply(this.target, args)
            // 原函数的返回值是 Promise
            if (Promise && rt instanceof Promise) {
                rt.then(res => {
                    // 执行后置切入函数
                    fn(res)
                    // 返回原函数的返回值给下一个 resolve / reject
                    return res
                })
            } else {
                fn(rt)
            }
            return rt

        }
    }

}