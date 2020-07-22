import { initGlobalAPI } from "./global-api/index";
import { initMixin } from "./init"
import { lifecycleMixin } from "./lifecycle"
import { renderMixin } from "./render";

function Vue (options) {
  // 初始化操作
  this._init(options);
}

initMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);
initGlobalAPI(Vue);


export default Vue;