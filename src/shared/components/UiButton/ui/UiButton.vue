<script setup lang="ts">
import type { IButtonProps } from '../types'

const props = withDefaults(defineProps<IButtonProps>(), {
  variant: 'primary',
})
</script>

<template>
  <button
    :disabled="props.disabled || props.loading"
    :class="[
      'px-4 py-1 rounded-md transition-colors cursor-pointer',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      {
        'bg-indigo-600 text-white hover:bg-indigo-700 ': props.variant === 'primary',
        'bg-gray-100 text-gray-800 hover:bg-gray-200 ': props.variant === 'secondary',
        'text-gray-700 hover:bg-gray-100': props.variant === 'ghost',
        'bg-red-500 text-white hover:bg-red-600': props.variant === 'danger',
      },
    ]"
  >
    <span v-if="props.loading" class="inline-flex items-center">
      <svg class="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
          fill="none"
        />
      </svg>
      Loading...
    </span>
    <span v-else>
      <slot />
    </span>
  </button>
</template>
