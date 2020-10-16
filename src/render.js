import { createElement, createTextNode } from "./vdom/create-element";
export function renderMixin(Vue) {
  // 获取vnode
  Vue.prototype._render = function () {
    const vm = this;

    const { render } = vm.$options;
    const vnode = render.call(vm, vm.$createElement);

    return vnode;
  };
}

export function initRender(vm) {
  vm.$createElement = (tag, data, ...children) =>
    createElement(vm, tag, data, ...children);
  vm.$createTextNode = (text) => createTextNode(vm, text);
}
