<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

defineProps<{
  placeholder: string
}>()

const searchWord = ref('')
const router = useRouter()
const route = useRoute()

const commitSearch = (event: FocusEvent | KeyboardEvent) => {
  const target = event.target as HTMLInputElement
  target.blur()
  router.push({ query: { search: searchWord.value } })
}

onMounted(() => {
  const search = route.query.search
  if (search) {
    searchWord.value = search as string
  }
})
</script>

<template>
  <a-input
    class="w-52 rounded-lg bg-white border border-gray-200"
    :placeholder="placeholder"
    allow-clear
    v-model="searchWord"
    @press-enter="commitSearch"
    @blur="commitSearch"
  >
    <template #prefix>
      <icon-search />
    </template>
  </a-input>
</template>

<style scoped></style>
