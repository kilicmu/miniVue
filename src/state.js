import { observe, defineReactive } from "./observer/index";
import { Watcher } from "./observer/watcher";
import { isObject } from "./utils";
import { proxy } from "./utils";
import Dep from "./observer/dep";

export function initState(vm) {
  const opts = vm.$options;
  console.log(opts);
  if (opts.props) {
    initProps(vm, opts.props);
  }
  if (opts.data) {
    initData(vm);
  }
  if (opts.methods) {
    initMethods(vm, opts.methods);
  }
  if (opts.watch) {
    initWatch(vm, opts.watch);
  }

  if (opts.computed) {
    initComputed(vm, opts.computed);
  }
}

function initComputed(vm, computed) {
  const watchers = (vm._computedWatchers = Object.create(null));
  for (let key in computed) {
    const userDef = computed[key];
    const getter = typeof userDef === "function" ? userDef : userDef.get;
    watchers[key] = new Watcher(vm, getter, () => {}, { lazy: true });
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    }
  }
}

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: () => {},
  set: () => {},
};

function defineComputed(target, key, userDef) {
  if (typeof userDef === "function") {
    sharedPropertyDefinition.get = createComputedGetter(key);
    sharedPropertyDefinition.set = () => {};
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? userDef.get
      : createComputedGetter(key);
    sharedPropertyDefinition.set = userDef.set ? userDef.set : () => {};
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter(key) {
  return function computedGetter() {
    const watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      // if (Dep.target) {
      //   watcher.depend();
      // }
      return watcher.value;
    }
  };
}

function initData(vm) {
  let data = vm.$options.data;
  data = vm._data = typeof data === "function" ? data.call(vm) : data;
  // 对数据进行观测
  for (const key in data) {
    proxy(vm, "_data", key);
  }
  observe(data);
}

function initProps(vm, propsOptions) {
  const propsData = vm.$options.propsData;
  const props = (vm._props = {});
  const keys = (vm.$props._propKeys = []);
  for (const key of propsOptions) {
    keys.push(key);
    const value = propsData[key];
    defineReactive(props, key, value);

    if (!(key in vm)) {
      proxy(vm, `_props`, key);
    }
  }
}

function initMethods(vm, methods) {
  const porps = vm.$options.props;
  for (const key in methods) {
    vm[key] =
      typeof methods[key] !== "function"
        ? function () {}
        : methods[key].bind(vm);
  }
}

function initWatch(vm, watch) {
  for (const key in watch) {
    const handler = watch[key];
    if (Array.isArray[handler]) {
      for (let h of handler) {
        createWatcher(vm, key, h);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher(vm, expOrFn, handler, options) {
  if (typeof handler === "object") {
    options = handler;
    handler = options.handler;
  }
  if (typeof handler === "string") {
    handler = vm[handler];
  }

  return vm.$watch(expOrFn, handler, options);
}

export function stateMixin(Vue) {
  const dataDef = {};
  dataDef.get = function () {
    return this._data;
  };
  const propsDef = {};
  propsDef.get = function () {
    return this._props;
  };
  Object.defineProperty(Vue.prototype, "$data", dataDef);
  Object.defineProperty(Vue.prototype, "$props", propsDef);
}
