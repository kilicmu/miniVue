import { observe, defineReactive } from "./observer/index";
import { isObject } from "./utils";
import { proxy } from "./utils";

export function initState (vm) {
  const opts = vm.$options;
  if (opts.props) {
    initProps(vm, opts.props);
  }
  if (opts.data) {
    initData(vm);
  }
  if (opts.methods) {
    initMethods(vm, opts.methods);
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

function initProps (vm, propsOptions) {
  const propsData = vm.$options.propsData
  const props = vm._props = {}
  const keys = vm.$props._propKeys = [];
  for (const key in propsOptions) {
    keys.push(key);
    const value = props.value;
    defineReactive(props, key, value);

    if (!(key in vm)) {
      proxy(vm, `_props`, key)
    }
  }

}

function initMethods (vm, methods) {
  const porps = vm.$options.props;
  for (const key in methods) {
    vm[ key ] = typeof methods[ key ] !== 'function' ? function () { } : methods[ key ].bind(vm);
  }
}

export function stateMixin (Vue) {
  const dataDef = {}
  dataDef.get = function () { return this._data }
  const propsDef = {}
  propsDef.get = function () { return this._props }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);
}
