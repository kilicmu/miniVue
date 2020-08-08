import { observe } from "./observer/index";
import { isObject } from "./utils";
import { proxy } from "./utils";

export function initState (vm) {
  const opts = vm.$options;
  if (opts.props) {
    initProps(vm);
  }
  if (opts.methods) {
    initMethod(vm);
  }
  if (opts.data) {
    initData(vm);
  }
  // compouted
  // watch

}



function initData (vm) {
  let data = vm.$options.data;
  data = vm._data = typeof data === 'function' ? data.call(vm) : data;
  // 对数据进行观测
  for (const key in data) {
    proxy(vm, '_data', key);
  }
  observe(data);
}

function initProps (vm) {

}

function initMethods (vm) {

}
