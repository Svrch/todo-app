<script setup lang="ts">
import type { IInputProps } from '../types'

const props = withDefaults(defineProps<IInputProps>(), {
  placeholder: 'Enter something',
})

const model = defineModel()
</script>

<template>
  <div class="space-y-1">
    <input
      v-model="model"
      :placeholder="props.placeholder"
      :class="[
        'w-full px-3 py-2 border rounded-md focus:outline-none',
        'focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
        props.error ? 'border-red-500' : 'border-gray-300',
      ]"
    />
    <p v-if="props.error" class="text-sm text-red-600">{{ props.error }}</p>
  </div>
</template>
