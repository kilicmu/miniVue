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

export function mergeOptions (parent, child) {
  const options = {};
  function mergeField (key) {
    if (typeof parent[ key ] === 'object' && typeof child[ key ] === 'object') {
      options[ key ] = {
        ...parent[ key ],
        ...child[ key ]
      }
    } else if (child[ key ] === null) {
      options[ key ] = parent[ key ];
    } else {
      options[ key ] = child[ key ];
    }
    return options
  }
  for (const key in parent) {
    mergetField(key);
  }

  for (const key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key);
    }
  }
}