import { isObject } from "../utils";
import { vnode } from "./vnode";

export function createComponent (vm, tag, data, key, children, Ctor) {
  if (isObject(Ctor)) {
    Ctor = vm.$options._base.extend(Ctor);
  }

  data.hooks = {
    init (vnode) {
      const child = vnode.componentInstance = new Ctor({ _vnode: vnode, propsData: vnode.data, _isComponent: true })
      child.$mount();
    },

  }
  console.log('data: =====', data)
  return vnode(`vue-component-${Ctor.cid}-${tag}`, data, key, undefined, undefined, { Ctor, children });
}