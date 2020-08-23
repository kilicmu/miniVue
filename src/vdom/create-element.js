import { isReservedTag } from "../utils";
import { createComponent } from "./create-component";
import { vnode } from "./vnode";

export function createElement (vm, tag, data, ...children) {

  let { key } = data;
  if (key) {
    delete data[ key ];
  }
  console.log('create-------', children);
  if (isReservedTag(tag)) {
    return vnode(tag, data, key, children, undefined);
  } else {
    let Ctor = vm.$options.components[ tag ];
    console.log('createComponent')
    return createComponent(vm, tag, data, key, children, Ctor);
  }

}

// $createElement("div", {}, $createElement("div", { "onClick": this.handleClick.bind(this) }, $createTextNode(this.name)), $createElement("div", {}, $createTextNode(this.age)))

// export function createElement (vm, tag, data, ...children) {
//   let { key } = data ? data : { key: undefined };
//   if (key) {
//     delete data[ key ];
//   }

//   // children = children || []
//   const ch = [];
//   children.forEach(child => {
//     ch.append(createElement(vm, child));
//   })

//   console.log('ch: ', ch, tag, vm)
//   if (isReservedTag(tag)) {
//     return vnode(tag, data, key, ch, undefined);
//   } else if (tag == null) {
//     return createTextNode(vm, tag);
//   } else {
//     let Ctor = vm.$options.components[ tag ];
//     return createComponent(vm, tag, data, key, children, Ctor);
//   }
// }

export function createTextNode (vm, text) {

  return vnode(undefined, undefined, undefined, undefined, text);
}

