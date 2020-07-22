import { initMixin } from "./mixin";

export function initGlobalAPI (Vue) {
  Vue.options = {}
  initMixin(Vue);


}