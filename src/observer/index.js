import { isObject } from "../utils";
import { arrayMethods } from "./array";
import Dep from "./dep";
class Observer {
  constructor (data) {
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false,
      configurable: false
    })
    // 不需要对数组索引进行拦截
    if (Array.isArray(data)) {
      data.__proto__ = arrayMethods;

    } else {
      this.walk(data); //对数据分步处理
    }
  }

  walk (data) {
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[ key ]); // 定义响应式变化
    })
  }

  observeArray (data) {
    for (const i in data) {
      observe(data[ i ]);   // 解决数组内对象的响应式
    }
  }
}

function defineReactive (data, key, value) {
  const dep = new Dep();
  observe(value);
  // debugger
  // if (data.__ob__ instanceof Observer) {
  //   return;
  // }
  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    get () {
      if (Dep.target) {
        dep.depend();
      }
      return value;
    },
    set (newValue) {
      if (newValue === value) return;
      observe(value)
      value = newValue;
      dep.notify();
    }
  })
}



export function observe (data) {
  // TODO对数据监控
  if (!isObject(data)) {
    return;
  }
  // 对data数据做definePropert
  return new Observer(data);
}