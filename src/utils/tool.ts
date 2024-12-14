import { typeMap } from '@/config'

export const formatInputType = (type: string) => {
  return typeMap[type] || type
}
