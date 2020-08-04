import { isReservedTag } from "../utils";
import { createComponent } from "./create-component";
import { vnode } from "./vnode";

export function createElement (vm, tag, data, ...children) {
  let { key } = data;
  if (key) {
    delete data[ key ];
  }

  if (isReservedTag(tag)) {
    return vnode(tag, data, key, children, undefined);
  } else {
    let Ctor = vm.$options.components[ tag ];
    console.log('cttor----', vm.$options.components, tag, Ctor);
    return createComponent(vm, tag, data, key, children, Ctor);
  }

}

export function createTextNode (text) {

  return vnode(undefined, undefined, undefined, undefined, text);
}

