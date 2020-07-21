// let p = new Promise((resolve, reject) => {
//   console.log(1)
//   resolve(2);
//   console.log(3)
// })
// p.then(r => { throw new Error("error") }).catch((e) => { return e }).then(e => { console.log('t', e) });

// Function.prototype.call = function (ctx, ...args) {
//   ctx = ctx ? ctx : global;
//   ctx.fn = this;
//   ctx.fn(...args)
// }

// console.log

// function O (name) {
//   this.name = name;
//   return {
//     haha: 'xxx'
//   }
// }
// O.prototype.say = function () {
//   console.log(this.name);
// }

// function mockNew (constructorFunc, ...args) {
//   const prototype = constructorFunc.prototype
//   const instance = Object.create(prototype)
//   const ret = constructorFunc.apply(instance, args)
//   if (ret instanceof Object) {
//     return ret;
//   } else {
//     return instance;
//   }

// }

// const instance = mockNew(O, 'kilic');
// console.log('0.1 > ' + 0.1.toString(2));
// console.log('0.2 > ' + 0.2.toString(2));

// console.log(console);

// let obj = { name: 'kilic', age: 10, deep: { kaka: "我是kaka" } }

// function deepClone (obj) {
//   if (obj == null) return obj;
//   if (obj instanceof Date) return new Date(obj);
//   if (obj instanceof RegExp) return new RegExp(obj);
//   if (typeof obj !== 'object') return obj;
//   // 处理数组和对象
//   let cloneObj = new obj.constructor;
//   for (let i in obj) {
//     if (obj.hasOwnPrototype(key)) {
//       cloneObj[ key ] = deepClone(obj[ key ]);
//     }
//   }
// }
// function fn1 (str) {
//   return str + "fn1";
// }
// function fn2 (str) {
//   return str + 'fn2';
// }
// function fn3 (str) {
//   return str + "fn3";
// }

// // function compose (...fns) {
// //   const lastFn = fns.pop();
// //   return function (...params) {
// //     return fns.reduceRight((a, b) => b(a), lastFn(params))
// //   }
// // }
// let compose = (...fns) => fns.reduce((a, b) => (...args) => a(b(args)))

// console.log(compose(fn1, fn2, fn3)('no fn'));

// function Father (name) {
//   console.log(name);
//   this.name = name;
// }
// Father.prototype.say = function () { console.log(`im ${this.name}`) };

// function Son (name, age) {
//   this.name = name;
//   this.age = 12;
//   Father.call(this, name);
// }

// Son.prototype = Object.create(Father.prototype, { constructor: { value: Son } });
// Son.prototype.sonMthod = function () {
//   console.log(`im ${this.name}`);
// }

// const son = new Son('kilic', 12);
// son.say();

// function to (arr) {
//   let i = 0;
//   let j = i + 1;
//   const res = [];
//   for (let _i in arr) {
//     if (arr[ _i ] + 1 !== arr[ j ]) {
//       if (j - 1 === i && i != 0) {
//         console.log(j, i);
//         res.push(arr[ i ]);
//       } else {
//         const end = arr[ j - 1 ];
//         const from = arr[ i ];
//         res.push(`${from} -> ${end}`);
//       }
//       i = j;
//     }
//     j++;
//   }
//   console.log(res);
// }

// let td = [ 1, 2, 3, 4, 6, 8, 9 ]
// to(td);

// const fn = () => { console.log(this) }
// c = fn.bind({ name: 'tom' });

// fn()
// c()

// class 

// class Queue {
//   cbs = [];
//   it = null;
//   task (timeout, cb) {
//     const item = () => {
//       setTimeout(() => {
//         cb();
//         this.it.next();
//       }, timeout);
//     }
//     this.cbs.push(item);
//   }

//   start () {
//     (function* gen () {
//       this.cbs.forEach(i => i());
//     })()
//   }
// }

// var lengthOfLongestSubstring = function (s) {
//   if (s.length < 2) {
//     return 1;
//   }
//   const arr = [ ...s ];
//   let map = {};
//   let head = 0;
//   let res = 0;
//   for (let i in arr) {
//     if (!map[ arr[ i ] ]) {
//       map[ arr[ i ] ] = i;

//     } else {
//       head = Number(map[ arr[ i ] ]) + 1;
//       map = {};
//     }

//     res = i - head > res ? i - head : res;
//   }
//   return res;
// };

// console.log(lengthOfLongestSubstring("abcabcbb"))

// const deepClone = (obj, map = new WeakMap()) => {
//   if (typeof obj !== 'object') return obj;
//   if (obj instanceof Date) return new Date(obj);
//   if (obj instanceof RegExp) return new RegExp(obj);
//   if (map.get(obj)) return map.get(obj)
//   const tmpObj = new obj.constructor();
//   map.set(obj, tmpObj);
//   for (let i in obj) {
//     if (obj.hasOwnProperty(i)) {
//       tmpObj[ i ] = deepClone(obj[ i ], map);
//     }
//   }
//   return tmpObj;
// }
// const a = { a: 10, b: { a: 100, b: 10 } };
// const b = deepClone(a)
// a.b.a = 10;
// console.log(b);

// function QSort (array) {
//   const len = array.length;
//   if (len <= 1) return array;
//   const left = [],
//     right = [],
//     dot = Math.round(len / 2);
//   const dotNum = array.splice(dot, 1)[ 0 ];
//   for (let _i of array) {
//     if (_i > dotNum) {
//       left.push(_i);
//     } else {
//       right.push(_i);
//     }
//   }
//   return [ ...QSort(left) ].concat([ dotNum ], QSort(right))
// }

// console.log(QSort([ 1, 5, 1, 3, 4, 2 ]))

// const arr = [ [ 1, 2, 3 ], [ 1, 2, 3, [ 1, 3, 5, [ 1, 4, 5 ] ] ] ];
// arr.forEach(item => {
// })
//1. console.log(arr.flat(Infinity));
//2. arr.toString().split(',')

// const rect = [
//   [ 1, 2, 3 ],
//   [ 4, 5, 6 ],
//   [ 7, 8, 9 ]
// ]

// console.log(rect.reverse().map(item => (item.reverse())));

// function fib (n) {
//   if (n === 0 || n === 1) {
//     return 1;
//   }
//   return fib(n - 1) + fib(n - 2);
// }

// console.log(fib(5));

// function myInstanceof (L, R) {
//   const RPrototype = R.prototype;
//   let LProto = L.__proto__
//   while (true) {
//     if (LProto === RPrototype) {
//       return true;
//     }
//     if (LProto === null) {
//       return false;
//     }
//     LProto = LProto.__proto__;
//   }
// }
// const arr = {};
// console.log(myInstanceof(arr, Array));

// const curry = (fn, arr = []) => (fn.length === arr.length ? fn(...arr) : (...args) => curry(fn, [ ...arr, ...args ]))

// function f (a, b, c) { return a + b + c };

// const curryedFn = curry(f);
// console.log(curryedFn(1, 2)(3));