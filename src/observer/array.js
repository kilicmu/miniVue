

const oldArrayMethods = Array.prototype;

const methods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'sort',
  'reverse',
  'splice'
]

export const arrayMethods = Object.create(oldArrayMethods);

methods.forEach(method => {
  arrayMethods[ method ] = function (...args) {
    const ret = oldArrayMethods[ method ].apply(this, args);
    const ob = this.__ob__;
    let inserted;

    switch (method) {
      case "push":
      case "unshift":
        inserted = args;
        break;
      case 'splice': // splice方法的第三个参数才是插入的值
        inserted = args.slice(2);
        break;
      default:
        break;
    }

    inserted && ob.observeArray(inserted);
    return ret;
  }
})