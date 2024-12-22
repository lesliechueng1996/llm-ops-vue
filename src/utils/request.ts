import { API_PREFIX, httpCode } from '@/config'
import type { BaseResponse } from '@/models/base'
import { Message } from '@arco-design/web-vue'

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
      Message.error('请求超时')
    }, TIMEOUT)

    fetch(urlWithPrefix, options as RequestInit)
      .then((res) => res.json() as Promise<BaseResponse<unknown>>)
      .then((json) => {
        if (json.code !== httpCode.success) {
          Message.error(json.message)
          reject(json)
          return
        }

        resolve(json as T)
      })
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

type ServerEvent = {
  event: string
  data: {
    id: string
    event: string
    data: unknown
  }
}

export const ssePost = async function* (url: string, fetchOptions: FetchOptions) {
  const options = { ...baseFetchOptions, method: 'POST', ...fetchOptions }
  const urlWithPrefix = `${API_PREFIX}${url.startsWith('/') ? url : `/${url}`}`
  if (options.body) {
    options.body = JSON.stringify(options.body)
  }

  const response = await fetch(urlWithPrefix, options as RequestInit)

  if (!response.ok) {
    throw new Error('网络请求失败')
  }

  if (!response.body) {
    throw new Error('不支持的响应类型')
  }

  const reader = response.body.getReader()
  const textDecoder = new TextDecoder()
  while (true) {
    const { done, value } = await reader.read()
    if (done || !value) {
      break
    }
    const text = textDecoder.decode(value, { stream: true })
    const lines = text.split('\n')
    const pair: {
      event: ServerEvent['event'] | null
      data: ServerEvent['data'] | null
    } = {
      event: null,
      data: null,
    }
    for (const line of lines) {
      if (line.startsWith('event: ')) {
        pair.event = line.substring(7)
      } else if (line.startsWith('data: ')) {
        pair.data = JSON.parse(line.substring(6))
      }

      if (!line.trim() && pair.event !== null && pair.data !== null) {
        yield { ...(pair as ServerEvent) }
        pair.event = null
        pair.data = null
      }
    }
  }
}
