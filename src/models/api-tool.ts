import { type BasePaginationResponse, type BaseResponse } from './base'

export type GetApiToolProvidersWithPageResponse = BasePaginationResponse<{
  id: string
  name: string
  icon: string
  description: string
  headers: Array<{
    key: string
    value: string
  }>
  tools: Array<{
    id: string
    name: string
    description: string
    inputs: Array<{
      name: string
      type: string
      required: boolean
      description: string
    }>
  }>
  created_at: number
}>

export type CreateApiToolsRequest = {
  name: string
  icon: string
  description: string
  openapi_schema: string
  headers: Array<{
    key: string
    value: string
  }>
}
export type CreateApiToolsResponse = BaseResponse<unknown>

export type ValidateOpenapiSchemaResponse = BaseResponse<unknown>

export type GetApiToolResponse = BaseResponse<{
  id: string
  name: string
  description: string
  icon: string
  openapi_schema: string
  headers: Array<{
    key: string
    value: string
  }>
  created_at: number
}>

export type UpdateApiToolRequest = {
  name: string
  icon: string
  description: string
  openapi_schema: string
  headers: Array<{
    key: string
    value: string
  }>
}
