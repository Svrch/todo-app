<script setup lang="ts">
import { ref } from 'vue'
import type { ITask, TTaskStatus } from '../types'
import { UiInput } from '../../../shared/components/UiInput'
import { UiButton } from '../../../shared/components/UiButton'
import { UiSelect } from '../../../shared/components/UiSelect'
import { statusOptions } from '../../../shared/composables/statusOptions.ts'

const props = defineProps<{
  task: ITask
}>()

const emit = defineEmits<{
  (e: 'update:status', taskId: string, newStatus: TTaskStatus): void
  (e: 'delete', taskId: string): void
  (e: 'add-tag', taskId: string, tag: string): void
  (e: 'remove-tag', taskId: string, tag: string): void
  (e: 'add-subtask', taskId: string, title: string): void
  (e: 'delete-subtask', taskId: string, subtaskId: string): void
  (e: 'update-subtask-status', taskId: string, subtaskId: string, status: TTaskStatus): void
  (e: 'update-title', taskId: string, newTitle: string): void
}>()

// Локальные состояния для редактирования
const isEditing = ref(false)
const editTitle = ref(props.task.title)
const newTag = ref('')
const newSubtask = ref('')

// Обработчики действий
const handleStatusChange = (newStatus: string) => {
  emit('update:status', props.task.id, newStatus as TTaskStatus)
}

const handleDelete = () => {
  emit('delete', props.task.id)
}

const handleAddTag = () => {
  if (newTag.value.trim()) {
    emit('add-tag', props.task.id, newTag.value.trim())
    newTag.value = ''
  }
}

const handleRemoveTag = (tag: string) => {
  emit('remove-tag', props.task.id, tag)
}

const handleAddSubtask = () => {
  if (newSubtask.value.trim()) {
    emit('add-subtask', props.task.id, newSubtask.value.trim())
    newSubtask.value = ''
  }
}

const handleTitleUpdate = () => {
  if (editTitle.value !== props.task.title) {
    emit('update-title', props.task.id, editTitle.value)
  }
  isEditing.value = false
}

const handleDeleteSubtask = (subtaskId: string) => {
  emit('delete-subtask', props.task.id, subtaskId)
}

const handleSubtaskStatusChange = (subtaskId: string, status: string) => {
  emit('update-subtask-status', props.task.id, subtaskId, status as TTaskStatus)
}
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
    <!-- Заголовок и статус -->
    <div class="p-3 space-y-2">
      <div class="flex items-start justify-between gap-2">
        <!-- Название задачи -->
        <div class="flex-1 min-w-0">
          <UiInput
            v-if="isEditing"
            v-model="editTitle"
            class="text-base font-medium w-full"
            autofocus
            @blur="handleTitleUpdate"
            @keyup.enter="handleTitleUpdate"
          />
          <h3
            v-else
            @click="isEditing = true"
            class="text-base font-medium truncate cursor-text hover:bg-gray-50 px-1 -ml-1 rounded"
          >
            {{ task.title }}
          </h3>
        </div>

        <!-- Статус и кнопка удаления -->
        <div class="flex items-center gap-1">
          <UiSelect
            :options="statusOptions"
            :selected-key="task.status"
            @update:selected="handleStatusChange"
            class="text-xs w-28"
          />
          <UiButton
            variant="ghost"
            size="xs"
            class="!p-1 text-gray-400 hover:text-red-500"
            title="Delete task"
            @click="handleDelete"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </UiButton>
        </div>
      </div>

      <!-- Теги -->
      <div class="flex items-center justify-between gap-2">
        <div class="flex flex-1 flex-wrap gap-1 items-center overflow-hidden">
          <span
            v-for="tag in task.tags"
            :key="tag"
            class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50 text-indigo-700"
          >
            {{ tag }}
            <button
              @click="handleRemoveTag(tag)"
              class="ml-0.5 text-indigo-300 hover:text-indigo-500 text-xs"
            >
              ×
            </button>
          </span>

          <UiInput
            v-model="newTag"
            placeholder="+Tag"
            class="text-xs !py-1 !px-2 w-16 min-w-0"
            @keyup.enter="handleAddTag"
          />
        </div>

        <div class="text-xs text-gray-400 whitespace-nowrap ml-2">
          {{ new Date(task.updatedAt).toLocaleDateString('en', { month: 'short', day: 'numeric' }) }}
        </div>
      </div>
    </div>

    <!-- Подзадачи -->
    <div v-if="task.subtasks.length > 0" class="px-3 py-2 border-t border-gray-100">
      <ul class="space-y-2">
        <li
          v-for="subtask in task.subtasks"
          :key="subtask.id"
          class="flex items-center gap-2 text-sm"
        >

          <span class="text-xs text-gray-600 truncate flex-1">
            {{ subtask.title }}
          </span>

          <UiSelect
            :options="statusOptions"
            :selected-key="subtask.status"
            @update:selected="(status) => handleSubtaskStatusChange(subtask.id, status)"
            size="xs"
            class="w-24"
          />

          <UiButton
            variant="ghost"
            size="xs"
            class="!p-1 text-gray-400 hover:text-red-500"
            @click="handleDeleteSubtask(subtask.id)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </UiButton>
        </li>
      </ul>
    </div>

    <!-- Добавление подзадачи -->
    <div class="px-3 py-2 border-t border-gray-100 bg-gray-50">
      <div class="flex gap-2">
        <UiInput
          v-model="newSubtask"
          placeholder="Add subtask..."
          class="flex-1"
          @keyup.enter="handleAddSubtask"
        />
        <UiButton
          variant="primary"
          size="sm"
          @click="handleAddSubtask"
        >
          Add
        </UiButton>
      </div>
    </div>
  </div>
</template>
