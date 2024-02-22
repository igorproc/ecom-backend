export const getPageDataSize = (page: number, size: number, defaultSize: number) => {
  if (!page && !size) {
    return {
      skip: 0,
      values: defaultSize
    }
  }

  if (page === 1) {
    return {
      skip: 0,
      values: size
    }
  }

  if (!page) {
    return {
      skip: 0,
      values: size
    }
  }

  if (!size) {
    return {
      skip: page * defaultSize,
      values: defaultSize
    }
  }

  return {
    skip: page,
    values: size,
  }
}
