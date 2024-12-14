export const API_PREFIX = 'http://localhost:8000'

export const httpCode = {
  success: 'success',
  fail: 'fail',
  notFound: 'notFound',
  unauthorized: 'unauthorized',
  forbidden: 'forbidden',
  validateError: 'validateError',
}

export const typeMap: {
  [key: string]: string
} = {
  str: '字符串',
  int: '整型',
  float: '浮点型',
  bool: '布尔型',
}
