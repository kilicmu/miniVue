const obj = {
  a: 1
}

const newObj = JSON.parse(JSON.stringify(obj))
Object.defineProperty(obj, 'a', {
  get () {
    console.log("--get--")
    return newObj.a;
  },
  set (newVal) {
    console.log("--set--")
    newObj.a = newVal;
  }
})

obj.a = 2;