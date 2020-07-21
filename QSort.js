function QSort (arr) {
  if (arr.length <= 1) return arr;
  const left = [],
    right = [],
    baseDot = Math.round(arr.length / 2);
  base = arr.splice(baseDot, 1)[ 0 ];
  console.log(base);
  for (let i = 0; i < arr.length; i++) {
    if (arr[ i ] < base) {
      left.push(arr[ i ]);
    } else {
      right.push(arr[ i ]);
    }
  }
  console.log(left, right);
  return QSort(left).concat([ base ], QSort(right))
}

console.log(QSort([ 5, 1, 3, 2, 5 ]))