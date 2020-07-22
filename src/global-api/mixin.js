import { mergeOptions } from "../utils";

export function initMixin (Vue) {
  Vue.options = {}
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this;
  }

  Vue.mixin({
    b: 2,
    beforeCreate () {
      console.log(this.object);
    },
    mounted () {
      console.log('obj', this.object);
      console.log(this);
    },
  });

  Vue.mixin({
    a: 1,
    beforeCreate () {
      console.log(2);
    },
  });

  console.log(Vue.options)
}