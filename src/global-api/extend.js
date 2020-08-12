import { mergeOptions } from "../utils";

export function initExtend (Vue) {
  Vue.extend = function (extendOptions) {
    let cid = 0;
    const Sub = function VueComponent (options) {
      this._init(options);
    }

    Sub.prototype = Object.create(this.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = ++cid;
    Sub.options = mergeOptions(this.options, extendOptions);
    return Sub;
  }
}