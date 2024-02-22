export const getTotalPagesBySize = (totalProducts: number, pageSize: number) => {
  const decimalPages = totalProducts / pageSize
  const moduloPages = totalProducts % pageSize ? 1 : 0

  return decimalPages + moduloPages
}
