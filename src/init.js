import { initState } from "./state"
import { compileToFunction } from "./compiler/index";
import { callHook, mountComponent } from "./lifecycle"
import { initGlobalAPI } from "./global-api/index"
import { mergeOptions } from "./utils";
import { nextTick } from "../utils/next-tick";
import { Watcher } from "./observer/watcher";
import { initRender } from "./render";
import { evalJSX } from "./compiler/evalJSX";


export function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    //Vue的内部属性#options 用户传递所以参数
    const vm = this;
    // console.log(vm.constructor.options, options)
    vm.$options = mergeOptions(vm.constructor.options, options);
    // console.log('opt', vm.$options)
    console.log('options: -------', vm.$options);
    callHook(vm, 'beforeCreate');
    initRender(vm);
    initState(vm); // 初始化状态
    callHook(vm, 'created');

    // 通过模板渲染

    if (vm.$options.el) { // 用户提供挂载节点
      vm.$mount(vm.$options.el);
    }
  }

  Vue.prototype.$mount = function (el) {
    el = document.querySelector(el);
    const vm = this;
    // 同时存在template与render使用render，如果没有则使用id=“app”的模板
    // 将template转换为render函数挂载到opts上
    const opts = this.$options;

    if (!opts.render) { // 如果没有render，则编译模板
      let template = opts.template;
      // console.log('opts---', opts);
      if (!template && el) {
        template = el.outerHTML;
      }
      // const render = compileToFunction(template);
      console.log(this.createElement);
      const render = new Function(`with(this){return ${evalJSX(template, { this: this })}}`)
      opts.render = render;
    }
    //  opts.render;
    mountComponent(vm, el);
  }

  Vue.prototype.$nextTick = nextTick;

  Vue.prototype.$watch = function (expOrFn, cb, options = {}) {
    const vm = this;
    options.immediate = options.immediate ? options.immediate : true;
    options.user = true;
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value)
      } catch (error) {
        handleError(error, vm, `callback for immediate watcher "${watcher.expression}"`)
      }
    }
  };
}