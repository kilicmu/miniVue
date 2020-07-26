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

    this.getter = exprOrFn;
    this.get();
  }

  get () {
    const vm = this.vm
    pushTarget(this);
    this.getter.call(vm);
    popTarget();
  }

  addDep (dep) {
    const id = dep.id;
    dep.addSub(this);
  }

  update () {
    queueWatcher(this);

  }

  run () {
    this.get();
  }

}