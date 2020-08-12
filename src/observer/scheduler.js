import { nextTick } from "../../utils/next-tick";

let has = {};
let flushing = false;
let queue = [];

function flushSchedulerQueue () {
  queue.forEach(watcher => {
    watcher.run();

  })
  has = {};
  queue = [];
}

export function queueWatcher (watcher) {

  const id = watcher.id;
  if (has[ id ] == null) {
    has[ id ] = true;
    if (!flushing) {
      queue.push(watcher)
    }
    nextTick(flushSchedulerQueue, this);
  }
}