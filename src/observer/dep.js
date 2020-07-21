let uid = 0

export default class Dep {
  constructor () {
    this.id = uid++
    this.subs = [];
  }

  addSub (sub) {
    this.subs.push(sub);
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }

  notify () {
    const subs = this.subs.slice()
    subs.forEach(watcher => {
      watcher.update();
    })
  }
}

//这个target是为了获取依赖的Watcher
Dep.target = null;
const targetStack = []
export function pushTarget (watcher) {
  Dep.target = watcher;
  targetStack.push(watcher);
}

export function popTarget () {
  targetStack.pop();
  Dep.target = targetStack[ targetStack.length - 1 ]
}