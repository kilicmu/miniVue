export function isObject (data) {
  return typeof data === "object" && data !== null;
}

export function proxy (vm, source, key) {
  Object.defineProperty(vm, key, {
    get () {
      return vm[ source ][ key ];
    },
    set (newValue) {
      vm[ source ][ key ] = newValue;
    }
  })
}