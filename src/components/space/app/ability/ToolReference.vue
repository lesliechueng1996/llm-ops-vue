<script setup lang="ts">
import { useDraftConfigStore } from '@/stores/draft-config'
import {
  type GetCategoriesResponse,
  type GetSpecificBuiltinToolResponse,
  type GetBuiltinToolsResponse,
} from '@/models/builtin-tool'
import { formatInputType } from '@/utils/tool'
import { computed, reactive, ref, watch } from 'vue'
import { getCategories, getSpecificBuiltinTool, getBuiltinTools } from '@/services/builtin-tool'
import type { GetDraftConfigResponse } from '@/models/app-model'
import { getApiToolProvidersWithPage, getSpecificApiTool } from '@/services/api-tool'
import type {
  GetSpecificApiToolResponse,
  GetApiToolProvidersWithPageResponse,
} from '@/models/api-tool'
import { API_PREFIX } from '@/config'
import { usePagination } from '@/hooks/use-pagination'
import { Message } from '@arco-design/web-vue'

type Tool = GetDraftConfigResponse['data']['tools'][number]
type SelectedTool = {
  resp: Tool
  data: GetSpecificBuiltinToolResponse['data'] | GetSpecificApiToolResponse['data']
}

const draftConfigStore = useDraftConfigStore()

// Tool Settings Drawer
const toolSettingsVisible = ref(false)
const selectedTool = ref<SelectedTool | null>(null)
const tabKey = ref<'info' | 'settings'>('info')
const settingsForm = reactive<Record<string, string | number | boolean>>({})

const handleSelectTool = async (tool: Tool) => {
  toolSettingsVisible.value = true
  if (tool.type === 'builtin_tool') {
    const res = await getSpecificBuiltinTool(tool.provider.id, tool.tool.id)
    selectedTool.value = {
      resp: tool,
      data: res.data,
    }
    tabKey.value = 'settings'
    for (const param of res.data.params) {
      settingsForm[param.name] = tool.tool.params[param.name] || param.default
    }
  } else {
    const res = await getSpecificApiTool(tool.provider.id, tool.tool.name)
    selectedTool.value = {
      resp: tool,
      data: res.data,
    }
    tabKey.value = 'info'
  }
}

const saveSettings = async () => {
  if (!selectedTool.value) {
    return
  }
  let changedTool: Tool | null = null
  const otherTools: Tool[] = []
  for (const tool of draftConfigStore.tools) {
    if (
      tool.provider.id === selectedTool.value.resp.provider.id &&
      tool.tool.id === selectedTool.value.resp.tool.id
    ) {
      changedTool = tool
    } else {
      otherTools.push(tool)
    }
  }
  if (changedTool) {
    changedTool.tool.params = settingsForm
    draftConfigStore.tools = [...otherTools, changedTool]
  }
  await draftConfigStore.saveTools()
}

// Add Tool
const toolSelectorVisible = ref(false)
const toolSelectorTab = ref<'api' | 'builtin'>('builtin')
const toolSelectorCategory = ref<string>('')
const categories = ref<GetCategoriesResponse['data']>([])
const builtinTools = ref<GetBuiltinToolsResponse['data']>([])
const {
  data: allApiToolProviders,
  reloadData,
  needShowLoadMore,
} = usePagination(getApiToolProvidersWithPage, false)

const handleAddTool = async () => {
  const res = await Promise.all([getCategories(), getBuiltinTools()])
  categories.value = res[0].data
  builtinTools.value = res[1].data

  toolSelectorVisible.value = true
}

const displayBuiltinTools = computed(() => {
  const result: Array<
    GetBuiltinToolsResponse['data'][number] & {
      tools: Array<
        GetBuiltinToolsResponse['data'][number]['tools'][number] & { isReferencedTool: boolean }
      >
    }
  > = []

  for (const provider of builtinTools.value) {
    if (!provider.category.includes(toolSelectorCategory.value)) {
      continue
    }

    const tools: Array<
      GetBuiltinToolsResponse['data'][number]['tools'][number] & { isReferencedTool: boolean }
    > = []

    const tempProvider = {
      ...provider,
      tools: tools,
    }

    for (const tool of provider.tools) {
      const isReferencedTool = draftConfigStore.tools.some(
        (t) =>
          t.type === 'builtin_tool' && t.provider.id === provider.name && t.tool.id === tool.name,
      )

      tempProvider.tools.push({
        ...tool,
        isReferencedTool,
      })
    }

    result.push(tempProvider)
  }

  return result
})

