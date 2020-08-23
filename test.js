// const compose = (...funcs) => (...args) => funcs.reduce((a, b) => (a(b(...args))))

// function f1 (a, b, c) {
//   return a + b + c;
// }
// function f2 (age) {
//   return age + 1
// }

// console.log(compose(f2, f1)(3, 4, 5));


const obj = {
  fn () {
    console.log('fn');
  }
}

for (const i in obj) {
  fn = obj[ i ];
  console.log(fn())
}