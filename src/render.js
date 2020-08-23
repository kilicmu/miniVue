import { createElement, createTextNode } from "./vdom/create-element";
export function renderMixin (Vue) {
  // 获取VNode
  // _c创建元素虚拟节点
  Vue.prototype._c = function () {
    return createElement(this, ...arguments);
  }
  // _a 创建文本虚拟节点
  Vue.prototype._v = function (text) {
    return createTextNode(this, text)
  }
  // _s JSOM.stringify();
  Vue.prototype._s = function (val) {
    return val == null ? '' : (typeof val === 'object' ? JSON.stringify(val) : val);
  }
  Vue.prototype._render = function () {
    const vm = this;

    const { render } = vm.$options
    console.log(render);
    const vnode = render.call(vm, vm.$createElement);

    // console.log('vnode', vnode)
    return vnode;
  }
}


export function initRender (vm) {
  vm.$createElement = (tag, data, ...children) => createElement(vm, tag, data, ...children);
  vm.$createTextNode = (text) => createTextNode(vm, text);
}