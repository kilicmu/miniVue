import { Watcher } from "./observer/watcher";
import { patch } from "./vdom/patch";
export function mountComponent (vm, el) {
  const opts = vm.$options;
  vm.$el = el;
  const updateComponent = function () {
    // 1. 通过_render方法生成虚拟dom
    // 2. _update方法通过vnode生成真实dom
    vm._update(vm._render());
  }
  // 通过生成Watcher达成首次渲染
  new Watcher(vm, updateComponent, () => { }, true);
}

export function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this;
    // vm.$el = patch(vm.$el, vnode);
    vm.$el = patch(vm.$el, vnode);
  }
}