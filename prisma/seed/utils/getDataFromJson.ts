// Node Deps
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export const getDataFromJson = <T>(relativePath: string): T | null => {
  const absolutePath = join(__dirname, '../json', relativePath)
  try {
    const fileData = readFileSync(absolutePath, 'utf-8')
    if (!fileData) {
      return null
    }

    return JSON.parse(fileData) as T;
  } catch (error) {
    console.error(`Json file read error: ${absolutePath}`)

    if (error.code === 'ENOENT') {
      console.error('File not found!')
    } else if (error.code === 'EACCES') {
      console.error('Permission denied!')
    } else {
      throw error
    }
  }
}
