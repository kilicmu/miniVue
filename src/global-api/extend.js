import { mergeOptions } from "../utils";
let cid = 0;
export function initExtend (Vue) {
  Vue.extend = function (extendOptions) {
    const Sub = function VueComponent (options) {
      this._init(options);
    }
    Sub.prototype = Object.create(this.prototype, { constructor: { value: Sub } });
    Sub.cid = cid++;
    Sub.options = mergeOptions(this.options, extendOptions);
    console.log('sub-----', Sub.options);
    return Sub;
  }
}