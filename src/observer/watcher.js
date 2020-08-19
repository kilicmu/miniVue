import { popTarget, pushTarget } from "./dep";
import { queueWatcher } from "./scheduler";
let id = 0;
export class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.id = id++;
    this.vm = vm;
    this.exprOrFn = exprOrFn;
    this.cb = cb;
    this.options = options;
    this.user = options.user; // 判断是否是$watch创造的 watcher
    this.value = null;
    this.lazy = options.lazy;
    this.dirty = this.lazy;

    if (typeof exprOrFn === "string") {
      this.getter = function () {
        const path = exprOrFn.split(".");
        let obj = vm;
        for (let p of path) {
          obj = obj[p];
        }
        return obj;
      };
    } else {
      this.getter = exprOrFn;
    }

    this.value = this.lazy ? undefined : this.get();
  }

  get() {
    const vm = this.vm;
    let value = undefined;
    pushTarget(this);
    value = this.getter.call(vm);
    popTarget();
    return value;
  }

  evaluate() {
    this.value = this.get();
    this.dirty = false;
  }

  addDep(dep) {
    const id = dep.id;
    dep.addSub(this);
  }

  update() {
    if (this.lazy) {
      this.dirty = true;
    } else {
      queueWatcher(this);
    }
  }

  run() {
    const newVal = this.get();
    const oldVal = this.value;
    this.value = newVal;
    console.log(this.user);
    if (this.user) {
      this.cb.call(this.vm, newVal, oldVal);
    }
  }
}
