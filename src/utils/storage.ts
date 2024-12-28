export const storage = {
  get: (key: string, defaultValue: unknown = '') => {
    const value = localStorage.getItem(key)
    if (value) {
      try {
        return JSON.parse(value)
      } catch {
        return value
      }
    }
    return defaultValue
  },
  set: (key: string, value: unknown) => {
    if (typeof value === 'string') {
      localStorage.setItem(key, value)
    } else {
      localStorage.setItem(key, JSON.stringify(value))
    }
  },
  remove: (key: string) => {
    localStorage.removeItem(key)
  },
  clear: () => {
    localStorage.clear()
  },
}
