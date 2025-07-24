<script setup lang="ts">
import type { IOption } from '../types'

const props = defineProps<{
  options: IOption[]
  selectedKey?: string // Текущее выбранное значение (по key)
}>()

const emit = defineEmits<{
  (e: 'update:selected', key: string): void
}>()

const handleChange = (event: Event) => {
  const select = event.target as HTMLSelectElement
  emit('update:selected', select.value)
}
</script>

<template>
  <div class="relative">
    <select
      :value="selectedKey"
      @change="handleChange"
      class="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <option
        v-for="option in props.options"
        :key="option.key"
        :value="option.key"
        class="text-gray-800"
      >
        {{ option.name }}
      </option>
    </select>

    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      <svg
        class="w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  </div>
</template>
