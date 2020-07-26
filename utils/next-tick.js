const callbacks = []

let pending = false;
const p = Promise.resolve();
/**
 * 清空callbacks
 */
function flushCallbacks () {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  copies.forEach(copies => {
    copies();
  })
}

function timerFunc () {
  p.then(flushCallbacks);
}

export function nextTick (cb, ctx) {
  let _resolve;
  callbacks.push(() => {
    if (cb) {
      cb.call(ctx);
    } else if (_resolve) {
      _resolve(ctx);
    }
  })

  if (!pending) {
    pending = true;
    timerFunc();
  }

  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve;
    })
  }

}