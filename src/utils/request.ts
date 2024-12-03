import { API_PREFIX } from '@/config'

const TIMEOUT = 100 * 1000

const baseFetchOptions = {
  method: 'GET',
  mode: 'cors',
  credentials: 'include',
  headers: new Headers({
    'Content-Type': 'application/json',
  }),
  redirect: 'follow',
}

type FetchOptions = Omit<RequestInit, 'body'> & {
  params?: Record<string, string | number | boolean>
  body?: BodyInit | Record<string, unknown> | null
}

const baseFetch = <T>(url: string, fetchOptions: FetchOptions): Promise<T> => {
  const controller = new AbortController()
  const options = { ...baseFetchOptions, ...fetchOptions, signal: controller.signal }
  let urlWithPrefix = `${API_PREFIX}${url.startsWith('/') ? url : `/${url}`}`

  const { method, params, body } = options

  if (method === 'GET' && params) {
    const searchParams = []
    for (const key in params) {
      searchParams.push(`${key}=${encodeURIComponent(params[key])}`)
    }
    if (urlWithPrefix.includes('?')) {
      urlWithPrefix += `&${searchParams.join('&')}`
    } else {
      urlWithPrefix += `?${searchParams.join('&')}`
    }

    delete options.params
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      controller.abort()
      reject(new Error('timeout'))
    }, TIMEOUT)

    fetch(urlWithPrefix, options as RequestInit)
      .then((res) => res.json())
      .then(resolve)
      .catch(reject)
      .finally(() => {
        clearTimeout(timeoutId)
      })
  })
}

export const request = <T>(url: string, options: FetchOptions = {}): Promise<T> => {
  return baseFetch(url, options)
}

export const get = <T>(url: string, options: FetchOptions = {}): Promise<T> => {
  return baseFetch(url, { ...options, method: 'GET' })
}

export const post = <T>(url: string, options: FetchOptions = {}): Promise<T> => {
  return baseFetch(url, { ...options, method: 'POST' })
}

export const put = <T>(url: string, options: FetchOptions = {}): Promise<T> => {
  return baseFetch(url, { ...options, method: 'PUT' })
}

export const del = <T>(url: string, options: FetchOptions = {}): Promise<T> => {
  return baseFetch(url, { ...options, method: 'DELETE' })
}