const displayApiTools = computed(() => {
  const result: Array<
    GetApiToolProvidersWithPageResponse['data']['list'][number] & {
      tools: Array<
        GetApiToolProvidersWithPageResponse['data']['list'][number]['tools'][number] & {
          isReferencedTool: boolean
        }
      >
    }
  > = []

  for (const provider of allApiToolProviders.value) {
    const tools: Array<
      GetApiToolProvidersWithPageResponse['data']['list'][number]['tools'][number] & {
        isReferencedTool: boolean
      }
    > = []

    const tempProvider = {
      ...provider,
      tools: tools,
    }

    for (const tool of provider.tools) {
      const isReferencedTool = draftConfigStore.tools.some(
        (t) => t.type === 'api_tool' && t.provider.id === provider.id && t.tool.id === tool.id,
      )

      tempProvider.tools.push({
        ...tool,
        isReferencedTool,
      })
    }

    result.push(tempProvider)
  }

  return result
})

let firstLoad = true

watch(toolSelectorTab, () => {
  if (toolSelectorTab.value === 'api' && firstLoad) {
    reloadData()
    firstLoad = false
  }
})

const handleSelectorClose = () => {
  toolSelectorVisible.value = false
  toolSelectorTab.value = 'builtin'
  toolSelectorCategory.value = ''
  firstLoad = true
}

const handleDeleteTool = async (
  type: 'builtin_tool' | 'api_tool',
  provider_id: string,
  tool_id: string,
) => {
  draftConfigStore.tools = draftConfigStore.tools.filter((t) => {
    return t.type !== type || t.provider.id !== provider_id || t.tool.id !== tool_id
  })
  await draftConfigStore.saveTools()
}

const handleReferenceBuiltinTool = async (
  provider: GetBuiltinToolsResponse['data'][number],
  tool: GetBuiltinToolsResponse['data'][number]['tools'][number],
) => {
  if (draftConfigStore.tools.length >= 5) {
    Message.error('最多支持 5 个扩展插件')
    return
  }
  draftConfigStore.tools = [
    ...draftConfigStore.tools,
    {
      type: 'builtin_tool',
      provider: {
        id: provider.name,
        name: provider.name,
        label: provider.label,
        icon: `${API_PREFIX}/builtin-tools/${provider.name}/icon`,
        description: provider.description,
      },
      tool: {
        id: tool.name,
        name: tool.name,
        label: tool.label,
        description: tool.description,
        params: tool.params.reduce(
          (newObj, current) => {
            newObj[current.name] = current.default
            return newObj
          },
          {} as Record<string, string | number | boolean>,
        ),
      },
    },
  ]
  await draftConfigStore.saveTools()
}

const handleReferenceApiTool = async (
  provider: GetApiToolProvidersWithPageResponse['data']['list'][number],
  tool: GetApiToolProvidersWithPageResponse['data']['list'][number]['tools'][number],
) => {
  if (draftConfigStore.tools.length >= 5) {
    Message.error('最多支持 5 个扩展插件')
    return
  }
  draftConfigStore.tools = [
    ...draftConfigStore.tools,
    {
      type: 'api_tool',
      provider: {
        id: provider.id,
        name: provider.name,
        label: provider.name,
        icon: provider.icon,
        description: provider.description,
      },
      tool: {
        id: tool.id,
        name: tool.name,
        label: tool.name,
        description: tool.description,
        params: {},
      },
    },
  ]
  await draftConfigStore.saveTools()
}
</script>

