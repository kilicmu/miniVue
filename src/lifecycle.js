import { Watcher } from "./observer/watcher";
import { patch } from "./vdom/patch";
export function mountComponent (vm, el) {
  const opts = vm.$options;
  vm.$el = el;
  callHook(vm, 'beforeMount');
  const updateComponent = function () {
    callHook(vm, 'beforeUpdate');
    // 1. 通过_render方法生成虚拟dom
    // 2. _update方法通过vnode生成真实dom
    vm._update(vm._render());
    callHook(vm, 'updated');
  }
  // 通过生成Watcher达成首次渲染
  new Watcher(vm, updateComponent, () => { }, true);
  callHook(vm, 'mounted');
}

export function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this;
    // vm.$el = patch(vm.$el, vnode);
    const prevVnode = vm._vnode;
    vm._vnode = vnode;
    if (!prevVnode) {
      vm.$el = patch(vm.$el, vnode);
    } else {
      vm.$el = patch(prevVnode, vnode);
    }
  }
}

export function callHook (vm, hook) {
  const handlers = vm.$options[ hook ];
  if (handlers) {
    handlers.forEach(i => i.call(vm));
  }
}