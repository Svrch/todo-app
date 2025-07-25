<script setup lang="ts">
import { ref } from 'vue'
import { useTasksStore } from '../../../shared/store/tasks.ts'
import { storeToRefs } from 'pinia'
import { UiButton } from '../../../shared/components/UiButton'
import { UiInput } from '../../../shared/components/UiInput'

const tasksStore = useTasksStore()
const { projects, selectedProjectId } = storeToRefs(tasksStore)

const isAddingProject = ref(false)
const newProjectName = ref('')
const hoveredProjectId = ref<string | null>(null)

const handleSelect = (projectId: string) => {
  tasksStore.selectProject(projectId)
}

const startAddingProject = () => {
  isAddingProject.value = true
  newProjectName.value = ''
}

const confirmAddProject = () => {
  if (newProjectName.value.trim()) {
    tasksStore.addProject(newProjectName.value.trim())
  }
  cancelAddingProject()
}

const cancelAddingProject = () => {
  isAddingProject.value = false
  newProjectName.value = ''
}

const deleteProject = (projectId: string, event: MouseEvent) => {
  event.stopPropagation()
  if (confirm('Delete this project and all its tasks?')) {
    tasksStore.deleteProject(projectId)
  }
}
</script>

<template>
  <div class="flex flex-wrap gap-2 mb-4">
    <!-- Кнопки существующих проектов -->
    <div
      v-for="project in projects"
      :key="project.id"
      class="relative"
      @mouseenter="hoveredProjectId = project.id"
      @mouseleave="hoveredProjectId = null"
    >
      <UiButton
        @click="handleSelect(project.id)"
        :variant="selectedProjectId === project.id ? 'primary' : 'ghost'"
        class="whitespace-nowrap pr-7"
      >
        {{ project.name }}
      </UiButton>

      <!-- Кнопка удаления (появляется при наведении) -->
      <button
        v-if="hoveredProjectId === project.id"
        @click="deleteProject(project.id, $event)"
        class="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
        title="Delete project"
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
      </button>
    </div>

    <!-- Форма добавления нового проекта -->
    <div v-if="isAddingProject" class="flex items-center gap-2">
      <UiInput
        v-model="newProjectName"
        placeholder="Project name"
        autofocus
        class="w-40"
        @keyup.enter="confirmAddProject"
        @keyup.esc="cancelAddingProject"
      />
      <UiButton
        @click="confirmAddProject"
        variant="primary"
        size="sm"
        :disabled="!newProjectName.trim()"
      >
        Add Project
      </UiButton>
      <UiButton
        @click="cancelAddingProject"
        variant="danger"
        size="sm"
      >
        Cancel
      </UiButton>
    </div>

    <!-- Кнопка добавления проекта (по умолчанию) -->
    <UiButton
      v-else
      @click="startAddingProject"
      variant="secondary"
      class="whitespace-nowrap"
    >
      + New Project
    </UiButton>
  </div>
</template>
