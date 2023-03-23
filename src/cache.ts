import type { ImageColorsResult } from './types'

let storage: Record<string, ImageColorsResult | undefined> = {}

const getItem = (key: string) => {
  return storage[key]
}

const setItem = (key: string, value: ImageColorsResult) => {
  storage[key] = value
}

const removeItem = (key: string) => {
  return delete storage[key]
}

const clear = () => {
  storage = {}
  return true
}

export const cache = {
  getItem,
  setItem,
  removeItem,
  clear,
}
