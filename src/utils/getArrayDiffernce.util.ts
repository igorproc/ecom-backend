export const getArrayDifference = <T>(firstArray: T[], secondArray: T[], keys: (keyof T)[]) => {
  return firstArray.filter(item1 => {
    return !secondArray
      .some(item2 => keys.every(key => item1[key] === item2[key]))
  })
}
