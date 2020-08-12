import { popTarget, pushTarget } from "./dep";
import { queueWatcher } from "./scheduler";
let id = 0;
export class Watcher {
  constructor (vm, exprOrFn, cb, options) {
    this.id = id++;
    this.vm = vm;
    this.exprOrFn = exprOrFn;
    this.cb = cb;
    this.options = options;
    this.user = options.user; // 判断是否是$watch创造的 watcher
    console.log(this.user);
    if (typeof exprOrFn === "string") {
      this.getter = function () {
        const path = exprOrFn.split('.');
        let obj = vm;
        for (let p of path) {
          obj = obj[ p ];
        }
        return obj;
      }
    } else {
      this.getter = exprOrFn;
    }

    this.value = this.get();
  }

  get () {
    const vm = this.vm
    pushTarget(this);
    const value = this.getter.call(vm);
    popTarget();
    return value;
  }

  addDep (dep) {
    const id = dep.id;
    dep.addSub(this);
  }

  update () {
    queueWatcher(this);

  }

  run () {
    const newVal = this.get();
    const oldVal = this.value;
    this.value = newVal;
    console.log(this.user);
    if (this.user) {
      this.cb.call(this.vm, newVal, oldVal)
    }
  }

}