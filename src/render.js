import { createElement, createTextNode } from "./vdom/create-element";
export function renderMixin (Vue) {
  // 获取VNode
  // _c创建元素虚拟节点
  Vue.prototype._c = function () {
    return createElement(...arguments);
  }
  // _a 创建文本虚拟节点
  Vue.prototype._v = function (text) {
    return createTextNode(text)
  }
  // _s JSOM.stringify();
  Vue.prototype._s = function (val) {
    return val == null ? '' : (typeof val === 'object' ? JSON.stringify(val) : val);
  }
  Vue.prototype._render = function () {
    const vm = this;
    const { render } = vm.$options
    const vnode = render.call(vm);
    return vnode;
  }
}