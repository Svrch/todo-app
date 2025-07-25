<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTasksStore } from '../../../shared/store/tasks.ts'
import { useTasksFilterStore } from '../store/tasksFilter.ts'
import type { TTaskStatus } from '../../TaskCard/types'
import ProjectSelector from '../../../features/projectSelector'
import { UiInput } from '../../../shared/components/UiInput'
import AddTask from '../../../features/addTask'
import { UiButton } from '../../../shared/components/UiButton'
import TaskCard from '../../TaskCard'
import { ref } from 'vue'
import { statusOptions } from '../../../shared/composables/statusOptions.ts'

const tasksStore = useTasksStore()
const tasksFilterStore = useTasksFilterStore()

const isCreatingTask = ref(false)

const { currentProject, projects } = storeToRefs(tasksStore)
const {
  searchQuery,
  selectedStatuses,
  selectedTags,
  allTags,
  filteredTasks,
  filteredCount,
  hasActiveFilters,
} = storeToRefs(tasksFilterStore)

// Обработчики задач
const handleStatusUpdate = (taskId: string, newStatus: TTaskStatus) => {
  tasksStore.updateTaskStatus(taskId, newStatus)
}

const handleDeleteTask = (taskId: string) => {
  tasksStore.deleteTask(taskId)
}

const handleAddTag = (taskId: string, tag: string) => {
  tasksStore.addTagToTask(taskId, tag)
}

const handleRemoveTag = (taskId: string, tag: string) => {
  tasksStore.removeTagFromTask(taskId, tag)
}

const handleAddSubtask = (taskId: string, title: string) => {
  tasksStore.addSubtask(taskId, title)
}

const handleUpdateTitle = (taskId: string, newTitle: string) => {
  tasksStore.updateTaskTitle(taskId, newTitle)
}

const handleDeleteSubtask = (taskId: string, subtaskId: string) => {
  tasksStore.deleteSubtask(taskId, subtaskId)
}

const handleSubtaskStatusChange = (taskId: string, subtaskId: string, status: TTaskStatus) => {
  tasksStore.updateSubtaskStatus(taskId, subtaskId, status)
}

const handleClearFilters = () => {
  tasksFilterStore.resetFilters()
}
</script>

<template>
  <div class="space-y-6 w-3/5">
    {{projects}}
    <!-- Селектор проекта -->
    <ProjectSelector />

    <!-- Панель управления и фильтров -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-3 space-y-3">
      <!-- Поиск и добавление задачи -->
      <div class="flex gap-3 items-end">
        <UiInput
          v-model="searchQuery"
          placeholder="Search tasks..."
          class="flex-1"
        />
      </div>

      <!-- Фильтры -->
      <div class="flex flex-col gap-2">
        <!-- Фильтр по статусам -->
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-500 whitespace-nowrap">Status:</span>
          <div class="flex flex-wrap gap-1">
            <UiButton
              v-for="status in statusOptions"
              :key="status.key"
              :variant="selectedStatuses.includes(status.key) ? 'primary' : 'ghost'"
              size="xs"
              @click="tasksFilterStore.toggleStatus(status.key)"
              class="!px-2 !py-1"
            >
              {{ status.name }}
            </UiButton>
          </div>
        </div>

        <!-- Фильтр по тегам -->
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-500 whitespace-nowrap">Tags:</span>
          <div class="flex flex-wrap gap-1">
            <template v-if="allTags.length > 0">
              <UiButton
                v-for="tag in allTags"
                :key="tag"
                :variant="selectedTags.includes(tag) ? 'primary' : 'ghost'"
                size="xs"
                @click="tasksFilterStore.toggleTag(tag)"
                class="!px-2 !py-1"
              >
                {{ tag }}
              </UiButton>
            </template>
            <span v-else class="text-xs text-gray-400">No tags</span>
          </div>
        </div>
      </div>

      <!-- Активные фильтры -->
      <div
        v-if="hasActiveFilters"
        class="pt-2 mt-2 border-t border-gray-100"
      >
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs text-gray-500">Active filters:</span>

          <template v-for="status in selectedStatuses" :key="`status-${status}`">
            <div class="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-indigo-50 text-indigo-700">
              {{ statusOptions.find(s => s.key === status)?.name }}
              <button
                @click="tasksFilterStore.toggleStatus(status)"
                class="ml-1 text-indigo-300 hover:text-indigo-500"
              >
                ×
              </button>
            </div>
          </template>

          <template v-for="tag in selectedTags" :key="`tag-${tag}`">
            <div class="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-indigo-50 text-indigo-700">
              {{ tag }}
              <button
                @click="tasksFilterStore.toggleTag(tag)"
                class="ml-1 text-indigo-300 hover:text-indigo-500"
              >
                ×
              </button>
            </div>
          </template>

          <UiButton
            variant="ghost"
            size="xs"
            @click="handleClearFilters"
            class="!px-2 !py-0.5 text-xs text-gray-500 hover:text-indigo-600"
          >
            Clear all
          </UiButton>
        </div>
      </div>
    </div>
    <AddTask v-model="isCreatingTask" />

    <!-- Статистика -->
    <div class="text-sm text-gray-500">
      <template v-if="currentProject">
        Showing {{ filteredCount }} of {{ currentProject.tasks.length }} tasks in "{{ currentProject.name }}"
      </template>
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
        <template v-if="hasActiveFilters">
          No tasks match your filters. <button
            @click="handleClearFilters"
            class="text-indigo-500 hover:underline"
          >
            Clear filters
          </button>
        </template>
        <template v-else>
          No tasks in this project yet. Create your first task!
        </template>
      </div>
    </div>
  </div>
</template>
