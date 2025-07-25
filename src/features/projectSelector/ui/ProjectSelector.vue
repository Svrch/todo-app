<script setup lang="ts">
import { UiButton } from '../../../shared/components/UiButton'
import { storeToRefs } from 'pinia'
import { useTasksStore } from '../../../shared/store/tasks.ts'

const tasksStore = useTasksStore()
const { projects, selectedProjectId } = storeToRefs(tasksStore)

const handleSelect = (projectId: string) => {
  tasksStore.selectProject(projectId)
}
</script>

<template>
  <div class="flex gap-2 mb-4">
    <UiButton
      v-for="project in projects"
      :key="project.id"
      @click="handleSelect(project.id)"
      :variant="selectedProjectId === project.id ? 'primary' : 'ghost'"
    >
      {{ project.name }}
    </UiButton>

    <UiButton
      variant="secondary"
      @click="tasksStore.addProject('New Project')"
    >
      + New Project
    </UiButton>
  </div>
</template>
