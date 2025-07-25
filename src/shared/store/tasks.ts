// store/tasks.ts
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { ITask, Project, TTaskStatus } from '../../widgets/TaskCard/types'
import { loadFromStorage, saveToStorage } from '../composables/localStorage.ts'

export const useTasksStore = defineStore('tasks', () => {
  // Состояние
  // Загрузка проектов из localStorage при инициализации
  const initialData = loadFromStorage()
  const projects = ref<Project[]>(initialData?.projects || [])
  const selectedProjectId = ref<string>(initialData?.projects[0].id ? initialData?.projects[0].id : '')

  // Сохранение при изменении проектов
  watch(projects, (newProjects) => {
    const currentData = loadFromStorage() || { filters: {} }
    saveToStorage({
      projects: newProjects,
      filters: currentData.filters,
    })
  }, { deep: true })

  const currentProject = computed(() =>
    projects.value.find(project => project.id === selectedProjectId.value),
  )

  const currentTasks = computed(() =>
    currentProject.value?.tasks || [],
  )

  const projectNames = computed(() =>
    projects.value.map(project => ({
      id: project.id,
      name: project.name,
    })),
  )

  // Методы для проектов
  const selectProject = (projectId: string) => {
    if (projects.value.some(project => project.id === projectId)) {
      selectedProjectId.value = projectId
    }
  }

  const addProject = (name: string): Project => {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      tasks: [],
    }
    projects.value.push(newProject)
    selectProject(newProject.id)
    return newProject
  }

  const deleteProject = (projectId: string) => {
    if (projectId === 'default') return // Нельзя удалить default проект

    projects.value = projects.value.filter(p => p.id !== projectId)
    if (selectedProjectId.value === projectId) {
      selectedProjectId.value = 'default'
    }
  }

  // Методы для задач
  const addTask = (taskData: Omit<ITask, 'id' | 'createdAt' | 'updatedAt'>): ITask | undefined => {
    const project = currentProject.value
    if (!project) return

    const newTask: ITask = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    project.tasks.unshift(newTask)
    return newTask
  }

  const updateTaskStatus = (taskId: string, newStatus: TTaskStatus) => {
    const project = currentProject.value
    const task = project?.tasks.find(t => t.id === taskId)

    if (task) {
      task.status = newStatus
      task.updatedAt = new Date()
    }
  }

  const deleteTask = (taskId: string) => {
    const project = currentProject.value
    if (!project) return

    project.tasks = project.tasks.filter(t => t.id !== taskId)
  }

  const updateTaskTitle = (taskId: string, newTitle: string) => {
    const project = currentProject.value
    const task = project?.tasks.find(t => t.id === taskId)

    if (task) {
      task.title = newTitle
      task.updatedAt = new Date()
    }
  }

  // Методы для тегов
  const addTagToTask = (taskId: string, tag: string) => {
    const project = currentProject.value
    const task = project?.tasks.find(t => t.id === taskId)

    if (task && !task.tags.includes(tag)) {
      task.tags.push(tag)
      task.updatedAt = new Date()
    }
  }

  const removeTagFromTask = (taskId: string, tag: string) => {
    const project = currentProject.value
    const task = project?.tasks.find(t => t.id === taskId)

    if (task) {
      task.tags = task.tags.filter(t => t !== tag)
      task.updatedAt = new Date()
    }
  }

  // Методы для подзадач
  const addSubtask = (taskId: string, title: string): ITask | undefined => {
    const project = currentProject.value
    const task = project?.tasks.find(t => t.id === taskId)

    if (!task) return

    const newSubtask: ITask = {
      id: Date.now().toString(),
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      status: 'todo',
      subtasks: [],
    }

    task.subtasks.push(newSubtask)
    task.updatedAt = new Date()
    return newSubtask
  }

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    const project = currentProject.value
    const task = project?.tasks.find(t => t.id === taskId)

    if (task) {
      task.subtasks = task.subtasks.filter(s => s.id !== subtaskId)
      task.updatedAt = new Date()
    }
  }

  const updateSubtaskStatus = (
    taskId: string,
    subtaskId: string,
    status: TTaskStatus,
  ) => {
    const project = currentProject.value
    const task = project?.tasks.find(t => t.id === taskId)
    const subtask = task?.subtasks.find(s => s.id === subtaskId)

    if (subtask) {
      subtask.status = status
      subtask.updatedAt = new Date()
      task!.updatedAt = new Date()
    }
  }

  return {
    // Состояние
    projects,
    selectedProjectId,
    currentProject,
    currentTasks,
    projectNames,

    // Методы проектов
    selectProject,
    addProject,
    deleteProject,

    // Методы задач
    addTask,
    updateTaskStatus,
    deleteTask,
    updateTaskTitle,

    // Методы тегов
    addTagToTask,
    removeTagFromTask,

    // Методы подзадач
    addSubtask,
    deleteSubtask,
    updateSubtaskStatus,
  }
})
