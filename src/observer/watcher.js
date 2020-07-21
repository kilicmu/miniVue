import { popTarget, pushTarget } from "./dep";

export class Watcher {
  constructor (vm, exprOrFn, cb, options) {
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
    this.get();
  }

}