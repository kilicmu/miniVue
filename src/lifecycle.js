import { Watcher } from "./observer/watcher";
import { patch } from "./vdom/patch";
export function mountComponent(vm, el) {
  const opts = vm.$options;
  vm.$el = el;
  callHook(vm, "beforeMount");
  const updateComponent = function () {
    callHook(vm, "beforeUpdate");
    // vnode -> dom node
    vm._update(vm._render());
    callHook(vm, "updated");
  };
  // 组件监听
  new Watcher(vm, updateComponent, () => {}, true);
  callHook(vm, "mounted");
}

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this;
    const prevVnode = vm._vnode;
    vm._vnode = vnode;
    if (!prevVnode) {
      vm.$el = patch(vm.$el, vnode);
    } else {
      vm.$el = patch(prevVnode, vnode);
    }
  };
}

export function callHook(vm, hook) {
  const handlers = vm.$options[hook];
  if (handlers) {
    handlers.forEach((i) => i.call(vm));
  }
}
