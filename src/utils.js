import { LIFECYCLE_HOOKS } from "./shared/contants";

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
const strategy = {}
LIFECYCLE_HOOKS.forEach(hook => {
  strategy[ hook ] = mergeHook;
})
function mergeHook (parentVal, childVal) {
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal);
    } else {
      return [ childVal ];
    }
  } else {
    return parentVal;
  }
}

export function mergeOptions (parent, child) {
  const options = {};
  function mergeField (key) {
    if (strategy[ key ]) {
      return options[ key ] = strategy[ key ](parent[ key ], child[ key ]);
    }
    if (typeof parent[ key ] === 'object' && typeof child[ key ] === 'object') {
      options[ key ] = {
        ...parent[ key ],
        ...child[ key ]
      }
    } else if (child[ key ] == null) {
      options[ key ] = parent[ key ];
    } else {
      options[ key ] = child[ key ];
    }
    return options
  }
  for (const key in parent) {
    mergeField(key);
  }

  for (const key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key);
    }
  }
  return options
}