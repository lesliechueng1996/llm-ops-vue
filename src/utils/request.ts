import { API_PREFIX, httpCode } from '@/config'
import type { BaseResponse } from '@/models/base'
import { Message } from '@arco-design/web-vue'
import { useCredentialStore } from '@/stores/credential'
import router from '@/router'

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

  const { credential, clear: clearCredential } = useCredentialStore()
  const { access_token } = credential

  if (access_token) {
    ;(options.headers as Headers).set('Authorization', `Bearer ${access_token}`)
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
        if (json.code === httpCode.unauthorized) {
          clearCredential()
          reject(json)
          router.replace('/auth/login')
          return
        }
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
    task_id: string
    event: string
    thought: string
    observation: string
    tool: string
    tool_input: string
    answer: string
    latency: number
  }
}

export const ssePost = async function* (url: string, fetchOptions: FetchOptions) {
  const options = { ...baseFetchOptions, method: 'POST', ...fetchOptions }
  const urlWithPrefix = `${API_PREFIX}${url.startsWith('/') ? url : `/${url}`}`
  if (options.body) {
    options.body = JSON.stringify(options.body)
  }

  const { credential } = useCredentialStore()
  const { access_token } = credential

  if (access_token) {
    ;(options.headers as Headers).set('Authorization', `Bearer ${access_token}`)
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

interface UploadOptions {
  onProgress?: (progress: number) => void
  headers?: Record<string, string>
}

export const upload = <T extends BaseResponse<unknown>>(
  url: string,
  file: File,
  options: UploadOptions,
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const formData = new FormData()

    const { credential, clear: clearCredential } = useCredentialStore()
    const { access_token } = credential

    // 添加文件到FormData
    formData.append('file', file)

    // 处理上传进度
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && options.onProgress) {
        const progress = (e.loaded / e.total) * 100
        options.onProgress(progress)
      }
    })

    // 处理请求完成
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText) as BaseResponse<unknown>
          if (response.code === httpCode.unauthorized) {
            clearCredential()
            reject(response)
            router.replace('/auth/login')
            return
          }
          if (response.code !== httpCode.success) {
            Message.error(response.message)
            reject(response)
            return
          }
          resolve(response as T)
        } catch (e) {
          console.error(e)
          Message.error('解析响应失败')
          reject(new Error('解析响应失败'))
        }
      } else {
        Message.error('上传失败')
        reject(new Error('上传失败'))
      }
    })

    // 处理错误
    xhr.addEventListener('error', () => {
      Message.error('上传失败')
      reject(new Error('上传失败'))
    })

    // 处理终止
    xhr.addEventListener('abort', () => {
      Message.error('上传已取消')
      reject(new Error('上传已取消'))
    })

    // 发送请求
    const urlWithPrefix = `${API_PREFIX}${url.startsWith('/') ? url : `/${url}`}`
    xhr.open('POST', urlWithPrefix, true)

    // 设置请求头
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value)
      })
    }

    if (access_token) {
      xhr.setRequestHeader('Authorization', `Bearer ${access_token}`)
    }

    xhr.withCredentials = true
    xhr.send(formData)
  })
}
