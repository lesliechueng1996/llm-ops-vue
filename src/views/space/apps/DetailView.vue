<script setup lang="ts">
import ViewAndDebug from '@/components/app/ViewAndDebug.vue'
</script>

<template>
  <div class="w-screen h-screen flex flex-col">
    <header class="w-full h-[74px] bg-gray-100 shrink-0">编排</header>
    <main class="w-full flex-1 flex">
      <!-- 应用编排 -->
      <div class="w-2/3 h-full flex flex-col bg-gray-50">
        <header class="w-full h-16 border-b-[1px] border-gray-200 shrink-0">应用编排</header>
        <div class="w-full flex flex-1">
          <section class="w-1/2">人设与回复逻辑</section>
          <section class="w-1/2">应用能力</section>
        </div>
      </div>
      <div class="w-1/3 h-full">
        <view-and-debug />
      </div>
    </main>
  </div>
</template>

<style scoped></style>
