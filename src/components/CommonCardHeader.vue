<script setup lang="ts">
export type CardHeader = {
  label: string
  icon: string
  background?: string
  href?: string
}

const { label, icon, background = '#FFF', href } = defineProps<CardHeader>()
</script>

<template>
  <div class="flex items-center gap-3">
    <a-avatar
      class="w-10 h-10 shrink-0"
      shape="square"
      :imageUrl="icon"
      :style="{ backgroundColor: background }"
    ></a-avatar>
    <div class="grow">
      <p v-if="!href" class="text-gray-700 font-bold text-base">{{ label }}</p>
      <router-link :to="href" v-else class="text-gray-700 font-bold text-base">{{
        label
      }}</router-link>
      <p class="text-gray-500 text-xs">
        <slot name="name" />
      </p>
    </div>
    <div class="shrink-0">
      <slot name="operation" />
    </div>
  </div>
</template>

<style scoped></style>
