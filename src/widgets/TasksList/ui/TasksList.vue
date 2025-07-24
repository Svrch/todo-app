<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { UiInput } from '../../../shared/components/UiInput'
import { UiButton } from '../../../shared/components/UiButton'
import TaskCard from '../../TaskCard'
import { useTasksStore } from '../../../shared/store/tasks.ts'
import { useTasksFilterStore } from '../store/tasksFilter.ts'
import type { TTaskStatus } from '../../TaskCard/types'

const taskStore = useTasksStore()
const { tasks } = storeToRefs(taskStore)

const taskFilterStore = useTasksFilterStore()
const { searchQuery,
  selectedStatuses,
  selectedTags,
  allTags,
  filteredTasks } = storeToRefs(taskFilterStore)

const handleStatusUpdate = (taskId: string, newStatus: TTaskStatus) => {
  taskStore.updateTaskStatus(taskId, newStatus)
}

const handleDeleteTask = (taskId: string) => {
  taskStore.deleteTask(taskId)
}

const handleAddTag = (taskId: string, tag: string) => {
  taskStore.addTagToTask(taskId, tag)
}

const handleRemoveTag = (taskId: string, tag: string) => {
  taskStore.removeTagFromTask(taskId, tag)
}

const handleAddSubtask = (taskId: string, title: string) => {
  taskStore.addSubtask(taskId, title)
}

const handleUpdateTitle = (taskId: string, newTitle: string) => {
  taskStore.updateTaskTitle(taskId, newTitle)
}

const handleDeleteSubtask = (taskId: string, subtaskId: string) => {
  taskStore.deleteSubtask(taskId, subtaskId)
}

const handleSubtaskStatusChange = (taskId: string, subtaskId: string, status: TTaskStatus) => {
  taskStore.updateSubtaskStatus(taskId, subtaskId, status)
}
</script>

<template>
  <div class="space-y-6 w-3/5">
    <!-- Панель фильтров -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
      <div class="flex flex-col gap-3">
        <!-- Поиск по названию -->
        <div class="flex-1 min-w-0">
          <UiInput
            v-model="searchQuery"
            placeholder="Search tasks..."
            class="text-sm"
          />
        </div>
        <!-- Фильтр по статусам -->
        <div class="flex-1 min-w-0">
          <div class="flex gap-1.5 items-center">
            <span class="text-xs text-gray-500 mr-1">Status:</span>
            <UiButton
              v-for="status in taskFilterStore.statusOptions"
              :key="status.key"
              :variant="selectedStatuses.includes(status.key) ? 'primary' : 'ghost'"
              size="xs"
              @click="taskFilterStore.toggleStatus(status.key)"
              class="!px-2 !py-1"
            >
              <div class="whitespace-nowrap">
                {{ status.name }}
              </div>
            </UiButton>
          </div>
        </div>

        <!-- Фильтр по тегам -->
        <div class="flex-1 min-w-0">
          <div class="flex gap-1.5 items-center">
            <span class="text-xs text-gray-500 mr-1">Tags:</span>
            <template v-if="allTags.length > 0">
              <UiButton
                v-for="tag in allTags"
                :key="tag"
                :variant="selectedTags.includes(tag) ? 'primary' : 'ghost'"
                size="xs"
                @click="taskFilterStore.toggleTag(tag)"
                class="!px-2 !py-1"
              >
                {{ tag }}
              </UiButton>
            </template>
            <span v-else class="text-xs text-gray-400">No tags</span>
          </div>
        </div>
      </div>

      <!-- Чипсы активных фильтров -->
      <div v-if="selectedStatuses.length > 0 || selectedTags.length > 0" class="mt-2 pt-2 border-t border-gray-100">
        <div class="flex flex-wrap gap-1.5 items-center">
          <span class="text-xs text-gray-500">Active filters:</span>

          <template v-for="status in selectedStatuses" :key="'status-'+status">
            <div class="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-indigo-50 text-indigo-700">
              {{  taskFilterStore.statusOptions.find(s => s.key === status)?.name }}
              <button @click="taskFilterStore.toggleStatus(status)" class="ml-1 text-indigo-300 hover:text-indigo-500">
                ×
              </button>
            </div>
          </template>

          <template v-for="tag in selectedTags" :key="'tag-'+tag">
            <div class="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-indigo-50 text-indigo-700">
              {{ tag }}
              <button @click="taskFilterStore.toggleTag(tag)" class="ml-1 text-indigo-300 hover:text-indigo-500">
                ×
              </button>
            </div>
          </template>

          <UiButton
            variant="ghost"
            size="xs"
            @click="() => { selectedStatuses = []; selectedTags = [] }"
            class="!px-2 !py-0.5 text-xs text-gray-500 hover:text-indigo-600"
          >
            Clear all
          </UiButton>
        </div>
      </div>
    </div>

    <!-- Счетчик задач -->
    <div class="text-sm text-gray-500">
      Showing {{ filteredTasks.length }} of {{ tasks.length }} tasks
    </div>

    <!-- Список задач -->
    <div class="grid gap-4">
      <TaskCard
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        @update:status="handleStatusUpdate"
        @delete="handleDeleteTask"
        @add-tag="handleAddTag"
        @remove-tag="handleRemoveTag"
        @add-subtask="handleAddSubtask"
        @update-title="handleUpdateTitle"
        @update-subtask-status="handleSubtaskStatusChange"
        @delete-subtask="handleDeleteSubtask"
      />

      <!-- Пустое состояние -->
      <div
        v-if="filteredTasks.length === 0"
        class="text-center py-8 text-gray-400"
      >
        No tasks found. Try adjusting your filters.
      </div>
    </div>
  </div>
</template>
