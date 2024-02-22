import { v4 as generateUUIDv4 } from 'uuid'

export const generateFileName = (fileName: string) => {
  const fileExt = fileName.match(/\.[a-z-A-Z]*/)
  if (!fileExt.length) {
    return fileName
  }

  return generateUUIDv4().slice(0, 30) + fileExt[0]
}
