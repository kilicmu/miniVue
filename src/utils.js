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

strategy[ 'components' ] = function (parentVal, childVal) {

  const res = Object.create(parentVal);
  if (childVal) {
    for (let key in childVal) {
      res[ key ] = childVal[ key ];
    }
  }
  return res;
}

export function mergeOptions (parent, child) {
  const options = {};
  function mergeField (key) {
    if (strategy[ key ]) {
      // debugger
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


export function isReservedTag (tag) {
  const str = 'input,div,ul,li,span';
  const obj = {}
  str.split(',').forEach(key => {
    obj[ key ] = true
  })
  return !!obj[ tag ];
}

