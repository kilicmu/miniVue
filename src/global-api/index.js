import { nextTick } from "../../utils/next-tick";
import { ASSET_TYPES } from "../shared/contants";
import { initAssetRegisters } from "./assets";
import { initExtend } from "./extend";
import { initMixin } from "./mixin";


export function initGlobalAPI (Vue) {
  Vue.options = {}
  initMixin(Vue);
  ASSET_TYPES.forEach(type => {
    Vue.options[ type + 's' ] = {}
  })
  Vue.options._base = Vue;
  initExtend(Vue);
  initAssetRegisters(Vue);

}