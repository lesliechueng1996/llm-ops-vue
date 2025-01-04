<script setup lang="ts">
import ViewAndDebug from '@/components/space/app/ViewAndDebug.vue'
import PresetPrompt from '@/components/space/app/PresetPrompt.vue'
import { useDraftConfigStore } from '@/stores/draft-config'
import { onMounted } from 'vue'
import AppAbility from '@/components/space/app/AppAbility.vue'

const { loadDraftConfig } = useDraftConfigStore()

onMounted(() => {
  loadDraftConfig()
})
</script>

<template>
  <main class="w-full flex-1 flex min-h-0">
    <!-- 应用编排 -->
    <div class="w-2/3 h-full flex flex-col bg-gray-50">
      <header
        class="w-full h-16 border-b-[1px] border-gray-200 shrink-0 text-xl text-gray-700 px-6 py-[18px]"
      >
        应用编排
      </header>
      <div class="w-full flex flex-1 min-h-0">
        <section class="w-1/2 border-r border-gray-200 h-full">
          <preset-prompt />
        </section>
        <section class="w-1/2 border-r border-gray-200 h-full">
          <app-ability />
        </section>
      </div>
    </div>
    <div class="w-1/3 h-full">
      <view-and-debug />
    </div>
  </main>
</template>

<style scoped></style>
