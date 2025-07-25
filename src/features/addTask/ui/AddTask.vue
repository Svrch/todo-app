<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTasksStore } from '../../../shared/store/tasks.ts'
import type { TTaskStatus } from '../../../widgets/TaskCard/types'
import { UiButton } from '../../../shared/components/UiButton'
import { UiInput } from '../../../shared/components/UiInput'
import { UiSelect } from '../../../shared/components/UiSelect'
import { statusOptions } from '../../../shared/composables/statusOptions.ts'

const props = defineProps<{
  modelValue?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const tasksStore = useTasksStore()
const newTaskTitle = ref('')
const taskStatus = ref<TTaskStatus>('todo')

const isOpen = computed({
  get: () => props.modelValue || false,
  set: (val) => emit('update:modelValue', val),
})

const handleStatusChange = (status: string) => {
  taskStatus.value = status as TTaskStatus
}

const handleAdd = () => {
  if (newTaskTitle.value.trim()) {
    tasksStore.addTask({
      title: newTaskTitle.value.trim(),
      status: taskStatus.value,
      tags: [],
      subtasks: [],
    })
    resetForm()
  }
}

const handleCancel = () => {
  resetForm()
}

const resetForm = () => {
  newTaskTitle.value = ''
  taskStatus.value = 'todo'
  isOpen.value = false
}
</script>

<template>
  <div>
    <UiButton
      v-if="!isOpen"
      @click="isOpen = true"
      variant="primary"
      class="w-full sm:w-auto"
    >
      Add Task
    </UiButton>

    <div
      v-else
      class="bg-white rounded-xl border-2 border-dashed border-gray-300 p-4 space-y-3"
    >
      <div class="space-y-2">
        <UiInput
          v-model="newTaskTitle"
          placeholder="Task title"
          autofocus
          class="w-full"
          @keyup.enter="handleAdd"
        />

        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-500">Status:</span>
          <UiSelect
            :options="statusOptions"
            :selected-key="taskStatus"
            @update:selected="handleStatusChange"
            class="text-xs w-28"
          />
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-2">
        <UiButton
          @click="handleCancel"
          variant="ghost"
          size="sm"
        >
          Cancel
        </UiButton>
        <UiButton
          @click="handleAdd"
          variant="primary"
          size="sm"
          :disabled="!newTaskTitle.trim()"
        >
          Add Task
        </UiButton>
      </div>
    </div>
  </div>
</template>