<template>
  <a-collapse-item header="扩展插件" key="tool-reference">
    <p v-if="draftConfigStore.tools.length === 0" class="text-xs text-gray-500">
      为应用添加扩展插件，以增强应用的能力，最多支持 5 个。
    </p>
    <div v-else class="space-y-1">
      <div
        v-for="tool in draftConfigStore.tools"
        :key="tool.provider.id + '-' + tool.tool.id"
        class="flex items-center justify-between gap-2 px-2 py-2.5 bg-gray-200 rounded-lg group cursor-pointer"
      >
        <div class="flex items-center gap-2">
          <a-avatar class="size-8 shrink-0" shape="square">
            <img :src="tool.provider.icon" :alt="tool.tool.name" />
          </a-avatar>
          <div>
            <p class="text-sm font-medium">{{ tool.provider.label }} / {{ tool.tool.label }}</p>
            <p class="text-xs text-gray-500 line-clamp-1">{{ tool.tool.description }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <a-button
            class="hidden group-hover:block"
            type="text"
            size="small"
            shape="circle"
            @click="handleSelectTool(tool)"
          >
            <template #icon><icon-settings /></template>
          </a-button>
          <a-button
            class="hidden group-hover:block"
            type="text"
            size="small"
            status="danger"
            shape="circle"
            @click="handleDeleteTool(tool.type, tool.provider.id, tool.tool.id)"
          >
            <template #icon><icon-delete /></template>
          </a-button>
        </div>
      </div>
    </div>

    <template #extra>
      <icon-plus class="text-gray-500 cursor-pointer" size="16" @click.stop="handleAddTool" />
    </template>
  </a-collapse-item>

  <a-drawer
    v-model:visible="toolSettingsVisible"
    width="640px"
    :header="false"
    ok-text="保存"
    @ok="saveSettings"
  >
    <div class="px-3 py-2" v-if="selectedTool">
      <header class="flex items-center justify-between mb-7">
        <div class="flex items-center">
          <a-avatar class="size-6 shrink-0 mr-2" shape="square">
            <img :src="selectedTool.resp.provider.icon" :alt="selectedTool.resp.tool.name" />
          </a-avatar>
          <h1 class="text-lg font-medium text-gray-800 mr-7">{{ selectedTool.resp.tool.label }}</h1>
          <icon-oblique-line class="mr-6" />
          <a-tabs v-model:active-key="tabKey" class="translate-y-2">
            <a-tab-pane key="info" title="信息"></a-tab-pane>
            <a-tab-pane
              v-if="selectedTool.resp.type === 'builtin_tool'"
              key="settings"
              title="设置"
            ></a-tab-pane>
          </a-tabs>
        </div>
        <a-button type="text" size="small" shape="circle" @click="toolSettingsVisible = false">
          <template #icon><icon-close /></template>
        </a-button>
      </header>
      <div v-if="tabKey === 'info'">
        <h2 class="text-sm font-bold text-gray-700 mb-1">工具描述</h2>
        <p class="text-sm text-gray-500 mb-5">{{ selectedTool.resp.tool.description }}</p>
        <div class="flex items-center gap-1 mb-2">
          <span class="font-bold text-xs text-gray-500 leading-3">参数</span>
          <div class="border-b border-b-gray-300 grow"></div>
        </div>
        <div
          v-for="input in selectedTool.data.inputs"
          :key="input.name"
          class="text-xs space-y-1 mb-3"
        >
          <div class="space-x-2">
            <span class="font-bold text-gray-700">{{ input.name }}</span>
            <span class="text-gray-500">{{ formatInputType(input.type) }}</span>
            <span v-if="input.required" class="text-red-700">必填</span>
          </div>
          <p>{{ input.description }}</p>
        </div>
      </div>
      <div v-if="tabKey === 'settings'">
        <a-form :model="settingsForm" layout="vertical">
          <a-form-item
            v-for="param in (selectedTool.data as GetSpecificBuiltinToolResponse['data']).params"
            :key="param.name"
            :label="param.label"
          >
            <a-input v-if="param.type === 'string'" v-model="settingsForm[param.name] as string" />
            <a-input-number
              v-if="param.type === 'number'"
              v-model="settingsForm[param.name] as number"
            />
            <a-switch
              v-if="param.type === 'boolean'"
              v-model="settingsForm[param.name] as boolean"
            />
            <a-select v-if="param.type === 'select'" v-model="settingsForm[param.name]">
              <a-option v-for="option in param.options" :key="option.value" :value="option.value">{{
                option.label
              }}</a-option>
            </a-select>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </a-drawer>

  <a-drawer
    class="no-padding-drawer"
    :visible="toolSelectorVisible"
    width="640px"
    :header="false"
    :footer="false"
    @cancel="handleSelectorClose"
  >
    <div class="w-full h-full flex">
      <div class="w-1/3 h-full bg-gray-100 px-3 py-4">
        <h1 class="text-lg font-bold text-gray-800 mb-4">添加插件</h1>
        <router-link to="/space/tools">
          <a-button type="primary" class="w-full rounded-lg mb-5">
            <template #icon><icon-plus /></template>
            <template #default>创建自定义插件</template>
          </a-button>
        </router-link>
        <div class="space-y-1 mb-4">
          <div
            :class="`flex items-center gap-2 px-3 py-1 cursor-pointer rounded-lg ${toolSelectorTab === 'api' ? 'bg-white' : 'bg-transparent'}`"
            @click="toolSelectorTab = 'api'"
          >
            <icon-file size="16" />自定义插件
          </div>
          <div
            :class="`flex items-center gap-2 px-3 py-1 cursor-pointer rounded-lg ${toolSelectorTab === 'builtin' ? 'bg-white' : 'bg-transparent'}`"
            @click="toolSelectorTab = 'builtin'"
          >
            <icon-relation size="16" />内置
          </div>
        </div>
        <div v-if="toolSelectorTab === 'builtin'">
          <h2 class="text-xs text-gray-500 mb-3">类别</h2>
          <div>
            <div
              :class="`flex items-center gap-2 px-3 py-1 cursor-pointer rounded-lg ${toolSelectorCategory === '' ? 'bg-white' : 'bg-transparent'}`"
              @click="toolSelectorCategory = ''"
            >
              <icon-layers size="16" /> 全部
            </div>
            <div
              v-for="category in categories"
              :key="category.category"
              :class="`flex items-center gap-2 px-3 py-1 cursor-pointer rounded-lg ${toolSelectorCategory === category.category ? 'bg-white' : 'bg-transparent'}`"
              @click="toolSelectorCategory = category.category"
            >
              <span class="size-4 flex items-center" v-html="category.icon"></span>
              {{ category.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="w-2/3 h-full bg-white py-4 px-3 flex flex-col">
        <div class="flex items-center justify-between mb-5 shrink-0">
          <h1 class="text-lg font-bold text-gray-800">
            {{ toolSelectorTab === 'builtin' ? '内置插件' : '自定义插件' }}
          </h1>
          <a-button type="text" shape="circle" @click="handleSelectorClose">
            <template #icon><icon-close /></template>
          </a-button>
        </div>
        <div v-if="toolSelectorTab === 'builtin'" class="grow overflow-y-scroll">
          <div v-for="provider in displayBuiltinTools" :key="provider.name" class="mb-3">
            <h2 class="text-xs text-gray-500 mb-3">{{ provider.label }}</h2>
            <div class="space-y-1">
              <div
                v-for="tool in provider.tools"
                :key="tool.name"
                :class="`group flex items-center justify-between gap-2 px-2 py-1.5 cursor-pointer rounded-lg ${tool.isReferencedTool ? 'bg-blue-50 hover:bg-blue-100 border border-blue-500' : 'hover:bg-gray-100'}`"
              >
                <div class="flex items-center gap-2 min-h-7">
                  <a-avatar
                    :size="20"
                    shape="circle"
                    :image-url="`${API_PREFIX}/builtin-tools/${provider.name}/icon`"
                  />
                  <span>{{ tool.label }}</span>
                </div>
                <a-button
                  v-if="tool.isReferencedTool"
                  type="text"
                  class="rounded-lg hidden group-hover:block"
                  status="danger"
                  size="small"
                  @click="handleDeleteTool('builtin_tool', provider.name, tool.name)"
                  >删除</a-button
                >
                <a-button
                  v-else
                  type="text"
                  size="small"
                  class="rounded-lg hidden group-hover:block"
                  @click="handleReferenceBuiltinTool(provider, tool)"
                  >添加</a-button
                >
              </div>
            </div>
          </div>
        </div>
        <div v-else class="grow overflow-y-scroll">
          <div v-for="provider in displayApiTools" :key="provider.id" class="mb-3">
            <h2 class="text-xs text-gray-500 mb-3">{{ provider.name }}</h2>
            <div class="space-y-1">
              <div
                v-for="tool in provider.tools"
                :key="tool.id"
                :class="`group flex items-center justify-between gap-2 px-2 py-1.5 cursor-pointer rounded-lg ${tool.isReferencedTool ? 'bg-blue-50 hover:bg-blue-100 border border-blue-500' : 'hover:bg-gray-100'}`"
              >
                <div class="flex items-center gap-2 min-h-7">
                  <a-avatar :size="20" shape="circle" :image-url="provider.icon" />
                  {{ tool.name }}
                </div>
                <a-button
                  v-if="tool.isReferencedTool"
                  type="text"
                  class="rounded-lg hidden group-hover:block"
                  status="danger"
                  size="small"
                  @click="handleDeleteTool('api_tool', provider.id, tool.id)"
                  >删除</a-button
                >
                <a-button
                  v-else
                  type="text"
                  size="small"
                  class="rounded-lg hidden group-hover:block"
                  @click="handleReferenceApiTool(provider, tool)"
                  >添加</a-button
                >
              </div>
            </div>
          </div>
          <div class="flex justify-center items-center my-4 text-gray-500 text-sm">
            <span ref="load-more" v-if="needShowLoadMore">
              <icon-loading />
              加载中
            </span>
            <span v-else>数据加载完成</span>
          </div>
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<style scoped></style>
